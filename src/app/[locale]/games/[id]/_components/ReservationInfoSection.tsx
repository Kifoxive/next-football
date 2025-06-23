import { getThemedColor } from "@/utils/getThemedColor";
import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTranslations } from "next-intl";

type ReservationInfoSectionProps = {
  date: string;
  duration: number;
  reserved: boolean;
};

export const ReservationInfoSection = ({
  date,
  duration,
  reserved,
}: ReservationInfoSectionProps) => {
  const t = useTranslations();
  const theme = useTheme();

  return (
    <Box component={Paper} className="flex flex-col gap-3 p-3">
      <Box className="flex items-center gap-2">
        <CalendarMonthIcon
          sx={{ color: getThemedColor(theme) }}
          fontSize="small"
        />
        <Typography variant="subtitle2">
          {format(date, "EEEE, d MMMM")}
        </Typography>
      </Box>
      <Divider />
      <Box className="flex items-center gap-2">
        <AccessTimeIcon
          sx={{ color: getThemedColor(theme) }}
          fontSize="small"
        />
        <Typography variant="subtitle2">{format(date, "hh:mm")}</Typography>
      </Box>
      <Divider />
      <Box className="flex items-center gap-2">
        <TimerIcon sx={{ color: getThemedColor(theme) }} fontSize="small" />
        <Typography variant="subtitle2">
          {duration} {t("games.minutes")}
        </Typography>
      </Box>
      <Divider />
      <Box className="flex items-center  gap-2">
        {reserved ? (
          <CheckIcon sx={{ color: getThemedColor(theme) }} fontSize="small" />
        ) : (
          <CloseIcon sx={{ color: getThemedColor(theme) }} fontSize="small" />
        )}
        <Typography variant="subtitle2">
          {t("games.detail.reserved")}
        </Typography>
      </Box>
    </Box>
  );
};
