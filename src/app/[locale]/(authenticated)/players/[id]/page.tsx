"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { IUser } from "../types";
import { useAuthStore } from "@/store/auth";
import PlayerDetail from "./_components/PlayerDetail";
import LinkIcon from "@mui/icons-material/Link";
import EditIcon from "@mui/icons-material/Edit";
import { config, permissions } from "@/config";
import InviteDialog from "@/components/InviteDialog/InviteDialog";

export default function PlayersDetailPage() {
  const t = useTranslations("players.detail");
  useDocumentTitle(t("title"));

  const { id }: { id: string } = useParams();
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const supabase = createClient();
  const [user, setUser] = useState<IUser>();
  const [isInviteConfirmationDialogOpen, setIsInviteConfirmationDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) return toast.error(t("fetchError"));
      setUser(data);
    };
    fetchUser();
  }, [id]);

  const canUpdate =
    !!authUser && permissions["moderator"].includes(authUser.role);

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!user}
      endContent={[
        {
          text: t("inviteButton"),
          icon: <LinkIcon />,
          variant: "outlined",
          color: "info",
          // loading: isInvitePending,
          onClick: () => setIsInviteConfirmationDialogOpen(true),
        },
        {
          text: t("editButton"),
          icon: <EditIcon />,
          variant: "contained",
          color: "info",
          show: canUpdate,
          onClick: () =>
            router.push(config.routes.players.edit.replace(":id", id)),
        },
      ]}
    >
      {user && <PlayerDetail {...user} canUpdate={canUpdate} />}
      {authUser?.id && (
        <InviteDialog
          userId={id}
          inviterId={authUser.id}
          isOpen={isInviteConfirmationDialogOpen}
          onCancel={() => setIsInviteConfirmationDialogOpen(false)}
          setIsOpen={setIsInviteConfirmationDialogOpen}
        />
      )}
    </ContentLayout>
  );
}
