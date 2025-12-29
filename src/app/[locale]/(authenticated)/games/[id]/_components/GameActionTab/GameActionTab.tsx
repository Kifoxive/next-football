"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { executeGameCommand } from "@/utils/gameCommands";
import { GAME_STATUS } from "@/config";

import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { IGame, IGoal } from "../../../types";
import GoalRecordingModal from "../GoalRecordingModal/GoalRecordingModal";
import { Container } from "@mui/material";
import GoalsListSection from "./GoalsListSection";
import GameTimer from "./GameTimer";

interface GameActionTabProps {
  gameId: string;
  goals: IGoal[] | null;
  game: IGame;
  isLoading?: boolean;
  onGameStatusChange: (game: IGame) => void;
  onGoalRecorded: () => void;
}

export default function GameActionTab({
  gameId,
  game,
  goals,
  isLoading = false,
  onGameStatusChange,
  onGoalRecorded,
}: GameActionTabProps) {
  const t = useTranslations();
  const [isCommandPending, startCommandTransition] = useTransition();
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const participants = game.participants || [];
  const isGameLive = game.status === GAME_STATUS.live;

  const handleStartGame = () => {
    startCommandTransition(async () => {
      try {
        const result = await executeGameCommand(gameId, "startGame");
        if (result.success) {
          toast.success(t("games.control.gameStarted"));
          onGameStatusChange?.(result.game!);
        } else {
          toast.error(result.error || t("games.control.startGameError"));
        }
      } catch (error) {
        toast.error(t("games.control.startGameError"));
        console.error(error);
      }
    });
  };

  const handleEndGame = () => {
    startCommandTransition(async () => {
      try {
        const result = await executeGameCommand(gameId, "endGame");
        if (result.success) {
          toast.success(t("games.control.gameEnded"));
          onGameStatusChange?.(result.game!);
        } else {
          toast.error(result.error || t("games.control.endGameError"));
        }
      } catch (error) {
        toast.error(t("games.control.endGameError"));
        console.error(error);
      }
    });
  };

  const handleOpenGoalModal = () => {
    setOpenGoalModal(true);
  };

  const handleCloseGoalModal = () => {
    setOpenGoalModal(false);
  };

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
            marginBottom: 2,
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
            <GameTimer
              isGameLive={isGameLive}
              started_at={game.started_at}
              ended_at={game.ended_at}
            />

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
                <LoadingButton
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStartGame}
                  disabled={game.status !== GAME_STATUS.confirmed}
                  loading={isCommandPending}
                >
                  {t("games.control.startGame")}
                </LoadingButton>
              )}

              {isGameLive && (
                <LoadingButton
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleEndGame}
                  loading={isCommandPending}
                >
                  {t("games.control.endGameBtn")}
                </LoadingButton>
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
              <LoadingButton
                variant="contained"
                color="success"
                onClick={handleOpenGoalModal}
                loading={isCommandPending}
                size="large"
              >
                {t("games.action.recordGoal")}
              </LoadingButton>
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
          onGoalRecorded={onGoalRecorded}
          gameId={gameId}
          game={game}
          participants={participants}
          isLoading={isLoading}
        />
      </Container>
    </Box>
  );
}
