import HomeIcon from "@mui/icons-material/Home";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PeopleIcon from "@mui/icons-material/People";
import MapIcon from "@mui/icons-material/Map";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatIcon from "@mui/icons-material/Chat";
import { Theme } from "@mui/material";
import { config, permissions } from "@/config";
import React from "react";
import { getThemedColor } from "@/utils/getThemedColor";
import { USER_ROLE } from "@/store/auth";

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
      pathname: config.routes.chats.main,
      name: "chat",
      icon: <ChatIcon sx={{ color: getThemedColor(theme) }} />,
      isProtected: false,
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
