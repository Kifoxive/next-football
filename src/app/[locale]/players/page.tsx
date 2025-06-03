"use client";
import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";
import { Box, Button, Fab, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { UserTable } from "@/app/[locale]/players/UserTable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { GetUsers, IUser } from "./types";
import { axiosClient } from "@/utils/axiosClient";

export default function PlayersTablePage() {
  const t = useTranslations("players.table");
  useDocumentTitle(t("title"));
  const [playersData, setPlayersData] = useState<IUser[]>();

  const onAddNewLocationButtonClick = () => {
    redirect(config.routes.players.new);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axiosClient.get<GetUsers["response"]>(
          config.endpoints.players
        );
        setPlayersData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlayers();
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
              startIcon={<PersonAddIcon color="inherit" />}
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
                <PersonAddIcon color="inherit" />
              </Tooltip>
            </Fab>
          </Box>
        </>
      }
    >
      <UserTable data={playersData} />
    </ContentLayout>
  );
}
