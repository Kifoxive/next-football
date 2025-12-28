import {
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  Container,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
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
import { config } from "@/config";

export const emailSignUpFormSchema = (tValidation: TFunction) =>
  z
    .object({
      email: z.string().email(tValidation("emailFormat")),
      password: z
        .string()
        .min(8, tValidation("passwordLength", { minLength: 8 })),
      confirmPassword: z
        .string()
        .min(8, tValidation("passwordLength", { minLength: 8 })),
      agreePrivacy: z.boolean().refine((val) => val === true, {
        message: tValidation("privacyPolicyRequired"),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tValidation("passwordsMismatch"),
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
    agreePrivacy: false,
  };

  const methods = useForm<IEmailSignUpForm>({
    defaultValues: formDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(emailSignUpFormSchema(tValidation)),
  });
  const { handleSubmit, watch } = methods;

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
                <FormControlLabel
                  control={
                    <Checkbox
                      {...methods.register("agreePrivacy")}
                      size="small"
                    />
                  }
                  label={
                    <Box
                      component="span"
                      sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                    >
                      <span>{t("agreeTerms")}</span>
                      <Link
                        href={config.routes.privacyPolicy}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="always"
                      >
                        {t("privacyPolicy")}
                      </Link>
                    </Box>
                  }
                  sx={{ ml: -1 }}
                />
              </Grid>

              <Grid size={1}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isLoginPending || !watch("agreePrivacy")}
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

        <SignUpGoogleButton
          token={token}
          disabled={isLoginPending || !watch("agreePrivacy")}
        />
      </Box>
    </Container>
  );
};
