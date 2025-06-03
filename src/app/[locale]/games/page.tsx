// import Navbar from "@/components/Navbar";

import ContentLayout from "@/components/ContentLayout";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function QuestPage() {
  const t = useTranslations("games");
  return (
    <ContentLayout title={t("table.title")}>
      <Typography>Games</Typography>
    </ContentLayout>
  );
}
