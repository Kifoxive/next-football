"use server";

import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { UpcomingGamesSection } from "./_components/UpcomingGamesSection";
import { getTranslations } from "next-intl/server";

import getFreshGames from "@/server/games/getFreshGames";

export async function generateMetadata() {
  const t = await import("next-intl/server").then((m) =>
    m.getTranslations("home")
  );
  return { title: t("title") };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const gamesData = await getFreshGames();

  return (
    <ContentLayout title={t("title")}>
      <UpcomingGamesSection gamesData={gamesData} />
    </ContentLayout>
  );
}
