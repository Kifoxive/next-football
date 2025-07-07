import { redirect } from "next/navigation";
import { getMe } from "../login/actions";

import { config } from "@/config";

export default async function AnonymousLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getMe();
  if (user) redirect(config.routes.home);

  return children;
}
