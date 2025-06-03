import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      //   typography: ({ theme }) => ({
      //     light: {
      //       css: {
      //         color: theme("colors.gray.300"),
      //         a: { color: theme("colors.blue.400") },
      //         strong: { color: theme("colors.gray.100") },
      //         h1: { color: theme("colors.gray.100") },
      //         h2: { color: theme("colors.gray.100") },
      //         h3: { color: theme("colors.gray.100") },
      //         code: { color: theme("colors.gray.100") },
      //         blockquote: {
      //           color: theme("colors.gray.200"),
      //           borderLeftColor: theme("colors.gray.600"),
      //         },
      //       },
      //     },
      //   }),
    },
  },
  // plugins: [typographyPlugin],
};

export default config;
