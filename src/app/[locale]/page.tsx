// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import { getMe } from "./login/actions";
import ContentLayout from "@/components/ContentLayout";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return <ContentLayout title={t("title")}>Home</ContentLayout>;
}
