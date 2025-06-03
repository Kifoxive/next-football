"use client";

import ContentLayout from "@/components/ContentLayout";
import { Box, Button, Fab, Grid, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { config } from "@/config";
import { redirect } from "next/navigation";
import { useDocumentTitle } from "@/hooks";
import { useEffect, useState } from "react";
import { ILocation } from "./types";
import { axiosClient } from "@/utils/axiosClient";
import { LocationCard } from "./LocationCard";

export default function MapsPage() {
  const t = useTranslations("locations.table");
  useDocumentTitle(t("title"));

  const [locationsData, setLocationsData] = useState<ILocation[]>([]);

  const onAddNewLocationButtonClick = () => {
    redirect(config.routes.locations.new);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get<ILocation[]>(
          config.endpoints.locations
        );
        setLocationsData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <ContentLayout
      title={t("title")}
      endContent={
        <>
          <Box className="hidden sm:flex">
            <Button
              onClick={onAddNewLocationButtonClick}
              variant="contained"
              startIcon={<AddLocationAltIcon color="inherit" />}
            >
              {t("add")}
            </Button>
          </Box>
          <Box className="sm:hidden fixed right-[20px] bottom-[20px]">
            <Fab
              onClick={onAddNewLocationButtonClick}
              variant="circular"
              aria-label="add"
              size="medium"
            >
              <Tooltip title={t("add")}>
                <AddLocationAltIcon color="inherit" />
              </Tooltip>
            </Fab>
          </Box>
        </>
      }
    >
      <Grid container spacing={3}>
        {locationsData.map((location) => (
          <Grid key={location.id} size={{ xs: 12 }}>
            <LocationCard location={location} />
          </Grid>
        ))}
      </Grid>
    </ContentLayout>
  );
}
