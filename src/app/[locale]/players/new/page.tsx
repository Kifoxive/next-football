"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import toast from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/_components/UserForm";
import { IUserForm } from "../types";
import { useRouter } from "next/navigation";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import { useState } from "react";
import { axiosClient } from "@/utils/axiosClient";

export default function PlayersNewPage() {
  const t = useTranslations("players.new");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const onSubmit = async (newUserData: IUserForm) => {
    setIsCreateLoading(true);
    try {
      await axiosClient.post(config.endpoints.players, newUserData);
      toast.success(t("createSuccess"));
      router.push(config.routes.players.list);
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
          form: "player_form",
          loading: isCreateLoading,
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
