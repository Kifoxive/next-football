// import Navbar from "@/components/Navbar";
"use client";

import ContentLayout from "@/components/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GetGames } from "./types";
import SportsIcon from "@mui/icons-material/Sports";
import { axiosClient } from "@/utils/axiosClient";
import { redirect } from "next/navigation";
import { config } from "@/config";
import { GamesTable } from "./GamesTable";

export default function QuestPage() {
  const t = useTranslations("games.list");
  useDocumentTitle(t("title"));

  const [gamesData, setGamesData] = useState<GetGames["response"]>();

  const onAddNewGameButtonClick = () => {
    redirect(config.routes.games.new);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axiosClient.get<GetGames["response"]>(
          config.endpoints.games
        );
        setGamesData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <ContentLayout
      title={t("title")}
      endContent={[
        {
          text: t("add"),
          icon: <SportsIcon color="inherit" />,
          variant: "contained",
          onClick: onAddNewGameButtonClick,
        },
      ]}
    >
      <GamesTable data={gamesData} />
    </ContentLayout>
  );
}
