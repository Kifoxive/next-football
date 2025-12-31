import { navItems } from "@/utils/navigationItems";
import { Box, useTheme } from "@mui/material";
import NavItem from "./NavItem";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth";

export const Sidebar = () => {
  const t = useTranslations("navbar");

  const authUser = useAuthStore((s) => s.user);
  const theme = useTheme();
  return (
    <Box
      component="ul"
      className="hidden sm:flex flex-col p-2 gap-2 h-full"
      sx={(theme) => ({
        width: 100, // or 240px — depending on the design
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.background.paper,
        overflowY: "auto",
        zIndex: 10,
      })}
    >
      {navItems(theme, authUser?.role).map(({ pathname, name, icon }) => (
        <Box component="li" key={name} className="w-full">
          <NavItem pathname={pathname} label={t(name)} icon={icon} />
        </Box>
      ))}
    </Box>
  );
};
