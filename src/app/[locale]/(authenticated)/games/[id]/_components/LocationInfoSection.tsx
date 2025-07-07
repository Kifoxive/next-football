import { Box, Paper, Typography, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LayersIcon from "@mui/icons-material/Layers";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import { CopyCell } from "@/components/CopyCell";
import { getThemedColor } from "@/utils/getThemedColor";
import { ILocation } from "@/app/[locale]/locations/types";

type LocationInfoSectionProps = Pick<
  ILocation,
  | "name"
  | "description"
  | "address"
  | "price_per_hour"
  | "floor_type"
  | "building_type"
>;

export const LocationInfoSection = ({
  name,
  description,
  address,
  price_per_hour,
  floor_type,
  building_type,
}: LocationInfoSectionProps) => {
  const t = useTranslations();
  const theme = useTheme();

  return (
    <Box component={Paper} className="p-4 flex flex-col gap-2">
      <Typography variant="h6">{name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      <Box className="flex items-center gap-2">
        <LocationOnIcon
          sx={{ color: getThemedColor(theme) }}
          fontSize="small"
        />
        <Typography variant="body2" component="div">
          <CopyCell text={address} maxLength={100} />
        </Typography>
      </Box>

      <Box className="flex items-center gap-2">
        <AttachMoneyIcon
          sx={{ color: getThemedColor(theme) }}
          fontSize="small"
        />
        <Typography variant="body2">
          {t("basic.czk_hour", { value: price_per_hour })}
        </Typography>
      </Box>

      <Box className="flex items-center gap-2">
        <LayersIcon sx={{ color: getThemedColor(theme) }} fontSize="small" />
        <Typography variant="body2">
          {t(`locations.floor_type.${floor_type}`)}
        </Typography>
      </Box>

      <Box className="flex items-center gap-2">
        <HomeWorkIcon sx={{ color: getThemedColor(theme) }} fontSize="small" />
        <Typography variant="body2">
          {t(`locations.building_type.${building_type}`)}
        </Typography>
      </Box>
    </Box>
  );
};
