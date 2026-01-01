"use server";

import { Box, Typography } from "@mui/material";
import { GetFreshGames } from "../games/types";
import { FreshGame } from "./FreshGame";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { getTranslations } from "next-intl/server";

type UpcomingGamesSectionProps = {
  gamesData: GetFreshGames["response"];
};

export const UpcomingGamesSection: React.FC<
  UpcomingGamesSectionProps
> = async ({ gamesData }) => {
  const t = await getTranslations("home.upcomingGamesSection");

  return (
    <Box className="flex flex-col gap-2">
      <Typography variant="h6" component="h2">
        {t("title")}
      </Typography>
      <Box className="flex flex-col gap-4">
        {gamesData.length ? (
          gamesData.map((game) => <FreshGame key={game.id} {...game} />)
        ) : (
          <Typography className="flex items-center gap-2">
            <SentimentVeryDissatisfiedIcon fontSize="small" />
            {t("noGames")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
