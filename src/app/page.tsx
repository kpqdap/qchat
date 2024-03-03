import { LogIn } from "@/components/login/login";
import { userSession } from "@/features/auth/helpers";
import { Card } from "@/features/ui/card";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {

  const user = await userSession();
  if (user) {
    redirect("/chat");
  }
  return (
    <Card className="h-full flex-1 overflow-hidden relative items-center justify-center flex">
      <LogIn />
    </Card>
  );
};
