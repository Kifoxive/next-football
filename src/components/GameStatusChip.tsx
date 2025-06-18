import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { GAME_STATUS } from "@/config";
import LightbulbOutlineIcon from "@mui/icons-material/LightbulbOutline";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

type IGameStatusChipProps = {
  value: GAME_STATUS;
};

export const GameStatusChip: React.FC<IGameStatusChipProps> = ({ value }) => {
  const t = useTranslations("games.game_status");

  const gameStatusChips: Record<GAME_STATUS, React.ReactElement> = {
    [GAME_STATUS["initialization"]]: (
      <Chip
        label={t("initialization")}
        color="info"
        variant="outlined"
        icon={<LightbulbOutlineIcon fontSize="small" />}
      />
    ),
    [GAME_STATUS["voting"]]: (
      <Chip
        label={t("voting")}
        color="warning"
        variant="outlined"
        icon={<HowToVoteIcon fontSize="small" />}
      />
    ),
    [GAME_STATUS["confirmed"]]: (
      <Chip
        label={t("confirmed")}
        color="success"
        variant="outlined"
        icon={<EventAvailableIcon fontSize="small" />}
      />
    ),
    [GAME_STATUS["completed"]]: (
      <Chip
        label={t("completed")}
        color="default"
        variant="outlined"
        icon={<CheckCircleOutlineIcon fontSize="small" />}
      />
    ),
    [GAME_STATUS["cancelled"]]: (
      <Chip
        label={t("cancelled")}
        color="error"
        variant="outlined"
        icon={<CancelIcon fontSize="small" />}
      />
    ),
  };

  return gameStatusChips[value];
};
