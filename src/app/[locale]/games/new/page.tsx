"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useTransition } from "react";
import { GameForm } from "../_components/GameForm";
import { IGameForm, PostGame } from "../types";
import { axiosClient } from "@/utils/axiosClient";

export default function GamesNewPage() {
  const t = useTranslations("games.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [isCreatePending, startCreateTransition] = useTransition();

  const onSubmit = (newGameData: IGameForm) => {
    startCreateTransition(async () => {
      try {
        await axiosClient.post<PostGame["response"]>(
          config.endpoints.games.new,
          newGameData
        );
        toast.success(t("createSuccess"));
        router.push(config.routes.games.list);
      } catch (e) {
        toast.error(t("createError"));
        console.error(e);
      }
    });
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={[
        {
          text: t("addButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "game_form",
          loading: isCreatePending,
        },
      ]}
    >
      <GameForm onSubmitData={onSubmit} />
    </ContentLayout>
  );
}
