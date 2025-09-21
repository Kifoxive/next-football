import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import React from "react";
import { Sidebar } from "@/components/Sidebar";

export function DesktopLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box className="hidden sm:flex flex-col h-screen">
      {/* Navbar — sticky to the top */}
      <Navbar />
      {/* Content part with sidebar and main part */}
      <Box className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        {/* Main scrollable area */}
        {children}
      </Box>
    </Box>
  );
}
