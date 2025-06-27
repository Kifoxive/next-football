"use client";

import ContentLayout from "@/components/ContentLayout";
import { config, permissions, VOTE_OPTION } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { GetOneGame, PostVote } from "../types";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import GameDetail from "./_components/GameDetail";

export default function GamesDetailPage() {
  const t = useTranslations();
  useDocumentTitle(t("games.detail.title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [isVotePending, startVoteTransition] = useTransition();
  const [game, setGame] = useState<GetOneGame["response"]>();

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
          show: canUpdate,
          onClick: () =>
            router.push(config.routes.games.edit.replace(":id", id)),
        },
      ]}
    >
      {game && (
        <GameDetail
          {...game}
          isVoteLoading={isVotePending}
          onVoteChange={onVoteChange}
          canUpdate={canUpdate}
        />
      )}
    </ContentLayout>
  );
}
