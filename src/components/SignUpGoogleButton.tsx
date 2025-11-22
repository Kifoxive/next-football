import { Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { GoogleLogo } from "./icons";
import { useTransition } from "react";

import { activateUser } from "@/app/[locale]/(anonymous)/login/actions";

type SignUpGoogleButtonProps = {
  token: string;
};

export const SignUpGoogleButton: React.FC<SignUpGoogleButtonProps> = ({
  token,
}) => {
  const t = useTranslations("activate");

  const router = useRouter();
  const [isLoginPending, startLoginTransition] = useTransition();

  const onSignUp = () => {
    startLoginTransition(() => {
      toast.promise(
        activateUser("google", token).then(({ errorMessage, url }) => {
          if (!errorMessage && url) {
            router.push(url);
          } else {
            toast.error(errorMessage);
          }
        }),
        // axiosClient.post(config.endpoints.auth.activate, { token }),
        {
          loading: t("loading"),
          success: t("success"),
          error: t("error"),
        }
      );
    });
  };

  return (
    <Button
      onClick={onSignUp}
      loading={isLoginPending}
      disabled={isLoginPending}
      variant="outlined"
      color="inherit"
      fullWidth
    >
      <GoogleLogo className="mr-2" />
      <Typography variant="subtitle1" className="normal-case text-white">
        {t("google")}
      </Typography>
    </Button>
  );
};
