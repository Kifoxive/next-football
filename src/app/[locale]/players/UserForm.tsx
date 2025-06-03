"use client";

import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { USER_ROLE } from "@/store/auth";
import { SelectField, TextField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, IUserForm, IUser } from "@/app/[locale]/players/types";

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
  };

  const methods = useForm<IUserForm>({
    defaultValues: fetchedData || formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(userFormSchema(t)),
  });
  const { handleSubmit } = methods;

  const roleOptions = [
    { label: t("players.role.player"), value: USER_ROLE.player },
    { label: t("players.role.moderator"), value: USER_ROLE.moderator },
  ];

  const onSubmit = async (formData: IUserForm) => {
    onSubmitData(formData);
  };

  return (
    <FormProvider {...methods}>
      <form
        id="player_form"
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Container maxWidth="sm" sx={{ padding: "0" }}>
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
          </Grid>
        </Container>
      </form>
    </FormProvider>
  );
};
