"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GetFreshGames } from "./games/types";
import { axiosClient } from "@/utils/axiosClient";
import { config } from "@/config";
import toast from "react-hot-toast";
import { useDocumentTitle } from "@/hooks";
import { UpcomingGamesSection } from "./_components/UpcomingGamesSection";

export default function HomePage() {
  const t = useTranslations("home");
  useDocumentTitle(t("title"));

  const [gamesData, setGamesData] = useState<GetFreshGames["response"]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axiosClient.get<GetFreshGames["response"]>(
          config.endpoints.games.list,
          { params: { fresh: true } }
        );
        setGamesData(res.data);
      } catch {
        toast.error(t("upcomingGamesSection.fetchError"));
      }
    };

    fetchGames();
  }, []);

  return (
    <ContentLayout title={t("title")} isLoading={!gamesData}>
      <UpcomingGamesSection gamesData={gamesData} />
    </ContentLayout>
  );
}
