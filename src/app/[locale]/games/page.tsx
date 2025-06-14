// import Navbar from "@/components/Navbar";
"use client";

import ContentLayout from "@/components/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function QuestPage() {
  const t = useTranslations("games.list");
  useDocumentTitle(t("title"));

  return (
    <ContentLayout title={t("title")}>
      <Typography>Games</Typography>
    </ContentLayout>
  );
}
