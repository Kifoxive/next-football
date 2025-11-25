"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { Box } from "@mui/material";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const t = useTranslations();
  useDocumentTitle(t("login.title"));

  return (
    <Box className="flex flex-col grow justify-center items-center p-8 mb-20">
      <LoginForm />
    </Box>
  );
}
