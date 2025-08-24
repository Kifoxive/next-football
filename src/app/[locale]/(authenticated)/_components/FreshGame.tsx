import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { IGame } from "../games/types";
import { ILocation } from "../locations/types";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LaunchIcon from "@mui/icons-material/Launch";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import { format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getThemedColor } from "@/utils/getThemedColor";
import { useEffect, useState } from "react";
import { IPictureItem } from "@/components/AddPictures";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { MarkdownEditor } from "@/components/form";

const fallbackImage = "/images/showcase-missing-image.webp";

type FreshGameProps = IGame & { locations: ILocation };

export const FreshGame: React.FC<FreshGameProps> = ({
  id,
  date,
  description,
  locations,
}) => {
  const t = useTranslations("home.upcomingGamesSection.freshGame");

  const [picture, setPicture] = useState<IPictureItem>();
  const theme = useTheme();
  const router = useRouter();
  const supabase = createClient();

  // on first render, add first supabase picture to local state
  useEffect(() => {
    if (!locations.image_list[0]) return;

    const avatar_url = locations.image_list[0];

    const fetchImages = async () => {
      const { data, error } = await supabase.storage
        .from(config.buckets.locations)
        .createSignedUrl(avatar_url, 3600);

      if (error || !data) {
        console.error("Error fetching signed URL", error);
        return null;
      }

      setPicture({
        file: null,
        url: data.signedUrl,
        originalId: avatar_url,
      });
    };

    fetchImages();
     
  }, []);

  return (
    <Box className="flex flex-col gap-2 py-5" component={Paper}>
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
            sx={{ color: getThemedColor(theme) }}
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
            src={picture?.url || fallbackImage}
            fill
            alt={locations.name}
            // priority
            className="object-cover"
          />
        </Box>
        <MarkdownViewer content={description} />
      </Box>
      <Box className="flex justify-end mt-2 -mb-2 px-4 md:px-8">
        <Button
          onClick={() =>
            router.push(config.routes.games.detail.replace(":id", id))
          }
          className="flex items-center gap-2"
          size="small"
        >
          <LaunchIcon fontSize="small" />
          {t("viewDetailsBtn")}
        </Button>
      </Box>
    </Box>
  );
};
