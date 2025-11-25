import { Typography, Button, Grid, Box, Paper, Container } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTransition } from "react";

import { registerUserEmail } from "@/app/[locale]/(anonymous)/login/actions";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "./form";
import { SignUpGoogleButton } from "./SignUpGoogleButton";
import { TFunction } from "@/utils/types";

export const emailSignUpFormSchema = (t: TFunction) =>
  z
    .object({
      email: z.string().email(t("emailFormat")),
      password: z.string().min(8, t("passwordLength", { minLength: 8 })),
      confirmPassword: z.string().min(8, t("passwordLength", { minLength: 8 })),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsMismatch"),
      path: ["confirmPassword"],
    });

export type IEmailSignUpForm = z.infer<
  ReturnType<typeof emailSignUpFormSchema>
>;

type SignUpFormProps = {
  token: string;
  user_name?: string;
};

export const SignUpForm: React.FC<SignUpFormProps> = ({ token }) => {
  const t = useTranslations("signUp");
  const tValidation = useTranslations("validation");

  const router = useRouter();
  const [isLoginPending, startLoginTransition] = useTransition();

  const formDefaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm<IEmailSignUpForm>({
    defaultValues: formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(emailSignUpFormSchema(tValidation)),
  });
  const { handleSubmit } = methods;

  const onSignUp = (data: IEmailSignUpForm) => {
    startLoginTransition(() => {
      toast.promise(
        registerUserEmail(token, data).then(({ errorMessage }) => {
          if (!errorMessage) {
            router.push("/");
          } else {
            toast.error(errorMessage);
          }
        }),
        {
          loading: t("loading"),
          success: t("success"),
          error: t("error"),
        }
      );
    });
  };

  return (
    <Container
      component={Paper}
      className="w-full text-center py-4 border-[0.5px] border-gray-600 rounded-lg shadow-2xl"
      maxWidth="xs"
    >
      <Box className="flex flex-col items-center mb-6">
        <Typography variant="h5" fontWeight="bolder" component="h1">
          {t("title")}
        </Typography>
        <Typography variant="body2">{t("description")}</Typography>
      </Box>

      <Box className="flex flex-col gap-4 w-full">
        <FormProvider {...methods}>
          <form
            id="player_form"
            onSubmit={handleSubmit(onSignUp, (error) => console.log(error))}
          >
            <Grid container spacing={2} columns={1}>
              <Grid size={1}>
                <TextField
                  name="email"
                  label={t("email")}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={1}>
                <TextField
                  name="password"
                  label={t("password")}
                  fullWidth
                  type="password"
                  size="small"
                />
              </Grid>

              <Grid size={1}>
                <TextField
                  name="confirmPassword"
                  label={t("confirmPassword")}
                  fullWidth
                  type="password"
                  size="small"
                />
              </Grid>

              <Grid size={1}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoginPending}
                >
                  {t("signUp")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>

        <Box className="flex items-center my-2">
          <Box className="flex-grow border-t border-gray-700" />
          <Typography variant="body2" className=" text-gray-400 px-2">
            {t("or")}
          </Typography>
          <Box className="flex-grow border-t border-gray-700" />
        </Box>

        <SignUpGoogleButton token={token} />
      </Box>
    </Container>
  );
};
