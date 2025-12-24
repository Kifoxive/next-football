"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { executeGameCommand } from "@/utils/gameCommands";
import { GAME_STATUS } from "@/config";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { IGame, IGoal } from "../../../types";
import GoalRecordingModal from "../GoalRecordingModal/GoalRecordingModal";
import { Container } from "@mui/material";
import GoalsListSection from "./GoalsListSection";

interface GameActionTabProps {
  gameId: string;
  game: IGame;
  isLoading?: boolean;
  onGameStatusChange?: (game: IGame) => void;
}

export default function GameActionTab({
  gameId,
  game,
  isLoading = false,
  onGameStatusChange,
}: GameActionTabProps) {
  const t = useTranslations();

  // Form states
  const [goals, setGoals] = useState<IGoal[] | null>(null);
  const [openGoalModal, setOpenGoalModal] = useState(false);

  // Game control states
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Calculate elapsed time from started_at
  const getElapsedSeconds = (): number => {
    if (!game.started_at) return 0;
    const startTime = new Date(game.started_at).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - startTime) / 1000);
  };

  const [elapsedSeconds, setElapsedSeconds] = useState(getElapsedSeconds());

  const participants = game.participants || [];
  const isGameLive = game.status === GAME_STATUS.live;

  // Calculate time components from elapsed seconds
  const currentTimeHours = Math.floor(elapsedSeconds / 3600);
  const currentTimeMinutes = Math.floor((elapsedSeconds % 3600) / 60);
  const currentTimeSeconds = elapsedSeconds % 60;

  // Format time as HH:MM:SS

  // Timer effect - calculate from started_at
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGameLive && game.started_at) {
      // Update timer every second based on started_at timestamp
      interval = setInterval(() => {
        setElapsedSeconds(getElapsedSeconds());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isGameLive, game.started_at]);

  // Update timer when game state changes
  useEffect(() => {
    if (isGameLive) {
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  }, [isGameLive]);

  const handleStartGame = async () => {
    const result = await executeGameCommand(gameId, "startGame");
    if (result.success) {
      toast.success(t("games.control.gameStarted"));
      // Timer will auto-calculate from started_at
      onGameStatusChange?.(result.game!);
    } else {
      toast.error(result.error || t("games.control.startGameError"));
    }
  };

  const handleEndGame = async () => {
    const result = await executeGameCommand(gameId, "endGame");
    if (result.success) {
      toast.success(t("games.control.gameEnded"));
      onGameStatusChange?.(result.game!);
    } else {
      toast.error(result.error || t("games.control.endGameError"));
    }
  };

  const handleOpenGoalModal = () => {
    setOpenGoalModal(true);
  };

  const handleCloseGoalModal = () => {
    setOpenGoalModal(false);
  };

  const handleGoalRecorded = () => {
    toast.success(t("games.goal.goalRecorded"));
    fetchGoals();
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}/goals`);
      if (response.ok) {
        const data = await response.json();
        setGoals(
          data.sort(
            (a: IGoal, b: IGoal) =>
              new Date(a.time).getTime() - new Date(b.time).getTime()
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, [gameId]);

  const getPlayerName = (playerId: string) => {
    return (
      participants.find((p) => p.value === playerId)?.label || "Unknown Player"
    );
  };

  return (
    <Box className="w-full flex justify-center">
      {/* Game Control Section */}
      <Container disableGutters maxWidth="md">
        <Paper
          sx={{
            padding: 3,
            marginBottom: 3,
            backgroundColor: "background.default",
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            {/* Timer */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
                color: isTimerRunning ? "success.main" : "text.secondary",
              }}
            >
              {currentTimeHours > 0
                ? `${String(currentTimeHours).padStart(2, "0")}:${String(currentTimeMinutes).padStart(2, "0")}:${String(currentTimeSeconds).padStart(2, "0")}`
                : `${String(currentTimeMinutes).padStart(2, "0")}:${String(currentTimeSeconds).padStart(2, "0")}`}
            </Typography>

            {/* Game Status */}
            <Typography variant="body2" color="text.secondary">
              {t(`games.game_status.${game.status}`)}
            </Typography>

            {/* Control Buttons */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              {!isGameLive && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartGame}
                  disabled={isLoading || game.status !== GAME_STATUS.confirmed}
                >
                  {t("games.control.startGame")}
                </Button>
              )}

              {isGameLive && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleEndGame}
                  disabled={isLoading}
                >
                  {t("games.control.endGameBtn")}
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
        {/* Goal Recording Section */}
        {isGameLive && (
          <Paper sx={{ padding: 3, marginBottom: 3 }}>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
              {t("games.action.recordGoal")}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                onClick={handleOpenGoalModal}
                disabled={isLoading}
                size="large"
              >
                {t("games.action.recordGoal")}
              </Button>
            </Stack>
          </Paper>
        )}
        {/* Goals List Section */}
        <GoalsListSection
          goals={goals}
          getPlayerName={getPlayerName}
          game={game}
        />
        {/* Goal Recording Modal */}
        <GoalRecordingModal
          open={openGoalModal}
          onClose={handleCloseGoalModal}
          gameId={gameId}
          game={game}
          participants={participants}
          isLoading={isLoading}
          onGoalRecorded={handleGoalRecorded}
        />
      </Container>
    </Box>
  );
}
