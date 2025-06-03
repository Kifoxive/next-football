// components/ThemeToggle.tsx
"use client";
import { useTheme } from "next-themes";
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <IconButton
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
