"use client";

import { config } from "@/config";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocumentTitle } from "@/hooks";
import { SignUpForm } from "@/components/SignUpForm";

export default function SignUpPage() {
  const t = useTranslations("signUp");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) return router.push(config.routes.login);

  return (
    <Box className="flex flex-col grow justify-center items-center p-8 mb-20">
      <SignUpForm token={token} />
    </Box>
  );
}
