"use client";

import ContentLayout from "@/components/ContentLayout";
import { Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { config, permissions } from "@/config";
import { redirect } from "next/navigation";
import { useDocumentTitle } from "@/hooks";
import { useEffect, useState } from "react";
import { GetLocations, ILocation } from "./types";
import { axiosClient } from "@/utils/axiosClient";
import { LocationCard } from "./_components/LocationCard";
import { useAuthStore } from "@/store/auth";

export default function LocationsListPage() {
  const t = useTranslations("locations.list");
  useDocumentTitle(t("title"));

  const [locationsData, setLocationsData] = useState<ILocation[]>([]);
  const authUser = useAuthStore((s) => s.user);

  const onAddNewLocationButtonClick = () => {
    redirect(config.routes.locations.new);
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get<GetLocations["response"]>(
          config.endpoints.locations.list
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
      endContent={[
        {
          text: t("add"),
          icon: <AddLocationAltIcon />,
          variant: "contained",
          onClick: onAddNewLocationButtonClick,
        },
      ]}
    >
      <Grid container spacing={3} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        {locationsData.map((location) => (
          <Grid key={location.id} size={1}>
            <LocationCard
              location={location}
              isModerator={
                !!authUser && permissions.moderator.includes(authUser.role)
              }
            />
          </Grid>
        ))}
      </Grid>
    </ContentLayout>
  );
}
