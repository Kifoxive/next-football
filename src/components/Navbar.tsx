"use client";

import PersonIcon from "@mui/icons-material/Person";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "@/i18n/navigation";
import { config } from "@/config";
import { useAuthStore } from "@/store/auth";
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

type NavbarProps = {
  anonymous?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ anonymous }) => {
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
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Logo light={resolvedTheme === "dark"} className="mr-2" />
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            Next Football
          </Typography>
        </Link>
        {/* Language and Login */}
        <Box className="flex gap-1">
          <ThemeToggle />
          {user ? (
            <Link href={config.routes.profile.edit} className="hidden">
              <IconButton>
                <PersonIcon />
              </IconButton>
            </Link>
          ) : (
            !anonymous && (
              <Link href={config.routes.login}>
                <IconButton color="inherit">
                  <LoginIcon />
                </IconButton>
              </Link>
            )
          )}
          {!anonymous && (
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
          )}
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
