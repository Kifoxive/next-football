"use client";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { Box, Chip, Paper } from "@mui/material";

import { format } from "date-fns";
import { GameStatusChip } from "@/components/GameStatusChip";

import { useTranslations } from "next-intl";
import { GAME_STATUS } from "@/config";

type GameInfoPanelProps = {
  location_name: string;
  date: string;
  duration: number;
  status: GAME_STATUS;
  reserved: boolean;
};

export const GameInfoPanel: React.FC<GameInfoPanelProps> = ({
  location_name,
  date,
  duration,
  status,
  reserved,
}) => {
  const t = useTranslations("games");

  return (
    <Box component={Paper} className="flex justify-between items-center p-4">
      <Box className="flex gap-4">
        <Box className="flex items-center">
          <LocationOnIcon className="mr-1" />
          {location_name}
        </Box>
        <Box className="flex items-center">
          <CalendarMonthIcon className="mr-1" />
          {format(date, "EEEE, d MMMM hh:mm")}
        </Box>
        <Box className="flex items-center">
          <TimerIcon className="mr-1" />
          {duration}
          {t("minutes")}
        </Box>
      </Box>
      <Box className="flex gap-4">
        <GameStatusChip value={status} />
        <Chip
          label={t("detail.reserved")}
          color={reserved ? "success" : "error"}
          variant="outlined"
          icon={
            reserved ? (
              <CheckIcon fontSize="small" />
            ) : (
              <CloseIcon fontSize="small" />
            )
          }
        />
      </Box>
    </Box>
  );
};
