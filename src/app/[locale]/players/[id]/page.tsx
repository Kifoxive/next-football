"use client";

import ContentLayout from "@/components/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { IUser } from "../types";

export default function PlayersDetailPage() {
  const t = useTranslations("players.detail");
  useDocumentTitle(t("title"));
  const supabase = createClient();
  // const authUser = useAuthStore((s) => s.user);
  const [user, setUser] = useState<IUser>();
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
