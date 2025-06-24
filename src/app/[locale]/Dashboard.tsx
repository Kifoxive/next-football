"use client";

import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MapIcon from "@mui/icons-material/Map";
import { Box, Theme, useTheme } from "@mui/material";
import Navbar from "@/components/Navbar";
import { config } from "@/config";
import { useTranslations } from "next-intl";
import React from "react";
import NavItem from "@/components/NavItem";
import { getThemedColor } from "@/utils/getThemedColor";

export const navItems = (theme: Theme) => [
  {
    pathname: config.routes.home,
    name: "home",
    icon: <HomeIcon sx={{ color: getThemedColor(theme) }} />,
  },
  {
    pathname: config.routes.games.list,
    name: "games",
    icon: <SportsSoccerIcon sx={{ color: getThemedColor(theme) }} />,
  },
  {
    pathname: config.routes.players.list,
    name: "players",
    icon: <PeopleIcon sx={{ color: getThemedColor(theme) }} />,
  },
  {
    pathname: config.routes.locations.list,
    name: "locations",
    icon: <MapIcon sx={{ color: getThemedColor(theme) }} />,
  },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("navbar");
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
          {navItems(theme).map(({ pathname, name, icon }) => (
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
