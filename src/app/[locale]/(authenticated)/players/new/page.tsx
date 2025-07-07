"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/_components/UserForm";
import { IUserForm, PostUser } from "../types";
import { useRouter } from "next/navigation";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import { useTransition } from "react";
import { axiosClient } from "@/utils/axiosClient";

export default function PlayersNewPage() {
  const t = useTranslations("players.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [isCreatePending, startCreateTransition] = useTransition();

  const onSubmit = (newUserData: IUserForm) => {
    startCreateTransition(async () => {
      try {
        await axiosClient.post<PostUser["response"]>(
          config.endpoints.players.new,
          newUserData
        );
        toast.success(t("createSuccess"));
        router.push(config.routes.players.list);
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
          form: "player_form",
          loading: isCreatePending,
        },
      ]}
    >
      <UserForm
        authUserRole={authUser?.role || USER_ROLE["player"]}
        onSubmitData={onSubmit}
      />
    </ContentLayout>
  );
}
