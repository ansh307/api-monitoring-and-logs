import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  // Protect the route by checking if the user is signed in
  if (!userId) redirect("/sign-in");

  return <div>{children}</div>;
}
