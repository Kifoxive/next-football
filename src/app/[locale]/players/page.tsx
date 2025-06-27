"use client";
import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UsersTable } from "@/app/[locale]/players/_components/UsersTable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { GetUsers, IUser } from "./types";
import { axiosClient } from "@/utils/axiosClient";
import toast from "react-hot-toast";

export default function PlayersListPage() {
  const t = useTranslations("players.list");
  useDocumentTitle(t("title"));

  const router = useRouter();
  const [playersData, setPlayersData] = useState<IUser[]>();

  const onAddNewPlayerButtonClick = () => {
    router.push(config.routes.players.new);
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axiosClient.get<GetUsers["response"]>(
          config.endpoints.players.list
        );
        setPlayersData(res.data);
      } catch (error) {
        console.error(error);
        toast.error(t("fetchError"));
      }
    };

    fetchPlayers();
  }, []);

  return (
    <ContentLayout
      title={t("title")}
      isLoading={!playersData}
      endContent={[
        {
          text: t("add"),
          icon: <PersonAddIcon color="inherit" />,
          variant: "contained",
          onClick: onAddNewPlayerButtonClick,
        },
      ]}
    >
      <UsersTable data={playersData} />
    </ContentLayout>
  );
}
