"use client";
import ContentLayout from "@/components/ContentLayout";
import { config } from "@/config";
import { useDocumentTitle } from "@/hooks";

import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { UserTable } from "@/app/[locale]/players/UserTable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { GetUsers, IUser } from "./types";
import { axiosClient } from "@/utils/axiosClient";

export default function PlayersListPage() {
  const t = useTranslations("players.list");
  useDocumentTitle(t("title"));
  const [playersData, setPlayersData] = useState<IUser[]>();

  const onAddNewPlayerButtonClick = () => {
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
      endContent={[
        {
          text: t("add"),
          icon: <PersonAddIcon color="inherit" />,
          variant: "contained",
          onClick: onAddNewPlayerButtonClick,
        },
      ]}
    >
      <UserTable data={playersData} />
    </ContentLayout>
  );
}

// import ContentLayout from "@/components/ContentLayout";
// import { config } from "@/config";
// import { getTranslations } from "next-intl/server";
// import { UserTable } from "@/app/[locale]/players/UserTable";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
// import { GetUsers } from "./types";
// import { axiosClient } from "@/utils/axiosClient"; // окремий клієнт для SSR (поясню нижче)
// import { redirect } from "next/navigation";

// type Props = {
//   params: Promise<{ locale: string }>;
// };

// export default async function PlayersListPage({ params }: Props) {
//   const { locale } = await params;
//   const t = await getTranslations({ locale, namespace: "players.list" });

//   let playersData: GetUsers["response"] = [];

//   try {
//     const res = await axiosClient.get<GetUsers["response"]>(
//       config.endpoints.players
//     );
//     playersData = res.data;
//   } catch (error) {
//     console.error("Failed to fetch players", error);
//     // Можеш або вивести помилку, або redirect чи render fallback
//   }

//   return (
//     <ContentLayout
//       title={t("title")}
//       // endContent={[
//       //   {
//       //     text: t("add"),
//       //     icon: <PersonAddIcon color="inherit" />,
//       //     variant: "contained",
//       //     onClick: () => redirect(config.routes.players.new), // або перенести цю кнопку в компонент-клієнт
//       //   },
//       // ]}
//     >
//       <div>hello</div>
//       {/* <UserTable data={playersData} /> */}
//     </ContentLayout>
//   );
// }
