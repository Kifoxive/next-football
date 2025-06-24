"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useState } from "react";
import { GameForm } from "../_components/GameForm";
import { IGameForm } from "../types";
import { axiosClient } from "@/utils/axiosClient";

export default function GamesNewPage() {
  const t = useTranslations("games.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const onSubmit = async (newGameData: IGameForm) => {
    setIsCreateLoading(true);

    try {
      await axiosClient.post(config.endpoints.games.new, newGameData);
      toast.success(t("createSuccess"));
      router.push(config.routes.games.list);
    } catch {
      toast.error(t("createError"));
    } finally {
      setIsCreateLoading(false);
    }
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
          loading: isCreateLoading,
        },
      ]}
    >
      <GameForm onSubmitData={onSubmit} isLoading={isCreateLoading} />
    </ContentLayout>
  );
}
