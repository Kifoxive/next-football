export const locales = ["cs", "uk", "en"] as const;
export const defaultLocale = "en"; // then change to uk

export type Locale = (typeof locales)[number];
