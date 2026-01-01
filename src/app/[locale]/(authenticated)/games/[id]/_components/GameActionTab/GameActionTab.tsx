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
import Dialog from "@/components/Dialog/Dialog";

interface GameActionTabProps {
  gameId: string;
  goals: IGoal[] | null;
  game: IGame;
  isLoading?: boolean;
  onGameStatusChange: (
    game: Pick<IGame, "status" | "started_at" | "ended_at">
  ) => void;
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
  const [isStartGameModalOpen, setIsStartGameModalOpen] = useState(false);
  const [isEndGameModalOpen, setIsEndGameModalOpen] = useState(false);

  const handleStartGame = () => {
    startCommandTransition(async () => {
      await toast.promise(executeGameCommand(gameId, "startGame"), {
        loading: t("games.action.start.loading"),
        success: (result) => {
          if (result.game) {
            const data = {
              status: result.game.status,
              started_at: result.game.started_at,
              ended_at: result.game.ended_at,
            };
            onGameStatusChange(data);
          }
          return t("games.action.start.success");
        },
        error: t("games.action.start.error"),
      });
    });
  };

  const handleEndGame = () => {
    startCommandTransition(async () => {
      await toast.promise(executeGameCommand(gameId, "endGame"), {
        loading: t("games.action.end.loading"),
        success: (result) => {
          if (result.game) {
            const data = {
              status: result.game.status,
              started_at: result.game.started_at,
              ended_at: result.game.ended_at,
            };
            onGameStatusChange(data);
          }
          return t("games.action.end.success");
        },
        error: t("games.action.end.error"),
      });
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
                  onClick={() => setIsStartGameModalOpen(true)}
                  disabled={game.status !== GAME_STATUS.confirmed}
                  loading={isCommandPending}
                >
                  {t("games.action.start.text")}
                </LoadingButton>
              )}

              {isGameLive && (
                <LoadingButton
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={() => setIsEndGameModalOpen(true)}
                  loading={isCommandPending}
                >
                  {t("games.action.end.text")}
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
        <Dialog
          isOpen={isStartGameModalOpen}
          title={t("games.action.startDialog.title")}
          description={t("games.action.startDialog.description")}
          agreeBtnText={t("games.action.startDialog.agreeBtnText")}
          cancelBtnText={t("games.action.startDialog.cancelBtnText")}
          onAgree={() => {
            handleStartGame();
            setIsStartGameModalOpen(false);
          }}
          onCancel={() => setIsStartGameModalOpen(false)}
          setIsOpen={setIsStartGameModalOpen}
        />
        <Dialog
          isOpen={isEndGameModalOpen}
          title={t("games.action.endDialog.title")}
          description={t("games.action.endDialog.description")}
          agreeBtnText={t("games.action.endDialog.agreeBtnText")}
          cancelBtnText={t("games.action.endDialog.cancelBtnText")}
          onAgree={() => {
            handleEndGame();
            setIsEndGameModalOpen(false);
          }}
          onCancel={() => setIsEndGameModalOpen(false)}
          setIsOpen={setIsEndGameModalOpen}
        />
      </Container>
    </Box>
  );
}
