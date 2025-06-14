"use client";

import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { usePathname, Link } from "@/i18n/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import { useTranslations } from "next-intl";
import { config } from "@/config";
import { useAuthStore, USER_ROLE } from "@/store/auth";
import Logo from "./icons";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";
import MenuIcon from "@mui/icons-material/Menu";
import MobileDrawer from "./MobileDrawer";
import { useState } from "react";
// const getAvailableRoutes = (role?: USER_ROLE): [string, string][] => {
//     switch (role) {
//         case AUTH_ROLE['admin']:
//             return [
//                 [config.nav.reservation.list, config.routes.reservation.list],
//                 [config.nav.delivery.list, config.routes.delivery.list],
//                 [config.nav.menu.list, config.routes.menu.list],
//             ];
//         case AUTH_ROLE['guest']:
//             return [
//                 [config.nav.reservation.list, config.routes.reservation.list],
//                 [config.nav.delivery.list, config.routes.delivery.list],
//             ];
//         default:
//             return [
//                 [config.nav.home, config.routes.home],
//                 [config.nav.menu.page, config.routes.menu.page],
//                 [config.nav.reservation.page, config.routes.reservation.page],
//                 [config.nav.delivery.page, config.routes.delivery.page],
//                 [config.nav.contact, config.routes.contact],
//             ];
//     }
// };

const navItems = [
  { pathname: config.routes.home, name: "home" },
  { pathname: config.routes.games.list, name: "games" },
  { pathname: config.routes.players.list, name: "players" },
  { pathname: config.routes.locations.list, name: "locations" },
];

const Navbar = () => {
  const t = useTranslations("navbar");
  const user = useAuthStore((s) => s.user);
  const { resolvedTheme } = useTheme();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    // <AppBar position="fixed" color="default" elevation={1}>
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={(theme) => ({
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.background.paper,
      })}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Логотип або назва сайту */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {/* <Box
            component="img"
            src="/favicon/favicon.ico"
            alt="Logo"
            sx={{ height: 32, width: 32, mr: 1 }}
          /> */}
          <Logo light={resolvedTheme === "dark"} className="mr-2" />
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            Next Football
          </Typography>
        </Link>
        {/* Navigations */}
        {/* <Box className="md:flex hidden">
          {navItems.map(({ name, pathname }) => (
            <Link
              key={name}
              href={`/${pathname}`}
              className={`${
                pathname === curPathname && "border-b-2"
              } py-2 px-6 relative hover:top-0.5`}
            >
              <Typography>{t(name)}</Typography>
            </Link>
          ))}
        </Box> */}
        {/* Language and Login */}
        <Box className="flex gap-1">
          <ThemeToggle />
          {/* <LocaleSwitcher /> */}
          {/* {user?.avatar_url && (
            <Avatar alt={user.user_name} src={user.avatar_url} />
          )} */}
          {user ? (
            <Link href={config.routes.profile} className="hidden">
              <IconButton>
                <PersonIcon />
              </IconButton>
            </Link>
          ) : (
            <Link href={config.routes.login}>
              <IconButton color="inherit">
                <LoginIcon />
              </IconButton>
            </Link>
          )}
          <Box className="sm:hidden">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => setIsMobileDrawerOpen(true)}
              sx={[isMobileDrawerOpen && { display: "none" }]}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        setIsOpen={(value: boolean) => setIsMobileDrawerOpen(value)}
      />
    </AppBar>
  );
};

export default Navbar;
