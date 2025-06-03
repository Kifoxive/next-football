import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { config } from "config";
import { AUTH_ROLE, IUser } from "core/auth/types";
import { useNonTypedTranslation } from "core/translation";

import styles from "./DropdownMenu.module.scss";
import { useTranslations } from "next-intl";

type DropdownMenuProps = {
  user: IUser | null;
  availableRoutes: [string, string][];
  onLogout: () => void;
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  user,
  availableRoutes,
  onLogout,
}) => {
  const t = useTranslations();
  const { tnt } = useNonTypedTranslation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const availableRoutesElements = availableRoutes.map(([title, path]) => (
    <MenuItem
      onClick={() => {
        navigate(path);
        handleClose;
      }}
    >
      {tnt(`nav.${title}`)}
    </MenuItem>
  ));

  const getAvailableMenuItems = (role?: AUTH_ROLE): React.ReactElement[] => {
    switch (role) {
      case AUTH_ROLE["admin"]:
        return [
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <p
              className={styles.name}
            >{`${user?.firstName} ${user?.lastName}`}</p>
          </MenuItem>,
          <Divider />,
          ...availableRoutesElements,
          <Divider />,
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t("header.settings")}
          </MenuItem>,
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {t("header.logout")}
          </MenuItem>,
        ];
      case AUTH_ROLE["guest"]:
        return [
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <p
              className={styles.name}
            >{`${user?.firstName} ${user?.lastName}`}</p>
          </MenuItem>,
          <Divider />,
          ...availableRoutesElements,
          <Divider />,
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t("header.settings")}
          </MenuItem>,
          <MenuItem
            onClick={() => {
              handleClose();
              onLogout();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            {t("header.logout")}
          </MenuItem>,
        ];
      default:
        return [
          <MenuItem
            onClick={() => {
              navigate(config.routes.login);
              handleClose();
            }}
          >
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            {t("nav.login")}
          </MenuItem>,
          <Divider />,
          ...availableRoutesElements,
        ];
    }
  };

  return (
    <div className={styles.container}>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="medium"
      >
        <MenuIcon fontSize="medium" sx={{ color: "black" }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {getAvailableMenuItems(user?.role).map((item, index) =>
          React.cloneElement(item, { key: index })
        )}
      </Menu>
    </div>
  );
};
