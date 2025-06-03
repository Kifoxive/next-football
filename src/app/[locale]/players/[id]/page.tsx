"use client";

import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { redirect, useParams } from "next/navigation";

import toast, { LoaderIcon } from "react-hot-toast";
import { UserForm } from "@/app/[locale]/players/UserForm";
import { IUserForm } from "../../types";
import { createClient } from "@/utils/supabase/client";
import { IUser, useAuthStore, USER_ROLE } from "@/store/auth";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function PlayersDetailPage() {
  const t = useTranslations("players.detail");
  useDocumentTitle(t("title"));
  const supabase = createClient();
  const authUser = useAuthStore((s) => s.user);
  const [user, setUser] = useState<IUser>();
  const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("(user_name, email, first_name, last_name, role)")
        .eq("id", id)
        .single();
      if (error) return toast.error(t("fetchError"));
      setUser(data);
    };
    fetchUser();
  }, [id]);

  return (
    <ContentLayout title={t("title")}>
      {user ? (
        user.id
      ) : (
        <Box className="flex justify-center items-center flex-1 mb-[10%]">
          <CircularProgress color="inherit" />
        </Box>
      )}
    </ContentLayout>
  );
}
