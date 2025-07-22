"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { config } from "@/config";
import { useEffect } from "react";

export default function LogoutPage() {
  const t = useTranslations();
  useDocumentTitle(t("logout.logoutButton"));

  const router = useRouter();
  const supabase = createClient();

  supabase.auth.signOut();

  const onLogout = () => {
    // startLogoutTransition(() => {
    toast.promise(
      supabase.auth.signOut().then(() => router.push(config.routes.login)),
      {
        loading: t("logout.loading"),
        success: t("logout.success"),
        error: t("logout.error"),
      }
    );
    // });
  };

  useEffect(onLogout, []);

  return null;
}
