"use server";

import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { IGame } from "../games/types";
import { ILocation } from "../locations/types";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LaunchIcon from "@mui/icons-material/Launch";
import { config } from "@/config";
import { format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const fallbackImage = "/images/showcase-missing-image.webp";

const fetchImages = async (avatar_url: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(config.buckets.locations)
    .createSignedUrl(avatar_url, 3600);

  if (error || !data) {
    console.error("Error fetching signed URL", error);
    return null;
  }

  return data.signedUrl;
};

type FreshGameProps = IGame & {
  locations: Pick<ILocation, "name" | "image_list">;
};

export const FreshGame: React.FC<FreshGameProps> = async ({
  id,
  date,
  description,
  locations,
}) => {
  const t = await getTranslations("home.upcomingGamesSection.freshGame");
  const locationUrl = await fetchImages(locations.image_list[0]);

  return (
    <Box className="flex flex-col gap-2 py-5 rounded-md" component={Paper}>
      <Box className="flex justify-between mb-2 px-4 md:px-8">
        <Typography
          className="flex gap-2 items-center"
          color="disabled"
          fontSize="small"
        >
          <LocationOnIcon />
          {locations.name}
        </Typography>
        <Box className="flex items-center gap-2 " fontSize="small">
          <CalendarMonthIcon
            sx={{ color: "var(--themed-icon-color)" }}
            fontSize="small"
          />
          {format(date, "EEEE, d MMMM")}
        </Box>
      </Box>
      <Divider />
      <Box className="flex flex-col md:flex-row gap-4 md:gap-8 mt-2 px-4 md:px-8">
        <Box
          component={Paper}
          className="md:min-h-full relative overflow-hidden h-[150px] bg-red-300 aspect-[2/1]"
        >
          <Image
            src={locationUrl || fallbackImage}
            fill
            alt={locations.name}
            // priority
            className="object-cover"
          />
        </Box>
        <MarkdownViewer content={description} />
      </Box>
      <Box className="flex justify-end mt-2 -mb-2 px-4 md:px-8">
        <Link href={config.routes.games.detail.replace(":id", id)}>
          <Button className="flex items-center gap-2" size="small">
            <LaunchIcon fontSize="small" />
            {t("viewDetailsBtn")}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
