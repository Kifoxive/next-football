"use client";

import ContentLayout from "@/components/ContentLayout";
import { config, permissions } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
// import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
import { Box, CircularProgress, Container, Paper } from "@mui/material";
import { GetOneGame } from "../types";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { createClient } from "@/utils/supabase/client";
import { IPictureItem } from "@/components/AddPictures";
import EditIcon from "@mui/icons-material/Edit";
import { LocationMap } from "../_components/LocationMap";
// import Image from "next/image";
// import { GameInfoPanel } from "../_components/GameInfoPanel";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { PictureSection } from "./_components/PictureSection";
import { LocationInfoSection } from "./_components/LocationInfoSection";
import { ReservationInfoSection } from "./_components/ReservationInfoSection";

export default function GamesEditPage() {
  const t = useTranslations();
  useDocumentTitle(t("games.detail.title"));

  const { id } = useParams();

  const supabase = createClient();
  const router = useRouter();
  const authUser = useAuthStore((s) => s.user);

  const [game, setGame] = useState<GetOneGame["response"]>();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data } = await axiosClient.get<GetOneGame["response"]>(
          `${config.endpoints.games}/${id}`
        );

        setGame(data);
      } catch (e) {
        console.error(e);
      } finally {
      }
    };
    fetchGame();
  }, [id]);

  if (!game)
    return (
      <Box className="flex justify-center items-center flex-1 mb-[10%]">
        <CircularProgress color="inherit" />
      </Box>
    );

  const {
    description,
    date,
    duration,
    reserved,
    status,
    // cancelled_reason,
    // locations: {
    //   name: location_name,
    //   description: location_description,
    //   address: location_address,
    //   price_per_hour: location_price_per_hour,
    //   floor_type: location_floor_type,
    //   building_type: location_building_type,
    //   latitude: location_latitude,
    //   longitude: location_longitude,
    //   image_list: location_image_list,
    // },
    locations,
  } = game;

  if (typeof id !== "string" || !authUser) return;

  const canUpdate = permissions["moderator"].includes(authUser.role);

  return (
    <ContentLayout
      title={t("games.detail.title")}
      endContent={[
        // {
        //   text: t("removeButton"),
        //   icon: <DeleteIcon />,
        //   variant: "outlined",
        //   color: "error",
        //   loading: isRemoveLoading,
        //   onClick: () => setIsRemoveConfirmationDialogOpen(true),
        // },
        {
          text: t("games.detail.editButton"),
          icon: <EditIcon />,
          variant: "contained",
          color: "inherit",
          show: canUpdate,
          onClick: () =>
            router.push(config.routes.games.edit.replace(":id", id)),
        },
      ]}
    >
      {/* <Box className="flex flex-col gap-4">
        <GameInfoPanel
          location_name={locations.name}
          date={date}
          duration={duration}
          status={status}
          reserved={reserved}
        />
        <Box className="flex gap-2">
          <FloorTypeCard value={FLOOR_TYPE_ENUM["artificial_grass"]} />
          <FloorTypeCard value={FLOOR_TYPE_ENUM["natural_grass"]} />
          <FloorTypeCard value={FLOOR_TYPE_ENUM["parquet"]} />
          <FloorTypeCard value={FLOOR_TYPE_ENUM["rubber"]} />
          <FloorTypeCard value={FLOOR_TYPE_ENUM["sand"]} />
          <FloorTypeCard value={FLOOR_TYPE_ENUM["asphalt"]} />
        </Box>
        {pictures[0] && (
          <Box className="relative h-[200px]">
            <Image
              src={pictures[0].url}
              alt={locations.name}
              fill
              objectFit="cover"
            />
            <Box className="absolute top-2 right-2">
              <FloorTypeCard value={locations.floor_type} />
            </Box>
          </Box>
        )}
        <MarkdownViewer content={description} />
        <Box component="ul" className="flex gap-4 overflow-scroll">
          {pictures.map(({ url }) => (
            <li key={url}>
              <Image src={url} alt={locations.name} height={160} width={240} />
            </li>
          ))}
        </Box>
        <Box className="h-[300px]">
          <LocationMap
            latitude={locations.latitude}
            longitude={locations.longitude}
            address={locations.address}
          />
        </Box>
      </Box> */}
      <Container className="flex flex-col gap-4" disableGutters>
        <Box component={Paper} className="p-4">
          <MarkdownViewer content={description} />
        </Box>
        <ReservationInfoSection
          date={date}
          duration={duration}
          reserved={reserved}
        />
        <PictureSection image_list={locations.image_list} />
        <LocationInfoSection
          name={locations.name}
          address={locations.address}
          price_per_hour={locations.price_per_hour}
          floor_type={locations.floor_type}
          building_type={locations.building_type}
          description="Outdoor sports complex"
          // description={locations.description}
        />
        <Box className="overflow-hidden h-60" component={Paper}>
          <LocationMap
            latitude={locations.latitude}
            longitude={locations.longitude}
            address={locations.address}
          />
        </Box>
      </Container>
    </ContentLayout>
  );
}
