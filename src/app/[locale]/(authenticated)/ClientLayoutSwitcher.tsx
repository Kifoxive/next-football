"use client";

import { DesktopLayoutWrapper } from "./DesktopLayoutWrapper";
import { MobileLayoutWrapper } from "./MobileLayoutWrapper";

export default function ClientLayoutSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopLayoutWrapper>{children}</DesktopLayoutWrapper>
      <MobileLayoutWrapper>{children}</MobileLayoutWrapper>
    </>
  );
}
