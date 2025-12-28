"use client";

import Navbar from "@/components/Navbar";
import { Box } from "@mui/material";

export function MobileLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="relative flex sm:hidden flex-col h-full">
      {/* Header */}
      <Navbar />
      {children}
    </Box>
  );
}
