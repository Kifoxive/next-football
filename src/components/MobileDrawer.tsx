import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { navItems } from "@/app/[locale]/Dashboard";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { Divider, IconButton, styled, useTheme } from "@mui/material";

type IMobileDrawerProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const MobileDrawer: React.FC<IMobileDrawerProps> = ({ isOpen, setIsOpen }) => {
  const t = useTranslations("navbar");
  const currentPath = usePathname();
  const theme = useTheme();

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setIsOpen(false)}
    >
      <DrawerHeader>
        <IconButton onClick={() => setIsOpen(false)}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navItems.map(({ pathname, name, icon }) => {
          const isActive =
            currentPath === pathname || currentPath.startsWith(`${pathname}/`);
          return (
            <ListItem key={name} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => redirect(pathname)}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={t(name)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {/* <Divider /> */}
      {/* <List>
        {navItems.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <Box className="hidden">
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default MobileDrawer;
