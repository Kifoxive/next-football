import { Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { loginUser } from "@/app/[locale]/(anonymous)/login/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { GoogleLogo } from "./icons";
import { useTransition } from "react";

export const LoginGoogleButton = () => {
  const t = useTranslations("login");

  const router = useRouter();
  const [isLoginPending, startLoginTransition] = useTransition();

  const onLogin = () => {
    startLoginTransition(() => {
      // toast.promise(
      loginUser("google").then(({ errorMessage, url }) => {
        if (!errorMessage && url) {
          router.push(url);
        } else {
          toast.error(errorMessage);
        }
      });
      // {
      //   loading: t("loading"),
      //   success: t("success"),
      //   error: t("error"),
      // }
      // );
    });
  };

  return (
    <Button
      onClick={onLogin}
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
