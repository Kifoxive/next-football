"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { Box, Container, Paper, Typography } from "@mui/material";
import { LoginButton } from "@/components/LoginButton";

// const providers = [
//   { id: "github", name: "GitHub" },
//   { id: "google", name: "Google" },
// ];

export default function LoginPage() {
  const t = useTranslations();
  useDocumentTitle(t("login.title"));

  return (
    <Container className="full-height flex flex-col justify-center items-center mb-20">
      <Box
        className="flex flex-col items-center max-w-[600px] py-8 px-10 border-[0.5px] border-gray-600 rounded-sm"
        component={Paper}
      >
        <Typography variant="h5" fontWeight="bolder" component="h1">
          {t("login.title")}
        </Typography>
        <Typography variant="body2">{t("login.description")}</Typography>
        <Box className="flex flex-col gap-2 mt-4">
          <LoginButton />
        </Box>
      </Box>
    </Container>
  );
}
