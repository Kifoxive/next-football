"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";

import toast from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/UserForm";
import { IUserForm } from "../types";
import { useRouter } from "next/navigation";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import { useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { Button } from "@mui/material";

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
      router.push(config.routes.players.table);
    } catch {
      toast.error(t("createError"));
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <ContentLayout
      title={t("title")}
      endContent={
        <Button
          form="player_form"
          type="submit"
          variant="contained"
          color="success"
          loading={isCreateLoading}
        >
          {t("addButton")}
        </Button>
      }
    >
      <UserForm
        authUserRole={authUser?.role || USER_ROLE["player"]}
        onSubmitData={onSubmit}
      />
    </ContentLayout>
  );
}
