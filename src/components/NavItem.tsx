"use client";

import { IconButton, Typography } from "@mui/material";
import { usePathname } from "@/i18n/navigation";
import React, { ReactElement } from "react";
import { redirect } from "next/navigation";

interface NavItemProps {
  pathname: string;
  label: string;
  icon: ReactElement;
}

export default function NavItem({ pathname, label, icon }: NavItemProps) {
  const currentPath = usePathname();
  const isActive =
    currentPath === pathname || currentPath.startsWith(`${pathname}/`);

  return (
    <IconButton
      onClick={() => redirect(pathname)}
      className="flex flex-col items-center w-full"
      color="inherit"
      sx={{
        borderRadius: 2,
        bgcolor: isActive ? "action.selected" : "transparent",
      }}
    >
      {icon}
      <Typography variant="caption">{label}</Typography>
    </IconButton>
  );
}
