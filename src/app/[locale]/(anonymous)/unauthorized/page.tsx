"use client";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { config } from "@/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations();
  useDocumentTitle(t("unauthorized.title"));

  const router = useRouter();

  return (
    <Container className="full-height flex flex-col justify-center items-center mb-20">
      <Box
        className="flex gap-2 flex-col items-center max-w-[600px] py-8 px-10 border-[0.5px] border-gray-600 rounded-sm"
        component={Paper}
      >
        <PersonOffIcon fontSize="large" />
        <Typography variant="h6">{t("unauthorized.warning")}</Typography>
        <Typography variant="body2">{t("unauthorized.description")}</Typography>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push(config.routes.login)}
        >
          {t("unauthorized.solution")}
          <LoginIcon />
        </Button>
      </Box>
    </Container>
  );
}
