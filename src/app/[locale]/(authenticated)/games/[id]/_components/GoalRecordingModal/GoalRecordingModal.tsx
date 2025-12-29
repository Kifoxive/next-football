"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { executeGameCommand } from "@/utils/gameCommands";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  SelectField,
  AutocompleteField,
  CheckboxField,
} from "@/components/form";
import { IGame } from "../../../types";
import { PlayerOptionType } from "@/app/[locale]/(authenticated)/players/types";
import { MOVE_TYPE, ASSIST_TYPE } from "@/config";
import { TFunction } from "@/utils/types";

const goalRecordingSchema = (t: TFunction) =>
  z.object({
    scorerId: z.string().min(1, { message: t("games.goal.scorerRequired") }),
    isGK: z.boolean(),
    assistId: z.string().optional(),
    isAssistGK: z.boolean(),
    moveType: z.nativeEnum(MOVE_TYPE),
    assistType: z.string().optional(),
    timeOffsetSeconds: z.number(),
  });

type IGoalRecordingForm = z.infer<ReturnType<typeof goalRecordingSchema>>;

type GoalRecordingModalProps = {
  open: boolean;
  gameId: string;
  game: IGame;
  participants: PlayerOptionType[];
  isLoading?: boolean;
  onClose: () => void;
  onGoalRecorded: () => void;
};

export default function GoalRecordingModal({
  open,
  gameId,
  game,
  participants,
  isLoading = false,
  onClose,
  onGoalRecorded,
}: GoalRecordingModalProps) {
  const t = useTranslations();
  const [isSubmittingPending, startSubmittingTransition] = useTransition();

  const formDefaultValues: IGoalRecordingForm = {
    scorerId: "",
    isGK: false,
    assistId: "",
    isAssistGK: false,
    moveType: MOVE_TYPE.regular_goal,
    assistType: "",
    timeOffsetSeconds: 0,
  };

  const methods = useForm<IGoalRecordingForm>({
    defaultValues: formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(goalRecordingSchema(t)),
  });

  const { handleSubmit, control } = methods;
  const assistIdValue = useWatch({ control, name: "assistId" });
  const timeOffsetSecondsValue = useWatch({
    control,
    name: "timeOffsetSeconds",
  });

  // Calculate current time for display
  const getElapsedSeconds = (): number => {
    if (!game.started_at) return 0;
    const startTime = new Date(game.started_at).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - startTime) / 1000);
  };

  const getAdjustedTimeSeconds = (): number => {
    return Math.max(0, getElapsedSeconds() + timeOffsetSecondsValue);
  };

  const getCurrentTimeDisplay = (): string => {
    const adjustedSeconds = getAdjustedTimeSeconds();
    const hours = Math.floor(adjustedSeconds / 3600);
    const minutes = Math.floor((adjustedSeconds % 3600) / 60);
    const seconds = adjustedSeconds % 60;

    return hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;
  };

  const handleRecordGoal = (formData: IGoalRecordingForm) => {
    // Calculate the adjusted time based on offset
    const baseTime = new Date(game.started_at || new Date()).getTime();
    const adjustedTime = new Date(baseTime + getAdjustedTimeSeconds() * 1000);

    const commandBody = {
      scorer_id: formData.scorerId,
      is_scorer_goalkeeper: formData.isGK,
      assist_id: formData.assistId || null,
      is_assist_goalkeeper: formData.isAssistGK,
      time: adjustedTime.toISOString(),
      type: formData.moveType,
      assist_type: formData.assistId
        ? formData.assistType || ASSIST_TYPE.regular_play
        : null,
    };

    startSubmittingTransition(async () => {
      toast.promise(
        executeGameCommand(gameId, "recordMove", commandBody).then(
          onGoalRecorded
        ),
        {
          loading: t("games.goal.goalRecording"),
          success: t("games.goal.goalRecorded"),
          error: t("games.goal.goalRecordError"),
        }
      );

      methods.reset(formDefaultValues);
      onClose();
    });
  };

  // Reset assistType when assistId changes
  const scorerId = useWatch({ control, name: "scorerId" });

  const participantOptions = participants.map((p) => ({
    label: p.label,
    value: p.value,
  }));

  const assistOptions = participants
    .filter((p) => p.value !== scorerId)
    .map((p) => ({
      label: p.label,
      value: p.value,
    }));

  const moveTypeOptions = Object.values(MOVE_TYPE).map((type) => ({
    label: t(`games.moveType.${type}`),
    value: type,
  }));

  const assistTypeOptions = Object.values(ASSIST_TYPE).map((type) => ({
    label: t(`games.assistType.${type}`),
    value: type,
  }));

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={() => {
        methods.reset(formDefaultValues);
        onClose();
      }}
    >
      <DialogTitle>{t("games.action.recordGoal")}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <FormProvider {...methods}>
          <form id="goal_recording_form">
            <Stack spacing={3}>
              {/* Current Time Display with Adjust Buttons */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    const current = methods.getValues("timeOffsetSeconds");
                    methods.setValue("timeOffsetSeconds", current - 30);
                  }}
                  disabled={isSubmittingPending || isLoading}
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
                  onClick={() => {
                    const current = methods.getValues("timeOffsetSeconds");
                    console.log(current);
                    methods.setValue("timeOffsetSeconds", current + 30);
                  }}
                  disabled={isSubmittingPending || isLoading}
                  title="Add 30 seconds"
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Scorer */}
              <AutocompleteField
                name="scorerId"
                label={t("games.action.scorer")}
                options={participantOptions}
              />

              {/* Scorer is GK */}
              <CheckboxField
                name="isGK"
                label={t("games.action.isGoalkeeper")}
                disabled={isSubmittingPending || isLoading}
              />

              {/* Move Type */}
              <SelectField
                name="moveType"
                label={t("games.action.goalType")}
                options={moveTypeOptions}
                fullWidth
                disabled={isSubmittingPending || isLoading}
              />

              {/* Assist Player */}
              <AutocompleteField
                name="assistId"
                label={t("games.action.assist")}
                options={assistOptions}
              />

              {/* Assist is GK - only show if assistId is selected */}
              {assistIdValue && (
                <CheckboxField
                  name="isAssistGK"
                  label={t("games.action.assistantIsGoalkeeper")}
                  disabled={isSubmittingPending || isLoading}
                />
              )}

              {/* Assist Type - only show if assistId is selected */}
              {assistIdValue && (
                <SelectField
                  name="assistType"
                  label={t("games.action.assistType")}
                  options={assistTypeOptions}
                  fullWidth
                  disabled={isSubmittingPending || isLoading}
                />
              )}
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            methods.reset(formDefaultValues);
            onClose();
          }}
          disabled={isSubmittingPending}
        >
          {t("basic.cancel")}
        </Button>
        <Button
          onClick={handleSubmit(handleRecordGoal)}
          variant="contained"
          color="success"
          disabled={isSubmittingPending || isLoading || !scorerId}
        >
          {isSubmittingPending
            ? t("games.action.recording")
            : t("games.action.recordButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
