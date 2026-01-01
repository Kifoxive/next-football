"use server";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import SportsIcon from "@mui/icons-material/Sports";
import { config, permissions } from "@/config";
import GamesTable from "./_components/GamesTable";

import { getTranslations } from "next-intl/server";
import getAllGames from "@/server/games/getAllGames";
import getServerAuthUser from "@/utils/getServerAuthUser";

export async function generateMetadata() {
  const t = await import("next-intl/server").then((m) =>
    m.getTranslations("games.list")
  );
  return { title: t("title") };
}

export default async function GamesListPage() {
  const t = await getTranslations("games.list");
  const gamesData = await getAllGames();
  const authUser = await getServerAuthUser();

  const canAdd = !!authUser && permissions.moderator.includes(authUser.role);

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!gamesData.length}
      endContent={[
        {
          text: t("add"),
          icon: <SportsIcon color="inherit" />,
          variant: "contained",
          redirect: config.routes.games.new,
          show: canAdd,
        },
      ]}
    >
      <GamesTable data={gamesData} />
    </ContentLayout>
  );
}
