"use client";

import { IUser } from "@/app/[locale]/(authenticated)/players/types";

import { config, IActivationToken } from "@/config";
import { axiosClient } from "@/utils/axiosClient";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { decode } from "jsonwebtoken";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import LoginIcon from "@mui/icons-material/Login";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDocumentTitle } from "@/hooks";
import { SignUpForm } from "@/components/SignUpForm";

export default function ProfileActivationPage() {
  const t = useTranslations("activate");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [player, setPlayer] =
    useState<
      Pick<IUser, "joined_at" | "invited_at" | "language" | "user_name">
    >();

  useEffect(() => {
    if (!decoded.userId) return;
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get(
          config.endpoints.auth.checkActivated.replace(":id", decoded.userId)
        );

        setPlayer(data);
      } catch (e) {
        toast.error(t("fetchError"));
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  if (!token) return router.push(config.routes.login);

  const decoded = decode(token) as IActivationToken;
  const isAlreadyActivated = player?.joined_at;
  const isTokenExpired = decoded.exp * 1000 < new Date().getTime();

  return (
    <Box className="flex flex-col grow">
      <Container className="flex justify-center items-center grow p-20 mb-20">
        {isAlreadyActivated ? (
          <AlreadyActivated />
        ) : isTokenExpired ? (
          <TokenExpired />
        ) : (
          <SignUpForm token={token} user_name={player?.user_name} />
        )}
      </Container>
    </Box>
  );
}

const AlreadyActivated = () => {
  const t = useTranslations("activate");
  const router = useRouter();

  return (
    <Box
      className="flex gap-2 flex-col items-center max-w-[400px] px-8 py-6 border-[0.5px] border-gray-600 rounded-lg shadow-2xl"
      component={Paper}
    >
      <DoneIcon fontSize="large" color="success" />
      <Typography variant="h6">{t("alreadyActivated.warning")}</Typography>
      <Button onClick={() => router.push(config.routes.login)}>
        {t("alreadyActivated.solution")}
        <LoginIcon className="ml-2" />
      </Button>
    </Box>
  );
};

const TokenExpired = () => {
  const t = useTranslations("activate");

  return (
    <Box
      className="flex gap-2 flex-col items-center max-w-[400px] px-8 py-6 border-[0.5px] border-gray-600 rounded-lg shadow-2xl"
      component={Paper}
    >
      <LinkOffIcon fontSize="large" color="error" />
      <Typography variant="h6">{t("expired.warning")}</Typography>
      <Typography variant="body2">{t("expired.solution")}</Typography>
    </Box>
  );
};
