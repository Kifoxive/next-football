"use client";

import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { loginUser } from "./actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTransition } from "react";

import { useTranslations } from "next-intl";
import { useDocumentTitle } from "@/hooks";

const providers = [
  { id: "github", name: "GitHub" },
  { id: "google", name: "Google" },
  // { id: 'facebook', name: 'Facebook' },
  // { id: 'twitter', name: 'Twitter' },
  // { id: 'linkedin', name: 'LinkedIn' },
];

export default function LoginPage() {
  const t = useTranslations();
  useDocumentTitle(t("login.title"));

  const router = useRouter();
  const [isLoginPending, startLoginTransition] = useTransition();

  //   const onLogin = async () => {
  //   const { errorMessage, url } = await loginUser("google");
  //   if (!errorMessage && url) {
  //     router.push(url);
  //   } else {
  //     toast.error(errorMessage);
  //   }
  // };

  const onLogin = () => {
    startLoginTransition(() => {
      toast.promise(
        loginUser("google").then(({ errorMessage, url }) => {
          if (!errorMessage && url) {
            router.push(url);
          } else {
            toast.error(errorMessage);
          }
        }),
        {
          loading: t("logout.loading"),
          success: t("logout.success"),
          error: t("logout.error"),
        }
      );
    });
  };

  return (
    <AppProvider>
      <SignInPage providers={providers} signIn={onLogin} />
    </AppProvider>
  );
}
