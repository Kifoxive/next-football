import { defineRouting } from "next-intl/routing";
import { defaultLocale } from "@/i18n/i18n";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["cz", "uk", "en"],

  // Used when no locale matches
  defaultLocale,
});
