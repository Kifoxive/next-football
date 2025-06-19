"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { GameForm } from "../../GameForm";
import { IGame, IGameForm } from "../../types";
import { Box, CircularProgress } from "@mui/material";
import Dialog from "@/components/Dialog";

export default function GamesEditPage() {
  const t = useTranslations("games.edit");
  useDocumentTitle(t("title"));

  const { id } = useParams();
  const router = useRouter();
  const [game, setGame] = useState<IGame>();
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);

  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get(
          `${config.endpoints.games}/${id}`
        );

        setGame(data);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchUser();
  }, [id]);

  const onSubmit = async (newGameData: IGameForm) => {
    setIsUpdateLoading(true);
    try {
      await axiosClient.put(`${config.endpoints.games}/${id}`, newGameData);
      toast.success(t("updateSuccess"));
      router.push(config.routes.games.list);
    } catch {
      toast.error(t("updateError"));
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const onRemove = async () => {
    setIsRemoveLoading(true);
    try {
      await axiosClient.delete(`${config.endpoints.games}/${id}`);
      toast.success(t("removeSuccess"));
      router.push(config.routes.games.list);
    } catch {
      toast.error(t("removeError"));
    } finally {
      setIsRemoveLoading(false);
    }
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={[
        {
          text: t("removeButton"),
          icon: <DeleteIcon />,
          variant: "outlined",
          color: "error",
          loading: isRemoveLoading,
          onClick: () => setIsRemoveConfirmationDialogOpen(true),
        },
        {
          text: t("updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "game_form",
          loading: isUpdateLoading,
        },
      ]}
    >
      {game ? (
        <GameForm fetchedData={game} onSubmitData={onSubmit} />
      ) : (
        <Box className="flex justify-center items-center flex-1 mb-[10%]">
          <CircularProgress color="inherit" />
        </Box>
      )}
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
