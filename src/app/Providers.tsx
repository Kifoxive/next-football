"use client";

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { lightTheme, darkTheme } from "@/theme/theme"; // створи окремий файл з темами
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { LocalesType } from "@/utils/types";

import en from "../../messages/en.json";
import uk from "../../messages/uk.json";
import cz from "../../messages/cz.json";

const LOCALES = { en, cz, uk };

function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: LocalesType;
}) {
  const messages = LOCALES[locale] || LOCALES.en;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NextThemesProvider attribute="class">
        <ThemeRegistry>
          {children}
          <Toaster position="bottom-right" />
        </ThemeRegistry>
      </NextThemesProvider>
    </NextIntlClientProvider>
  );
}
