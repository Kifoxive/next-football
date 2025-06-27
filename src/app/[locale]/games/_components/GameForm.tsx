"use client";

import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";

import { SelectField, TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGameForm, IGame, gameFormSchema } from "@/app/[locale]/games/types";

import { config, GAME_STATUS } from "@/config";

import { DateTimePickerField } from "@/components/form/components/DateTimePickerField.tsx";
import { AutocompleteField } from "@/components/form/components/AutocompleteField";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
// import toast from "react-hot-toast";
import { OptionType } from "@/types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { MarkdownEditor } from "@/components/form/components/MarkdownEditor";
import { CheckboxField } from "@/components/form/components/CheckboxField";
import { GameStatusChip } from "@/components/GameStatusChip";

// import { LocationEditorMap } from "./LocationEditorMap";

type GameFormProps = {
  fetchedData?: IGame;
  onSubmitData: (data: IGameForm) => void;
};

export const GameForm: React.FC<GameFormProps> = ({
  fetchedData,
  onSubmitData,
}) => {
  const t = useTranslations();

  const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);

  const formDefaultValues = {
    description: "**Hello everyone**",
    location_id: undefined,
    date: undefined,
    time: undefined,
    duration: 90,
    min_yes_votes_count: 10,
    reserved: false,
    status: GAME_STATUS.initialization,
    cancelled_reason: null,
  };

  const methods = useForm<IGameForm>({
    defaultValues: fetchedData || formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(gameFormSchema(t)),
  });
  const { handleSubmit, watch } = methods;

  const selectedStatus = watch("status");

  const durationOptions = [30, 45, 60, 90, 120].map((value) => ({
    label: `${value} ${t("games.minutes")}`,
    value,
  }));

  const gameStatusOptions = Object.values(GAME_STATUS).map((value) => ({
    label: <GameStatusChip value={value} />,
    value,
  }));

  const onSubmit = async (formData: IGameForm) => {
    onSubmitData(formData);
  };

  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const res = await axiosClient.get(config.endpoints.locations.options);
        setLocationOptions(res.data);
      } catch {
        toast.error(t("games.locationsFetchError"));
      }
    };
    fetchLocationList();
  }, []);

  return (
    <FormProvider {...methods}>
      <form
        id="game_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container maxWidth="md" disableGutters>
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, sm: 2, md: 4 }}
            size={1}
            className="h-fit"
          >
            <Grid size={4}>
              <MarkdownEditor
                name="description"
                label={t("games.form.description")}
              />
            </Grid>
            <Grid size={1}>
              <DateTimePickerField
                name="date"
                label={t("games.form.date")}
                minDateTime={dayjs()}
              />
            </Grid>
            <Grid size={1}>
              <AutocompleteField
                name="duration"
                label={t("games.form.duration")}
                options={durationOptions}
                number
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <TextField
                name="min_yes_votes_count"
                label={t("games.form.min_yes_votes_count")}
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <SelectField
                name="location_id"
                label={t("games.form.location_id")}
                options={locationOptions}
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <SelectField
                name="status"
                label={t("games.form.status")}
                options={gameStatusOptions}
                fullWidth
              />
            </Grid>
            {selectedStatus === "cancelled" && (
              <Grid size={1}>
                <TextField
                  name="cancelled_reason"
                  label={t("games.form.cancelled_reason")}
                  fullWidth
                />
              </Grid>
            )}
            <Grid size={1}>
              <Box className="flex justify-end">
                <CheckboxField
                  name="reserved"
                  label={t("games.form.reserved")}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </form>
    </FormProvider>
  );
};
