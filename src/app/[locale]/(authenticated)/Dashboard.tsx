"use client";

import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MapIcon from "@mui/icons-material/Map";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Box, Theme, useTheme } from "@mui/material";
import Navbar from "@/components/Navbar";
import { config, permissions } from "@/config";
import { useTranslations } from "next-intl";
import React from "react";
import NavItem from "@/components/NavItem";
import { getThemedColor } from "@/utils/getThemedColor";
import { useAuthStore, USER_ROLE } from "@/store/auth";

export const navItems = (theme: Theme, userRole?: USER_ROLE) => {
  const items = [
    {
      pathname: config.routes.home,
      name: "home",
      icon: <HomeIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: false,
    },
    {
      pathname: config.routes.games.list,
      name: "games",
      icon: <SportsSoccerIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: false,
    },
    {
      pathname: config.routes.players.list,
      name: "players",
      icon: <PeopleIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: true,
    },
    {
      pathname: config.routes.locations.list,
      name: "locations",
      icon: <MapIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: true,
    },
    {
      pathname: config.routes.profile.edit,
      name: "profile",
      icon: <AccountCircleIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: false,
    },
  ];
  if (!userRole) return [];

  if (permissions["moderator"].includes(userRole)) {
    return items;
  }
  return items.filter(({ isProtected }) => !isProtected);
};

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("navbar");

  const authUser = useAuthStore((s) => s.user);
  const theme = useTheme();

  return (
    <Box className="flex flex-col h-screen">
      {/* Navbar — sticky to the top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 20, // to be above other content
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }}
      >
        <Navbar />
      </Box>
      {/* Content part with sidebar and main part */}
      <Box className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Box
          component="ul"
          className="hidden sm:flex flex-col p-2 gap-2"
          sx={(theme) => ({
            width: 100, // or 240px — depending on the design
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.background.paper,
            overflowY: "auto",
          })}
        >
          {navItems(theme, authUser?.role).map(({ pathname, name, icon }) => (
            <Box component="li" key={name} className="w-full">
              <NavItem pathname={pathname} label={t(name)} icon={icon} />
            </Box>
          ))}
        </Box>
        {/* Main scrollable area */}
        {children}
      </Box>
    </Box>
  );
}
