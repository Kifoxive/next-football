"use client";

import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function ClientLayoutSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Box className="flex flex-col h-screen">
        <Navbar />
        <Box className="flex flex-1 overflow-auto sm:overflow-hidden">
          <Sidebar />
          {children}
        </Box>
      </Box>
    </>
  );
}
