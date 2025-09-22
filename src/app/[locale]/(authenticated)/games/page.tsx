"use client";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { GetGames } from "./types";
import SportsIcon from "@mui/icons-material/Sports";
import { axiosClient } from "@/utils/axiosClient";
import { useRouter } from "next/navigation";
import { config, permissions } from "@/config";
import { GamesTable } from "./_components/GamesTable";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth";

export default function GamesListPage() {
  const t = useTranslations("games.list");
  useDocumentTitle(t("title"));

  const authUser = useAuthStore((s) => s.user);
  const router = useRouter();
  const [gamesData, setGamesData] = useState<GetGames["response"]>([]);

  const onAddNewGameButtonClick = () => {
    router.push(config.routes.games.new);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axiosClient.get<GetGames["response"]>(
          config.endpoints.games.list
        );
        setGamesData(res.data);
      } catch (error) {
        console.error(error);
        toast.error(t("fetchError"));
      }
    };

    fetchGames();
  }, []);

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!gamesData.length}
      endContent={[
        {
          text: t("add"),
          icon: <SportsIcon color="inherit" />,
          variant: "contained",
          onClick: onAddNewGameButtonClick,
          show: !!authUser && permissions.moderator.includes(authUser?.role),
        },
      ]}
    >
      <GamesTable data={gamesData} />
    </ContentLayout>
  );
}
