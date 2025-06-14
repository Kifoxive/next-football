"use client";

import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { lightTheme, darkTheme } from "@/theme/theme"; // створи окремий файл з темами
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class">
      <ThemeRegistry>
        {children}
        <Toaster position="bottom-right" />
      </ThemeRegistry>
    </NextThemesProvider>
  );
}
