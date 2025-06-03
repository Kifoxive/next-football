import { Typography, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useTranslations } from "next-intl";
import { loginUser } from "@/app/[locale]/login/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const LoginButton = () => {
  const t = useTranslations("login");
  const router = useRouter();

  const onLogin = async () => {
    const { errorMessage, url } = await loginUser("google");
    if (!errorMessage && url) {
      router.push(url);
    } else {
      toast.error(errorMessage);
    }
  };

  return (
    <Button
      onClick={onLogin}
      variant="contained"
      // className="border-1 border-white rounded-md"
    >
      <GoogleIcon className="mr-2 text-white" />
      <Typography variant="subtitle1" className="normal-case text-white">
        {t("google")}
      </Typography>
    </Button>
  );
};
