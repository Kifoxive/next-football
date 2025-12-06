import {
  GetUsersOptions,
  PlayerOptionType,
} from "@/app/[locale]/(authenticated)/players/types";
import { config } from "@/config";
import { axiosClient } from "@/utils/axiosClient";
import { Alert, AlertTitle, Container, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MultiAutocompleteField } from "@/components/form/components/MultiAutoCompleteField";
import { FormProvider, useForm } from "react-hook-form";
import { gameLobbyFormSchema, IGameLobbyForm } from "../../../types";
import { zodResolver } from "@hookform/resolvers/zod";

type GameLobbyProps = {
  selectedParticipants: PlayerOptionType[] | null;
  selectedModerators: PlayerOptionType[] | null;
  onLobbyUpdate: ({
    participants,
    moderators,
  }: {
    participants: string[];
    moderators: string[];
  }) => void;
};

export default function GameLobby({
  selectedParticipants,
  selectedModerators,
  onLobbyUpdate,
}: GameLobbyProps) {
  const t = useTranslations("games.lobby");
  const mainT = useTranslations("");

  const [searchOptions, setSearchOptions] = useState<PlayerOptionType[] | null>(
    null
  );

  const formDefaultValues: IGameLobbyForm = {
    participants: selectedParticipants || [],
    moderators: selectedModerators || [],
  };

  const methods = useForm<IGameLobbyForm>({
    defaultValues: formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(gameLobbyFormSchema(mainT)),
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data } = await axiosClient.get<GetUsersOptions["response"]>(
          config.endpoints.players.options
        );
        setSearchOptions(data);
      } catch (e) {
        toast.error(t("fetchError"));
        console.log(e);
      }
    };
    fetchPlayers();
  }, []);

  const onSubmit = async (formData: IGameLobbyForm) => {
    onLobbyUpdate({
      participants: formData.participants?.map((p) => p.value.toString()) || [],
      moderators: formData.moderators?.map((p) => p.value.toString()) || [],
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id="lobby_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container
          className="flex flex-col gap-4"
          disableGutters
          maxWidth={false}
        >
          <Grid container spacing={2} columns={{ xs: 1, sm: 2 }} size={1}>
            <Grid size={1}>
              <MultiAutocompleteField
                name="participants"
                label={t("participants.label")}
                placeholder={t("participants.placeholder")}
                noOptionsText={t("participants.noOptionsText")}
                loadingText={t("participants.loadingText")}
                options={searchOptions}
                loading={!searchOptions}
              />
            </Grid>
            <Grid size={1}>
              <MultiAutocompleteField
                name="moderators"
                label={t("moderators.label")}
                placeholder={t("moderators.placeholder")}
                noOptionsText={t("moderators.noOptionsText")}
                loadingText={t("moderators.loadingText")}
                options={searchOptions}
                loading={!searchOptions}
                enforceGlobalModerators
              />
            </Grid>
            <Grid size={1}>
              <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
                <AlertTitle>{t("moderatorInfo.title")}</AlertTitle>
                {t("moderatorInfo.description")}
              </Alert>
            </Grid>
          </Grid>
        </Container>
      </form>
    </FormProvider>
  );
}
