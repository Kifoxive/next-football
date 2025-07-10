import ContentLayout from "@/components/ContentLayout/ContentLayout";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";

export default function LocationDetailPage() {
  const t = useTranslations("locations.detail");
  useDocumentTitle(t("title"));

  return <ContentLayout title={t("title")}>Location detail page</ContentLayout>;
}
