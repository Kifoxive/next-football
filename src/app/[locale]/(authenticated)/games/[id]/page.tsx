"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config, permissions, VOTE_OPTION } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { GetOneGame, PostVote } from "../types";
import EditIcon from "@mui/icons-material/Edit";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import GameDetail from "./_components/GameDetailTab/GameDetail";
import GameActionTab from "./_components/GameActionTab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import GameLobby from "./_components/GameLobbyTab/GameLobby";

type TabItem = "detail" | "lobby" | "action" | "stats";

export default function GamesDetailPage() {
  const t = useTranslations();
  useDocumentTitle(t("games.detail.title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authUser = useAuthStore((s) => s.user);
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isVotePending, startVoteTransition] = useTransition();
  const [game, setGame] = useState<GetOneGame["response"]>();

  const tabItems = ["detail", "stats"];
  // Insert lobby and action tabs if user has moderator permissions
  if (authUser) {
    if (permissions["moderator"].includes(authUser.role))
      tabItems.splice(1, 0, "lobby", "action");
    else if (game?.moderators?.some(({ value }) => value === authUser?.id))
      tabItems.splice(1, 0, "action");
  }

  // set active tab from URL query param
  const tabParam = searchParams.get("tab") as TabItem | null;
  const [selectedTab, setSelectedTab] = useState<TabItem>(
    tabParam && tabItems.includes(tabParam) ? tabParam : "detail"
  );

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data } = await axiosClient.get<GetOneGame["response"]>(
          config.endpoints.games.detail.replace(":id", id)
        );

        setGame(data);
      } catch (e) {
        toast.error(t("games.detail.fetchError"));
        console.error(e);
      }
    };
    fetchGame();
  }, [id]);

  const canUpdate =
    !!authUser && permissions["moderator"].includes(authUser.role);

  const onVoteChange = (status: VOTE_OPTION) => {
    startVoteTransition(async () => {
      try {
        await axiosClient.post<PostVote["response"]>(
          config.endpoints.games.vote.replace(":id", id),
          { vote: status }
        );
        const { data: gameData } = await axiosClient.get<
          GetOneGame["response"]
        >(config.endpoints.games.detail.replace(":id", id));
        setGame(gameData);

        toast.success(t("games.voting.updateSuccess"));
      } catch (e) {
        toast.error(t("games.voting.updateError"));
        console.error(e);
      }
    });
  };

  const onLobbyUpdate = ({
    participants,
    moderators,
  }: {
    participants: string[];
    moderators: string[];
  }) => {
    startUpdateTransition(() => {
      toast.promise(
        axiosClient.put(config.endpoints.games.edit.replace(":id", id), {
          participants,
          moderators,
        }),
        {
          loading: t("games.lobby.updateLoading"),
          success: t("games.lobby.updateSuccess"),
          error: t("games.lobby.updateError"),
        }
      );
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: TabItem) => {
    const updateQuery = (key: string, value: string) => {
      // Create a new URLSearchParams object from the current params
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value); // Add or update the param
      } else {
        params.delete(key); // Remove if value is empty
      }

      // Push the new URL without reloading the page
      router.push(`?${params.toString()}`);
    };

    updateQuery("tab", newValue);
    setSelectedTab(newValue);
  };

  return (
    <ContentLayout
      title={t("games.detail.title")}
      isLoading={!game}
      endContent={[
        {
          text: t("games.detail.editButton"),
          icon: <EditIcon />,
          variant: "contained",
          color: "inherit",
          show: canUpdate && selectedTab === "detail",
          onClick: () =>
            router.push(config.routes.games.edit.replace(":id", id)),
        },
        {
          text: t("games.lobby.updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "lobby_form",
          show: canUpdate && selectedTab === "lobby",
          loading: isUpdatePending,
        },
      ]}
    >
      {game && (
        <TabContext value={selectedTab}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 4 }}
          >
            <TabList onChange={handleChange} aria-label="Games tab">
              {tabItems.map((item) => (
                <Tab label={t(`games.tab.${item}`)} value={item} key={item} />
              ))}
            </TabList>
          </Box>
          <TabPanel value="detail" sx={{ padding: 0 }}>
            <GameDetail
              {...game}
              isVoteLoading={isVotePending}
              onVoteChange={onVoteChange}
              canUpdate={canUpdate}
            />
          </TabPanel>
          <TabPanel value="lobby" sx={{ padding: 0 }}>
            <GameLobby
              selectedParticipants={game.participants}
              selectedModerators={game.moderators}
              onLobbyUpdate={onLobbyUpdate}
            />
          </TabPanel>
          <TabPanel value="action" sx={{ padding: 0 }}>
            <GameActionTab
              gameId={game.id}
              game={game}
              isLoading={isUpdatePending}
              onGameStatusChange={(updatedGame) => {
                setGame((prevGame) => ({ ...prevGame!, ...updatedGame }));
              }}
            />
          </TabPanel>
          <TabPanel value="stats" sx={{ padding: 0 }}>
            Item Three
          </TabPanel>
        </TabContext>
      )}
    </ContentLayout>
  );
}
