"use client";

import { Box, Typography } from "@mui/material";
import Logo from "./icons";
import { useTheme } from "next-themes";

export default function LoadingScreen() {
  const { resolvedTheme } = useTheme();

  return (
    <Box className="flex w-screen h-screen items-center justify-center">
      <Box className="flex gap-2 items-center animate-bounce">
        <Logo light={resolvedTheme === "dark"} transparentBg />
        <Typography variant="subtitle1" fontWeight="bold">
          Next Football
        </Typography>
      </Box>
      <Box className="absolute bottom-2 right-3 opacity-50">
        <Typography variant="subtitle2" fontWeight="thin">
          v0.3.0
        </Typography>
      </Box>
    </Box>
  );
}
