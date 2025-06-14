"use client";

import PeopleIcon from "@mui/icons-material/People";
import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MapIcon from "@mui/icons-material/Map";
import { Box } from "@mui/material";
import Navbar from "@/components/Navbar";
import { config } from "@/config";
import { useTranslations } from "next-intl";
import React from "react";
import NavItem from "@/components/NavItem";

export const navItems = [
  {
    pathname: config.routes.home,
    name: "home",
    icon: <HomeIcon />,
  },
  {
    pathname: config.routes.games.list,
    name: "games",
    icon: <SportsSoccerIcon />,
  },
  {
    pathname: config.routes.players.list,
    name: "players",
    icon: <PeopleIcon />,
  },
  {
    pathname: config.routes.locations.list,
    name: "locations",
    icon: <MapIcon />,
  },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("navbar");

  return (
    <Box className="flex flex-col h-screen">
      {/* Navbar — sticky до верху */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100, // щоб був над іншим контентом
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
      {/* Контентна частина з сайдбаром і основною частиною */}
      <Box className="flex flex-1 overflow-hidden">
        {/* Сайдбар */}
        <Box
          component="ul"
          className="hidden sm:flex flex-col p-2 gap-2"
          sx={(theme) => ({
            width: 100, // або 240px — залежно від дизайну
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.background.paper,
            overflowY: "auto",
          })}
        >
          {navItems.map(({ pathname, name, icon }) => (
            <Box component="li" key={name} className="w-full">
              <NavItem pathname={pathname} label={t(name)} icon={icon} />
            </Box>
          ))}
        </Box>
        {/* Основна скрольована зона */}
        {children}
      </Box>
    </Box>
  );
}
