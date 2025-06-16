"use client";

import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";

import { SelectField, TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGameForm, IGame, gameFormSchema } from "@/app/[locale]/games/types";

import { config, GAME_STATUS } from "@/config";
import { CheckboxField } from "@/components/form/components/CheckboxFIeld";
import { DateTimePickerField } from "@/components/form/components/DateTimePickerField.tsx";
import { AutocompleteField } from "@/components/form/components/AutocompleteField";
import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axiosClient";
// import toast from "react-hot-toast";
import { OptionType } from "@/types";

// import { LocationEditorMap } from "./LocationEditorMap";

type GameFormProps = {
  fetchedData?: IGame;
  isLoading: boolean;
  onSubmitData: (data: IGameForm) => void;
};

export const LocationForm: React.FC<GameFormProps> = ({
  fetchedData,
  onSubmitData,
}) => {
  const t = useTranslations();

  const [locationOptions, setLocationOptions] = useState<OptionType[]>([]);

  const formDefaultValues = {
    description: "",
    location_id: undefined,
    date: undefined,
    time: undefined,
    duration: 90,
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
  const { handleSubmit } = methods;

  const durationOptions = [30, 45, 60, 90, 120].map((value) => ({
    label: String(value),
    value,
  }));

  const onSubmit = async (formData: IGameForm) => {
    onSubmitData(formData);
  };

  const onError = (errors: FieldErrors<IGameForm>) => {
    console.log(errors);
  };

  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const res = await axiosClient.get(
          `${config.endpoints.locations}/options`
        );
        setLocationOptions(res.data);
      } catch {
        // toast.error(t("createError"));
      }
    };
    fetchLocationList();
  }, []);

  return (
    <FormProvider {...methods}>
      <form id="game_form" onSubmit={handleSubmit(onSubmit, onError)}>
        <Container maxWidth="sm" disableGutters>
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, sm: 3 }}
            size={1}
            className="h-fit"
          >
            <Grid size={3}>
              <TextField
                name="description"
                label={t("games.form.description")}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            <Grid size={1}>
              <DateTimePickerField name="date" label={t("games.form.date")} />
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
              <SelectField
                name="location_id"
                label={t("games.form.location_id")}
                options={locationOptions}
                fullWidth
              />
            </Grid>
            <Grid size={3}>
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
