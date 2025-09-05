import { AuthInitializer } from "@/components/AuthInitializer";
import { ReactNode } from "react";

import { getMe } from "@/app/[locale]/(anonymous)/login/actions";
import { redirect } from "next/navigation";
import { config } from "@/config";
import { SubscriptionInitializer } from "./SubscriptionInitializer";

export default async function AuthProvider({
  children,
  isAuthenticatedLayout,
}: {
  children: ReactNode;
  isAuthenticatedLayout: boolean;
}) {
  // get supabase user
  const { user } = await getMe();

  if (isAuthenticatedLayout && !user) redirect(config.routes.login);
  if (!isAuthenticatedLayout && user) redirect(config.routes.home);

  return (
    <>
      <AuthInitializer id={user?.id} />
      <SubscriptionInitializer />
      {children}
    </>
  );
}
