"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/UserForm";
import { IUser, IUserForm } from "../../types";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/utils/axiosClient";
import Dialog from "@/components/Dialog";

export default function PlayersEditPage() {
  const t = useTranslations("players.edit");
  useDocumentTitle(t("title"));

  const { id } = useParams();
  const supabase = createClient();
  const authUser = useAuthStore((s) => s.user);
  const [player, setPlayer] = useState<IUser>();
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  const router = useRouter();
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return toast.error(t("fetchError"));
      setPlayer(data);
    };
    fetchUser();
  }, [id]);

  const onSubmit = async (newUserData: IUserForm) => {
    setIsUpdateLoading(true);
    try {
      await axiosClient.put(`${config.endpoints.players}/${id}`, newUserData);
      toast.success(t("updateSuccess"));
      router.push(config.routes.players.list);
    } catch {
      toast.error(t("updateError"));
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const onRemove = async () => {
    setIsRemoveLoading(true);
    try {
      await axiosClient.delete(`${config.endpoints.players}/${id}`);
      toast.success(t("removeSuccess"));
      router.push(config.routes.players.list);
    } catch {
      toast.error(t("removeError"));
    } finally {
      setIsRemoveLoading(false);
    }
  };

  // const isMe = authUser?.id === player?.id;
  // const canUpdate =
  //   authUser?.role === USER_ROLE.admin || // auth user is admin
  //   (authUser?.role === USER_ROLE.moderator && // auth user is moderator and fetched user is player
  //     player?.role === USER_ROLE.player) ||
  //   isMe; // it is self-update

  // const canRemove = authUser?.role === USER_ROLE.admin;

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
          // show: canRemove,
          onClick: () => setIsRemoveConfirmationDialogOpen(true),
        },
        {
          text: t("updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "player_form",
          // show: canUpdate,
          loading: isUpdateLoading,
        },
      ]}
    >
      {player ? (
        <UserForm
          fetchedData={player}
          authUserRole={authUser?.role || USER_ROLE["player"]}
          onSubmitData={onSubmit}
        />
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
