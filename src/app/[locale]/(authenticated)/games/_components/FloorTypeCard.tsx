import { FLOOR_TYPE_ENUM } from "@/config";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

type FloorTypeCardProps = {
  value: FLOOR_TYPE_ENUM;
};

const floorImages: Record<keyof typeof FLOOR_TYPE_ENUM, string> = {
  artificial_grass: "/images/artificial_grass.avif",
  natural_grass: "/images/natural_grass.jpeg",
  parquet: "/images/parquet.avif",
  rubber: "/images/rubber.jpeg",
  sand: "/images/sand.avif",
  asphalt: "/images/asphalt.jpeg",
};

export const FloorTypeCard: React.FC<FloorTypeCardProps> = ({ value }) => {
  const t = useTranslations("locations.floor_type");
  return (
    <Box
      component={Paper}
      sx={{
        backgroundImage: `url(${floorImages[value]})`,
      }}
      className="bg-center bg-cover px-4 py-2 w-fit"
    >
      <Typography variant="caption" sx={{ fontWeight: "bold", color: "white" }}>
        {t(value).toUpperCase()}
      </Typography>
    </Box>
  );
};
