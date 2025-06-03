import { AuthInitializer } from "@/components/AuthInitializer";

// import { IUser } from "@/store/auth";
import { ReactNode } from "react";
// import { redirect, usePathname } from "next/navigation";

import { getMe } from "@/app/[locale]/login/actions";

export default async function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // get supabase user
  const { user } = await getMe();

  return (
    <>
      <AuthInitializer id={user?.id} />
      {children}
    </>
  );
}
