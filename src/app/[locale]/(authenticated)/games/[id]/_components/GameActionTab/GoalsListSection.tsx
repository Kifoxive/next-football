import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { IGoal } from "../../../types";
import { useTranslations } from "next-intl";

type GoalsListSectionProps = {
  goals: IGoal[] | null;
  getPlayerName: (playerId: string) => string;
  game: { started_at: string | null };
};

export default function GoalsListSection({
  goals,
  getPlayerName,
  game,
}: GoalsListSectionProps) {
  const t = useTranslations();

  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {t("games.action.goalsListSection.goalsAmount", {
          amount: goals?.length ?? "...",
        })}
      </Typography>
      {goals ? (
        <Stack spacing={1}>
          {goals.map((goal, index) => {
            // Calculate elapsed time from game.started_at to goal.time
            const gameStartTime = game.started_at
              ? new Date(game.started_at).getTime()
              : 0;
            const goalTime = new Date(goal.time).getTime();
            const elapsedSeconds = Math.floor(
              (goalTime - gameStartTime) / 1000
            );
            const hours = Math.floor(elapsedSeconds / 3600);
            const minutes = Math.floor((elapsedSeconds % 3600) / 60);
            const seconds = elapsedSeconds % 60;
            const scorerName = getPlayerName(goal.scorer_id);
            const assistName = goal.assist_id
              ? getPlayerName(goal.assist_id)
              : null;

            return (
              <Box
                key={goal.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 2,
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {hours > 0
                      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
                      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, marginX: 2 }}>
                  <Typography variant="body2">
                    <strong>{scorerName}</strong>
                    {goal.is_scorer_goalkeeper && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ ml: 1 }}
                      >
                        (GK)
                      </Typography>
                    )}
                    {assistName && (
                      <>
                        <Typography component="span" variant="body2">
                          {" "}
                          ← {assistName}
                        </Typography>
                        {goal.is_assist_goalkeeper && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1 }}
                          >
                            (GK)
                          </Typography>
                        )}
                      </>
                    )}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  #{index + 1}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      ) : (
        <Box className="w-full flex justify-center">
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
}
