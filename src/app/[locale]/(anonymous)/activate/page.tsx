"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { decode } from "jsonwebtoken";
import { config, IActivationToken } from "@/config";
import { useEffect, useState } from "react";
import { IUser } from "@/app/[locale]/(authenticated)/players/types";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";
import { useDocumentTitle } from "@/hooks";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BarChartIcon from "@mui/icons-material/BarChart";
import HistoryIcon from "@mui/icons-material/History";
import LoginIcon from "@mui/icons-material/Login";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import DoneIcon from "@mui/icons-material/Done";
import { locales } from "@/i18n/i18n";
import { LocalesType } from "@/utils/types";

export default function ProfileActivationPage() {
  const t = useTranslations("activate");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const pathname = usePathname();
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

        // Detect system/browser language
        const browserLang = navigator.languages?.[0] || navigator.language; // e.g. "uk-UA"
        const baseLang = browserLang.split("-")[0]; // "uk"

        const preferredLocale: LocalesType = locales.includes(
          baseLang as LocalesType
        )
          ? (baseLang as LocalesType)
          : "en"; // fallback

        const currentLocale = pathname.split("/")[1] as LocalesType;

        if (preferredLocale !== currentLocale) {
          // Build a new localized path using next-intl conventions
          const newPath = `/${preferredLocale}${pathname.substring(
            currentLocale.length + 1
          )}`;
          router.replace(`${newPath}?token=${token}`);
        }
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
    <Box className="flex flex-col grow justify-center items-center p-8 mb-20">
      <Container
        component={Paper}
        className="w-full text-center py-4 border-[0.5px] border-gray-600 rounded-lg shadow-2xl"
        maxWidth="xs"
      >
        {isAlreadyActivated ? (
          <AlreadyActivated />
        ) : isTokenExpired ? (
          <TokenExpired />
        ) : (
          <Welcome token={token} user_name={player?.user_name} />
        )}
      </Container>
    </Box>
  );
}

type WelcomeProps = {
  user_name?: string;
  token: string;
};

const Welcome = ({ user_name, token }: WelcomeProps) => {
  const t = useTranslations("activate");
  const router = useRouter();

  return (
    <>
      <Typography variant="h5" fontWeight="bolder" component="h1">
        {t("welcome", { username: user_name ?? "..." })}
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {t("subtitle")}
      </Typography>
      <Box className="mt-4 space-y-2">
        <Typography variant="body1">{t("description")}</Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <SportsSoccerIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={t("list.negotiateGames")} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <BarChartIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={t("list.viewStats")} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <HistoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={t("list.history")} />
          </ListItem>
        </List>
      </Box>
      <Box className="mt-6">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => router.push(`${config.routes.signUp}?token=${token}`)}
        >
          {t("join")}
        </Button>
      </Box>
    </>
  );
};

const AlreadyActivated = () => {
  const t = useTranslations("activate");
  const router = useRouter();

  return (
    <>
      <DoneIcon fontSize="large" color="success" />
      <Typography variant="h6">{t("alreadyActivated.warning")}</Typography>
      <Button onClick={() => router.push(config.routes.login)}>
        {t("alreadyActivated.solution")}
        <LoginIcon className="ml-2" />
      </Button>
    </>
  );
};

const TokenExpired = () => {
  const t = useTranslations("activate");

  return (
    <>
      <LinkOffIcon fontSize="large" color="error" />
      <Typography variant="h6">{t("tokenExpired.warning")}</Typography>
      <Typography variant="body2">{t("tokenExpired.solution")}</Typography>
    </>
  );
};
