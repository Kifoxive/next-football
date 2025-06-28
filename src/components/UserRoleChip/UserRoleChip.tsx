import { USER_ROLE } from "@/store/auth";
import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CodeIcon from "@mui/icons-material/Code";

type IUserRoleChipProps = {
  value: USER_ROLE;
};

export const UserRoleChip: React.FC<IUserRoleChipProps> = ({ value }) => {
  const t = useTranslations("players");

  const userRoleChips: Record<USER_ROLE, React.ReactElement> = {
    [USER_ROLE["admin"]]: (
      <Chip
        label={t("role.admin")}
        color="info"
        variant="outlined"
        icon={<CodeIcon fontSize="small" />}
      />
    ),
    [USER_ROLE["moderator"]]: (
      <Chip
        label={t("role.moderator")}
        color="warning"
        variant="outlined"
        icon={<ShieldIcon fontSize="small" />}
      />
    ),
    [USER_ROLE["player"]]: (
      <Chip
        label={t("role.player")}
        color="default"
        variant="outlined"
        icon={<SportsSoccerIcon fontSize="small" />}
      />
    ),
  };

  return userRoleChips[value];
};
