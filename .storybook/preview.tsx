import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { NextIntlClientProvider } from "next-intl";
import { darkTheme, lightTheme } from "../src/theme/theme";
import type { Preview } from "@storybook/nextjs-vite";
import type { Decorator } from "@storybook/react";

import "../src/app/[locale]/globals.css";

import en from "../messages/en.json";
import uk from "../messages/uk.json";
import cz from "../messages/cz.json";

const LOCALES = { en, cz, uk };

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [
        { value: "light", left: "☀️", title: "Light mode" },
        { value: "dark", left: "🌙", title: "Dark mode" },
      ],
    },
  },
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en",
    toolbar: {
      icon: "globe",
      items: ["en", "uk", "cs"],
    },
  },
};

export const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

/* Snipped for brevity */

// Add your theme configurations to an object that you can
// pull your desired theme from.
const THEMES = {
  light: lightTheme,
  dark: darkTheme,
};

export const WithMuiTheme: Decorator = (Story, context) => {
  const { theme: themeKey, locale } = context.globals;

  const theme = useMemo(() => THEMES[themeKey] || THEMES["light"], [themeKey]);
  const messages = LOCALES[locale] || LOCALES.en;

  return (
    <ThemeProvider theme={theme}>
      <NextIntlClientProvider locale={"en"} messages={messages}>
        <CssBaseline />
        <Story />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

export const decorators = [WithMuiTheme];
