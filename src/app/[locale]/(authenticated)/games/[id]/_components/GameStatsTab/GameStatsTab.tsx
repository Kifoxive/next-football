"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { IGame, IGoal } from "../../../types";
import { useAuthStore } from "@/store/auth";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { PieChart } from "@mui/x-charts/PieChart";
import { GoalsAreaChart } from "../GoalsAreaChart";

interface GameStatsTabProps {
  game: IGame;
  goals: IGoal[] | null;
}

export default function GameStatsTab({ game, goals }: GameStatsTabProps) {
  const t = useTranslations();
  const authUser = useAuthStore((s) => s.user);

  const stats = useMemo(() => {
    if (!goals || goals.length === 0) {
      return {
        totalGoals: 0,
        averageIntervalSeconds: 0,
        goalsWithAssist: 0,
        goalsWithAssistPercent: 0,
        myGoals: 0,
        myAssists: 0,
        myGoalShare: 0,
        topScorerRank: null,
        topAssisterRank: null,
        goalsPerInterval: new Map<number, { all: number; mine: number }>(),
      };
    }

    // Calculate basic stats
    const totalGoals = goals.length;
    const goalsWithAssist = goals.filter((g) => g.assist_id).length;
    const goalsWithAssistPercent = Math.round(
      (goalsWithAssist / totalGoals) * 100
    );

    // Calculate my stats
    const myGoals = goals.filter((g) => g.scorer_id === authUser?.id).length;
    const myAssists = goals.filter((g) => g.assist_id === authUser?.id).length;
    const myGoalShare = totalGoals > 0 ? (myGoals / totalGoals) * 100 : 0;

    // Calculate average interval
    let averageIntervalSeconds = 0;
    if (totalGoals > 1 && game.started_at) {
      const startTime = new Date(game.started_at).getTime();
      const endTime = game.ended_at
        ? new Date(game.ended_at).getTime()
        : new Date().getTime();
      const totalSeconds = (endTime - startTime) / 1000;
      averageIntervalSeconds = Math.round(totalSeconds / totalGoals);
    }

    const totalMinutes = game.started_at
      ? ((game.ended_at
          ? new Date(game.ended_at).getTime()
          : new Date().getTime()) -
          new Date(game.started_at).getTime()) /
        1000 /
        60
      : 0;

    // Calculate goal types distribution
    const goalTypeStats = new Map<string, number>();
    goals.forEach((goal) => {
      const type = goal.type || "unknown";
      goalTypeStats.set(type, (goalTypeStats.get(type) || 0) + 1);
    });

    // Calculate goal times for 10-minute intervals
    const goalsPerInterval = new Map<number, { all: number; mine: number }>();

    if (game.started_at) {
      const startTime = new Date(game.started_at).getTime();
      // Initialize with 0 and ensure 0-100 minute range (0 stays 0, data shifts right)
      for (let i = 0; i <= totalMinutes; i += 10) {
        goalsPerInterval.set(i, { all: 0, mine: 0 });
      }

      goals.forEach((goal) => {
        const goalTime = new Date(goal.time).getTime();
        const secondsSinceStart = (goalTime - startTime) / 1000;
        const minutesSinceStart = Math.floor(secondsSinceStart / 60);
        // Get 10-minute interval: minute 0-9 -> interval 0, minute 10-19 -> interval 10, etc.
        // But we shift to show: interval 0 = start (0 goals), interval 10 = 0-9 mins, interval 20 = 10-19 mins, etc.
        const intervalStart =
          minutesSinceStart === 0
            ? 10
            : Math.ceil((minutesSinceStart + 1) / 10) * 10;

        if (!goalsPerInterval.has(intervalStart)) {
          goalsPerInterval.set(intervalStart, { all: 0, mine: 0 });
        }

        const current = goalsPerInterval.get(intervalStart)!;
        current.all++;
        if (goal.scorer_id === authUser?.id) {
          current.mine++;
        }
      });
    }

    // Calculate rankings (only for my stats)
    let topScorerRank: number | null = null;
    let topAssisterRank: number | null = null;

    if (authUser?.id) {
      // Count goals per player
      const playerGoals = new Map<string, number>();
      goals.forEach((g) => {
        playerGoals.set(g.scorer_id, (playerGoals.get(g.scorer_id) || 0) + 1);
      });

      const sortedByGoals = Array.from(playerGoals.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

      topScorerRank = sortedByGoals.indexOf(authUser.id) + 1 || null;

      // Count assists per player
      const playerAssists = new Map<string, number>();
      goals.forEach((g) => {
        if (g.assist_id) {
          playerAssists.set(
            g.assist_id,
            (playerAssists.get(g.assist_id) || 0) + 1
          );
        }
      });

      const sortedByAssists = Array.from(playerAssists.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

      topAssisterRank = sortedByAssists.indexOf(authUser.id) + 1 || null;
    }

    return {
      totalGoals,
      averageIntervalSeconds,
      goalsWithAssist,
      goalsWithAssistPercent,
      myGoals,
      myAssists,
      myGoalShare,
      topScorerRank,
      topAssisterRank,
      goalsPerInterval,
      goalTypeStats,
    };
  }, [goals, authUser?.id]);

  const formatInterval = (seconds: number): string => {
    if (seconds === 0) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const getIntensityLevel = (
    intervalSeconds: number
  ): "intensive" | "normal" | "relaxed" => {
    if (intervalSeconds === 0) return "normal";
    const minutes = intervalSeconds / 60;
    if (minutes <= 2) return "intensive";
    if (minutes <= 4) return "normal";
    return "relaxed";
  };

  const intensityLevel = getIntensityLevel(stats.averageIntervalSeconds);

  // Prepare chart data - goals per 10-minute interval for MUI charts
  const chartDataForMUI = useMemo(() => {
    if (stats.goalsPerInterval.size === 0) {
      return {
        xAxisData: [],
        allGoalsData: [],
        myGoalsData: [],
      };
    }

    const intervals = Array.from(stats.goalsPerInterval.entries()).sort(
      (a, b) => a[0] - b[0]
    );

    const xAxisData = intervals.map(([intervalStart]) => `${intervalStart}`);
    const allGoalsData = intervals.map(([, counts]) => counts.all);
    const myGoalsData = intervals.map(([, counts]) => counts.mine);

    return {
      xAxisData,
      allGoalsData,
      myGoalsData,
    };
  }, [stats.goalsPerInterval]);

  // Prepare pie chart data for goal types
  const pieChartData = useMemo(() => {
    if (!stats.goalTypeStats || stats.goalTypeStats.size === 0) {
      return [];
    }
    return Array.from(stats.goalTypeStats.entries()).map(
      ([type, count], index) => ({
        id: index,
        value: count,
        label: t(`games.moveType.${type}`),
      })
    );
  }, [stats.goalTypeStats, t]);

  // Prepare chart data - goals per 10-minute interval
  const chartData = useMemo(() => {
    if (stats.goalsPerInterval.size === 0) return [];

    const data = Array.from(stats.goalsPerInterval.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([intervalStart, counts]) => ({
        interval: `${intervalStart}-${intervalStart + 9}`,
        intervalStart,
        [t("games.stats.goalsOverTime.allGoals")]: counts.all,
        [t("games.stats.goalsOverTime.myGoalsLine")]: counts.mine,
      }));

    return data;
  }, [stats.goalsPerInterval, t]);

  return (
    <Box sx={{ width: "100%" }}>
      <Container maxWidth="md" disableGutters>
        {goals === null ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
            </Stack>
          </Box>
        ) : (
          <Stack spacing={2}>
            {/* General Statistics */}
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3 }}>
                {t("games.stats.matchStatistics.title")}
              </Typography>

              <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
                {/* Total Goals */}
                <Grid size={{ xs: 1, sm: 1 }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {t("games.stats.matchStatistics.totalGoals")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {stats.totalGoals}
                    </Typography>
                  </Box>
                </Grid>

                {/* Average Interval with Intensity */}
                <Grid size={{ xs: 1, sm: 1 }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {t("games.stats.matchStatistics.averageInterval")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {formatInterval(stats.averageIntervalSeconds)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        marginTop: 1,
                        color:
                          intensityLevel === "intensive"
                            ? "error.main"
                            : intensityLevel === "normal"
                            ? "warning.main"
                            : "success.main",
                      }}
                    >
                      {t(`games.stats.matchStatistics.goalIntensity`)}:{" "}
                      {t(`games.stats.matchStatistics.${intensityLevel}`)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* My Statistics */}
            <Paper sx={{ padding: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 3 }}>
                {t("games.stats.myStatistics.title")}
              </Typography>

              <Grid container spacing={3} columns={{ xs: 1, sm: 2 }}>
                {/* My Goals */}
                <Grid size={{ xs: 1, sm: 1 }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {t("games.stats.myStatistics.myGoals")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {stats.myGoals}
                    </Typography>
                  </Box>
                </Grid>

                {/* My Assists */}
                <Grid size={{ xs: 1, sm: 1 }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {t("games.stats.myStatistics.myAssists")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                      {stats.myAssists}
                    </Typography>
                  </Box>
                </Grid>

                {/* My Share */}
                <Grid size={{ xs: 2, sm: 2 }}>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      {t("games.stats.myStatistics.myShare")}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {stats.myGoalShare.toFixed(1)}%
                    </Typography>
                  </Box>
                </Grid>

                {/* Top Scores */}
                <Grid size={{ xs: 2, sm: 2 }}>
                  <Stack spacing={1}>
                    {stats.topScorerRank && (
                      <Typography variant="body2">
                        {t("games.stats.myStatistics.topScorer", {
                          rank: stats.topScorerRank,
                        })}
                      </Typography>
                    )}
                    {stats.topAssisterRank && (
                      <Typography variant="body2">
                        {t("games.stats.myStatistics.topAssister", {
                          rank: stats.topAssisterRank,
                        })}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* Goals Intensity Chart - Goals per 10-minute interval */}
            {chartData.length > 0 && (
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                  {t("games.stats.goalsOverTime.title")}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginBottom: 2 }}
                >
                  {t("games.stats.goalsOverTime.description")}
                </Typography>
                <Box className="w-full">
                  <GoalsAreaChart chartDataForMUI={chartDataForMUI} />
                </Box>
              </Paper>
            )}

            {/* Goal Types Distribution Pie Chart */}
            {pieChartData.length > 0 && (
              <Paper sx={{ padding: 3 }}>
                <Typography variant="h6" sx={{ marginBottom: 3 }}>
                  {t("games.stats.goalTypes.title")}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <PieChart
                    series={[
                      {
                        innerRadius: 30,
                        data: pieChartData,
                      },
                    ]}
                    width={200}
                    height={100}
                  />
                </Box>
              </Paper>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
