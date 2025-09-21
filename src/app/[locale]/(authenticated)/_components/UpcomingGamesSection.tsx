import { Box, Typography } from "@mui/material";
import { GetFreshGames } from "../games/types";
import { FreshGame } from "./FreshGame";
import { useTranslations } from "next-intl";

type UpcomingGamesSectionProps = { gamesData: GetFreshGames["response"] };

export const UpcomingGamesSection: React.FC<UpcomingGamesSectionProps> = ({
  gamesData,
}) => {
  const t = useTranslations("home.upcomingGamesSection");

  return (
    <Box className="flex flex-col gap-2">
      <Typography variant="h6" component="h2">
        {t("title")}
      </Typography>
      <Box className="flex flex-col gap-4">
        {gamesData.map((game) => (
          <FreshGame key={game.id} {...game} />
        ))}
      </Box>
    </Box>
  );
};
