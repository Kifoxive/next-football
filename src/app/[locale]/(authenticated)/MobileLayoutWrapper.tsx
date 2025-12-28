"use client";

import Navbar from "@/components/Navbar";
import { Box } from "@mui/material";
// import { useEffect } from "react";

export function MobileLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // useEffect(() => {
  //   // Fix for iOS Safari: set --app-height to the real innerHeight
  //   const setAppHeight = () => {
  //     document.documentElement.style.setProperty(
  //       "--app-height",
  //       `${window.innerHeight}px`
  //     );
  //   };
  //   setAppHeight();
  //   window.addEventListener("resize", setAppHeight);
  //   return () => window.removeEventListener("resize", setAppHeight);
  // }, []);

  return (
    <Box className="relative flex sm:hidden flex-col h-full">
      {/* Header */}
      <Navbar />
      {children}
    </Box>
  );
}
