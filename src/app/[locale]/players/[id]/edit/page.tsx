"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/_components/UserForm";
import { GetOneUser, IUser, IUserForm } from "../../types";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { axiosClient } from "@/utils/axiosClient";
import Dialog from "@/components/Dialog";

export default function PlayersEditPage() {
  const t = useTranslations("players.edit");
  useDocumentTitle(t("title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [isRemovePending, startRemoveTransition] = useTransition();
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState<boolean>(false);
  const [player, setPlayer] = useState<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get<GetOneUser["response"]>(
          config.endpoints.players.edit.replace(":id", id)
        );

        setPlayer(data);
      } catch (e) {
        toast.error(t("fetchError"));
        console.log(e);
      }
    };
    fetchUser();
  }, [id]);

  const onSubmit = (newUserData: IUserForm) => {
    startUpdateTransition(async () => {
      try {
        await axiosClient.put(
          config.endpoints.players.edit.replace(":id", id),
          newUserData
        );
        toast.success(t("updateSuccess"));
        router.push(config.routes.players.list);
      } catch {
        toast.error(t("updateError"));
      }
    });
  };

  const onRemove = () => {
    startRemoveTransition(async () => {
      try {
        await axiosClient.delete(
          config.endpoints.players.delete.replace(":id", id)
        );
        toast.success(t("removeSuccess"));
        router.push(config.routes.players.list);
      } catch {
        toast.error(t("removeError"));
      }
    });
  };

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!player}
      endContent={[
        {
          text: t("removeButton"),
          icon: <DeleteIcon />,
          variant: "outlined",
          color: "error",
          loading: isRemovePending,
          onClick: () => setIsRemoveConfirmationDialogOpen(true),
        },
        {
          text: t("updateButton"),
          icon: <UpgradeIcon />,
          variant: "contained",
          color: "success",
          type: "submit",
          form: "player_form",
          loading: isUpdatePending,
        },
      ]}
    >
      <UserForm
        fetchedData={player}
        authUserRole={authUser?.role || USER_ROLE["player"]}
        onSubmitData={onSubmit}
      />
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
