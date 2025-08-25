import { redirect } from "next/navigation";
import { getMe } from "./login/actions";
import { config } from "@/config";

import { AnonymousLayoutWrapper } from "./AnonymousLayoutWrapper";
import AuthProvider from "@/components/AuthProvider";

export default async function AnonymousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnonymousLayoutWrapper>
      <AuthProvider isAuthenticatedLayout={false}>{children}</AuthProvider>
    </AnonymousLayoutWrapper>
  );
}
