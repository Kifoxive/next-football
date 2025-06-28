import { useDocumentTitle } from "@/hooks";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function GamesListPage() {
  const t = useTranslations("showcase");
  useDocumentTitle(t("title"));

  return (
    <Container className="flex flex-col gap-4">
      <Box className="flex flex-col gap-2">
        <Typography variant="h5">{t("inputs")}</Typography>
        <Box className="flex gap-2"></Box>
      </Box>
    </Container>
  );
}
