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
