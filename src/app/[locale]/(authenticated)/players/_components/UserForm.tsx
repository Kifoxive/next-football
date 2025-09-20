"use client";

import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { USER_ROLE } from "@/store/auth";
import { SelectField, TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userFormSchema,
  IUserForm,
  IUser,
} from "@/app/[locale]/(authenticated)/players/types";
import { MarkdownEditor } from "@/components/form/components/MarkdownEditor/MarkdownEditor";
import ShieldIcon from "@mui/icons-material/Shield";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

type UserFormProps = {
  fetchedData?: IUser;
  authUserRole: USER_ROLE;
  onSubmitData: (data: IUserForm) => void;
};

export const UserForm: React.FC<UserFormProps> = ({
  fetchedData,
  authUserRole,
  onSubmitData,
}) => {
  const t = useTranslations();

  const formDefaultValues = {
    user_name: "",
    email: "",
    first_name: "",
    last_name: "",
    role: USER_ROLE.player,
    bio: null,
  };

  const methods = useForm<IUserForm>({
    defaultValues: fetchedData || formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(userFormSchema(t)),
  });
  const { handleSubmit } = methods;

  const roleOptions = [
    {
      label: (
        <Box className="flex items-center gap-1">
          <SportsSoccerIcon color="action" fontSize="small" />
          {t("players.role.player")}
        </Box>
      ),
      value: USER_ROLE.player,
    },
    {
      label: (
        <Box className="flex items-center gap-1">
          <ShieldIcon color="warning" fontSize="small" />
          {t("players.role.moderator")}
        </Box>
      ),
      value: USER_ROLE.moderator,
    },
  ];

  const onSubmit = (formData: IUserForm) => {
    onSubmitData(formData);
  };

  return (
    <FormProvider {...methods}>
      <form
        id="player_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container maxWidth="sm" disableGutters>
          <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
            <Grid size={1}>
              <TextField
                name="user_name"
                label={t("players.form.user_name")}
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <TextField
                name="email"
                label={t("players.form.email")}
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <TextField
                name="first_name"
                label={t("players.form.first_name")}
                fullWidth
              />
            </Grid>
            <Grid size={1}>
              <TextField
                name="last_name"
                label={t("players.form.last_name")}
                fullWidth
              />
            </Grid>
            {authUserRole === USER_ROLE.admin && (
              <Grid size={2}>
                <SelectField
                  name="role"
                  label={t("players.form.role")}
                  options={roleOptions}
                  fullWidth
                />
              </Grid>
            )}
            <Grid size={2}>
              <MarkdownEditor name="bio" label={t("players.form.bio")} />
            </Grid>
          </Grid>
        </Container>
      </form>
    </FormProvider>
  );
};
