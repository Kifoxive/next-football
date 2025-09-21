import AuthProvider from "@/components/AuthProvider";
import ClientLayoutSwitcher from "./ClientLayoutSwitcher";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider isAuthenticatedLayout={true}>
      <ClientLayoutSwitcher>{children}</ClientLayoutSwitcher>
    </AuthProvider>
  );
}
