"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { Box, Container } from "@mui/material";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const t = useTranslations();
  useDocumentTitle(t("login.title"));

  return (
    <Box className="flex flex-col grow">
      <Container className="flex justify-center items-center grow p-20 mb-20">
        <LoginForm />
      </Container>
    </Box>
  );
}
