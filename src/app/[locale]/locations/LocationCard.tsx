import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  //   CardActionArea,
  IconButton,
  Tooltip,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ILocation } from "./types";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { config } from "@/config";
import { useTranslations } from "next-intl";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";

type Props = {
  location: ILocation;
};

export const LocationCard = ({ location }: Props) => {
  const t = useTranslations();
  const { name, description, address, price_per_hour, image_list } = location;
  const [imageUrl, setImageUrl] = useState<string>();
  const supabase = createClient();
  const router = useRouter();

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
      sx={{ width: 320, borderRadius: 3, boxShadow: 3 }}
      className="relative"
    >
      <Box className="absolute right-1 top-1">
        <Tooltip title={t("locations.table.edit")}>
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
      {/* <CardActionArea> */}
      <CardMedia
        component="img"
        height="180"
        image={imageUrl}
        alt={name}
        sx={{ objectFit: "cover" }}
      />
      {/* </CardActionArea> */}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {name}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <PlaceIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <LocalOfferIcon fontSize="small" sx={{ mr: 0.5 }} />
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
