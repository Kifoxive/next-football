"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useEffect, useState, useTransition } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { GameForm } from "../../_components/GameForm";
import { GetOneGame, IGameForm } from "../../types";
import Dialog from "@/components/Dialog/Dialog";

export default function GamesEditPage() {
  const t = useTranslations("games.edit");
  useDocumentTitle(t("title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();
  const [game, setGame] = useState<GetOneGame["response"]>();

  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data } = await axiosClient.get(
          config.endpoints.games.edit.replace(":id", id)
        );

        setGame(data);
      } catch (e) {
        toast.error(t("fetchError"));
        console.log(e);
      }
    };
    fetchGame();
  }, [id]);

  // this code do not wait till router.push is executed
  const onSubmit = (newGameData: IGameForm) => {
    startUpdateTransition(() => {
      toast.promise(
        axiosClient
          .put(config.endpoints.games.edit.replace(":id", id), newGameData)
          .then(() => router.push(config.routes.games.list)),
        {
          loading: t("update.loading"),
          success: t("update.success"),
          error: t("update.error"),
        }
      );
    });
  };

  const onRemove = () => {
    startRemoveTransition(async () => {
      toast.promise(
        axiosClient
          .delete(config.endpoints.games.delete.replace(":id", id))
          .then(() => router.push(config.routes.games.list)),
        {
          loading: t("remove.loading"),
          success: t("remove.success"),
          error: t("remove.error"),
        }
      );
    });
  };

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!game}
      endContent={[
        {
          text: t("remove.text"),
          icon: <DeleteIcon />,
          variant: "outlined",
          color: "error",
          loading: isRemovePending,
          onClick: () => setIsRemoveConfirmationDialogOpen(true),
        },
        {
          text: t("viewButton"),
          icon: <LaunchIcon />,
          variant: "contained",
          color: "info",
          onClick: () =>
            router.push(config.routes.games.detail.replace(":id", id)),
        },
        {
          text: t("update.text"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "game_form",
          loading: isUpdatePending,
        },
      ]}
    >
      <GameForm fetchedData={game} onSubmitData={onSubmit} />
      <Dialog
        isOpen={isRemoveConfirmationDialogOpen}
        title={t("removeDialog.title")}
        description={t("removeDialog.description")}
        agreeBtnText={t("removeDialog.agreeBtnText")}
        cancelBtnText={t("removeDialog.cancelBtnText")}
        onAgree={onRemove}
        onCancel={() => setIsRemoveConfirmationDialogOpen(false)}
        setIsOpen={setIsRemoveConfirmationDialogOpen}
      />
    </ContentLayout>
  );
}
