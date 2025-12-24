"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { executeGameCommand } from "@/utils/gameCommands";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IGame } from "../../../types";
import { PlayerOptionType } from "@/app/[locale]/(authenticated)/players/types";
import { MOVE_TYPE, ASSIST_TYPE } from "@/config";

interface GoalRecordingModalProps {
  open: boolean;
  onClose: () => void;
  gameId: string;
  game: IGame;
  participants: PlayerOptionType[];
  isLoading?: boolean;
  onGoalRecorded?: () => void;
}

export default function GoalRecordingModal({
  open,
  onClose,
  gameId,
  game,
  participants,
  isLoading = false,
  onGoalRecorded,
}: GoalRecordingModalProps) {
  const t = useTranslations();

  // Form states
  const [scorerId, setScorerId] = useState("");
  const [isGK, setIsGK] = useState(false);
  const [assistId, setAssistId] = useState("");
  const [isAssistGK, setIsAssistGK] = useState(false);
  const [moveType, setMoveType] = useState<MOVE_TYPE>(MOVE_TYPE.regular_goal);
  const [assistType, setAssistType] = useState<ASSIST_TYPE>(
    ASSIST_TYPE.regular_play
  );
  const [timeOffsetSeconds, setTimeOffsetSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate current time for display
  const getElapsedSeconds = (): number => {
    if (!game.started_at) return 0;
    const startTime = new Date(game.started_at).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - startTime) / 1000);
  };

  const getAdjustedTimeSeconds = (): number => {
    return Math.max(0, getElapsedSeconds() + timeOffsetSeconds);
  };

  const getCurrentTimeDisplay = (): string => {
    const adjustedSeconds = getAdjustedTimeSeconds();
    const hours = Math.floor(adjustedSeconds / 3600);
    const minutes = Math.floor((adjustedSeconds % 3600) / 60);
    const seconds = adjustedSeconds % 60;

    return hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleRecordGoal = async () => {
    // Validation
    if (!scorerId) {
      toast.error(t("games.goal.scorerRequired"));
      return;
    }

    setIsSubmitting(true);

    // Calculate the adjusted time based on offset
    const baseTime = new Date(game.started_at || new Date()).getTime();
    const adjustedTime = new Date(baseTime + getAdjustedTimeSeconds() * 1000);

    const result = await executeGameCommand(gameId, "recordMove", {
      scorer_id: scorerId,
      is_scorer_goalkeeper: isGK,
      assist_id: assistId || null,
      is_assist_goalkeeper: isAssistGK,
      time: adjustedTime.toISOString(),
      type: moveType,
      assist_type: assistType,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setScorerId("");
      setIsGK(false);
      setAssistId("");
      setIsAssistGK(false);
      setMoveType(MOVE_TYPE.regular_goal);
      setAssistType(ASSIST_TYPE.regular_play);
      setTimeOffsetSeconds(0);
      // Trigger callback which will show toast and refresh
      onGoalRecorded?.();
      onClose();
    } else {
      toast.error(result.error || t("games.goal.goalRecordError"));
    }
  };

  const handleClose = () => {
    // Reset form on close
    setScorerId("");
    setIsGK(false);
    setAssistId("");
    setIsAssistGK(false);
    setMoveType(MOVE_TYPE.regular_goal);
    setAssistType(ASSIST_TYPE.regular_play);
    setTimeOffsetSeconds(0);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("games.action.recordGoal")}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Current Time Display with Adjust Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => setTimeOffsetSeconds((prev) => prev - 30)}
              disabled={isSubmitting || isLoading}
              title="Remove 30 seconds"
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              label="Time"
              value={getCurrentTimeDisplay()}
              disabled
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => setTimeOffsetSeconds((prev) => prev + 30)}
              disabled={isSubmitting || isLoading}
              title="Add 30 seconds"
            >
              <AddIcon />
            </IconButton>
          </Box>

          {/* Scorer */}
          <FormControl fullWidth>
            <InputLabel>{t("games.action.scorer")}</InputLabel>
            <Select
              value={scorerId}
              label={t("games.action.scorer")}
              onChange={(e) => setScorerId(e.target.value)}
              disabled={isSubmitting || isLoading}
            >
              <MenuItem value="">
                <em>{t("games.action.selectPlayer")}</em>
              </MenuItem>
              {participants.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Scorer is GK */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isGK}
                onChange={(e) => setIsGK(e.target.checked)}
                disabled={isSubmitting || isAssistGK || isLoading}
              />
            }
            label={t("games.action.isGoalkeeper")}
          />

          {/* Assist Player */}
          <FormControl fullWidth>
            <InputLabel>{t("games.action.assist")}</InputLabel>
            <Select
              value={assistId}
              label={t("games.action.assist")}
              onChange={(e) => setAssistId(e.target.value)}
              disabled={isSubmitting || isLoading}
            >
              <MenuItem value="">
                <em>{t("games.action.noAssist")}</em>
              </MenuItem>
              {participants
                .filter((p) => p.value !== scorerId)
                .map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Assist is GK */}
          {assistId && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAssistGK}
                  onChange={(e) => setIsAssistGK(e.target.checked)}
                  disabled={isSubmitting || isGK || isLoading}
                />
              }
              label={t("games.action.assistantIsGoalkeeper")}
            />
          )}

          {/* Move Type */}
          <FormControl fullWidth>
            <InputLabel>{t("games.action.goalType")}</InputLabel>
            <Select
              value={moveType}
              label={t("games.action.goalType")}
              onChange={(e) => setMoveType(e.target.value as MOVE_TYPE)}
              disabled={isSubmitting || isLoading}
            >
              {Object.values(MOVE_TYPE).map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`games.moveType.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Assist Type */}
          <FormControl fullWidth>
            <InputLabel>{t("games.action.assistType")}</InputLabel>
            <Select
              value={assistType}
              label={t("games.action.assistType")}
              onChange={(e) => setAssistType(e.target.value as ASSIST_TYPE)}
              disabled={isSubmitting || isLoading || !assistId}
            >
              {Object.values(ASSIST_TYPE).map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`games.assistType.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          {t("basic.cancel")}
        </Button>
        <Button
          onClick={handleRecordGoal}
          variant="contained"
          color="success"
          disabled={isSubmitting || isLoading || !scorerId}
        >
          {isSubmitting
            ? t("games.action.recording")
            : t("games.action.recordButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
