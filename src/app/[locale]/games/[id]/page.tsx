"use client";

import ContentLayout from "@/components/ContentLayout";
import { config, permissions, VOTE_OPTION } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { Box, CircularProgress } from "@mui/material";
import { GetOneGame, PostVote } from "../types";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import GameDetail from "./_components/GameDetail";

export default function GamesEditPage() {
  const t = useTranslations();
  useDocumentTitle(t("games.detail.title"));

  const { id } = useParams();

  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);

  const [game, setGame] = useState<GetOneGame["response"]>();
  const [isVoteLoading, setIsVoteLoading] = useState(false);

  useEffect(() => {
    if (typeof id !== "string") return;

    const fetchGame = async () => {
      try {
        const { data } = await axiosClient.get<GetOneGame["response"]>(
          config.endpoints.games.detail.replace(":id", id)
        );

        setGame(data);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchGame();
  }, [id]);

  if (typeof id !== "string" || !authUser) return;
  const canUpdate = permissions["moderator"].includes(authUser.role);

  const onVoteChange = async (status: VOTE_OPTION) => {
    try {
      setIsVoteLoading(true);
      await axiosClient.post<PostVote["response"]>(
        config.endpoints.games.vote.replace(":id", id),
        { vote: status }
      );
      const { data: gameData } = await axiosClient.get<GetOneGame["response"]>(
        config.endpoints.games.detail.replace(":id", id)
      );
      setGame(gameData);

      toast.success(t("games.voting.updateSuccess"));
    } catch (e) {
      toast.error(t("games.voting.updateError"));
      console.error(e);
    } finally {
      setIsVoteLoading(false);
    }
  };

  if (!game)
    return (
      <Box className="flex justify-center items-center flex-1 mb-[10%]">
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <ContentLayout
      title={t("games.detail.title")}
      endContent={[
        {
          text: t("games.detail.editButton"),
          icon: <EditIcon />,
          variant: "contained",
          color: "inherit",
          show: canUpdate,
          onClick: () =>
            router.push(config.routes.games.edit.replace(":id", id)),
        },
      ]}
    >
      <GameDetail
        {...game}
        isVoteLoading={isVoteLoading}
        onVoteChange={onVoteChange}
        canUpdate={canUpdate}
      />
    </ContentLayout>
  );
}
