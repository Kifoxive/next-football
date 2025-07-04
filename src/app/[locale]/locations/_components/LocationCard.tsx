import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  //   CardActionArea,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { config } from "@/config";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { ILocation } from "../types";
import { getThemedColor } from "@/utils/getThemedColor";

type LocationCardProps = {
  location: ILocation;
  isModerator: boolean;
};

export const LocationCard = ({ location, isModerator }: LocationCardProps) => {
  const t = useTranslations();

  const supabase = createClient();
  const router = useRouter();
  const theme = useTheme();
  const { name, address, price_per_hour, image_list } = location;
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const { data, error } = await supabase.storage
        .from(config.buckets.locations)
        .createSignedUrl(image_list[0], 3600);

      if (data?.signedUrl) {
        setImageUrl(data.signedUrl);
      } else {
        console.error("Signed URL error:", error);
      }
    };

    if (image_list?.[0]) {
      fetchSignedUrl();
    }
  }, [image_list]);

  return (
    <Card
      sx={{ borderRadius: 3, boxShadow: 3, minHeight: "100%" }}
      className="relative"
    >
      {isModerator && (
        <Box className="absolute right-1 top-1">
          <Tooltip title={t("locations.list.edit")}>
            <IconButton
              onClick={() =>
                router.push(
                  config.routes.locations.edit.replace(":id", location.id)
                )
              }
              aria-label="edit"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {/* <CardActionArea> */}
      <CardMedia
        component="img"
        className="aspect-3/2"
        image={imageUrl}
        alt={name}
        sx={{ objectFit: "cover" }}
      />
      {/* </CardActionArea> */}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Box className="flex items-center gap-2" mb={1}>
          <PlaceIcon fontSize="small" sx={{ color: getThemedColor(theme) }} />
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
        </Box>
        <Box className="flex items-center gap-2">
          <LocalOfferIcon
            fontSize="small"
            sx={{ color: getThemedColor(theme) }}
          />
          <Typography variant="body2" color="text.secondary">
            {t("basic.czk_hour", { value: price_per_hour })}
          </Typography>
        </Box>
        {/* <Typography variant="body2" color="text.secondary" noWrap>
          {description}
        </Typography> */}
      </CardContent>
    </Card>
  );
};
