"use client";

import { useMediaQuery } from "@mui/material";
import { DesktopLayoutWrapper } from "./DesktopLayoutWrapper";
import { MobileLayoutWrapper } from "./MobileLayoutWrapper";

export default function ClientLayoutSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 600px)");

  return isDesktop ? (
    <DesktopLayoutWrapper>{children}</DesktopLayoutWrapper>
  ) : (
    <MobileLayoutWrapper>{children}</MobileLayoutWrapper>
  );
}
