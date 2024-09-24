import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NotificationSettings } from "./notifications.client";
import { Tables } from "@/types/database.types";
import { SecuritySettings } from "./security.client";
import { ProfileSettings } from "./profile.client";

type UserPreferences = Tables<"user_preferences">;


export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single();

  if (error) {
    console.error(error);
    return null;
  }

  const notificationsSettings: UserPreferences = data;

  return (
    <>
      <div className="flex flex-col w-full min-h-screen">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 rounded-lg shadow-sm">
          <div className="max-w-6xl w-full mx-auto grid gap-2">
            <h1 className="font-semibold text-3xl">Definições</h1>
          </div>
          <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
            
            <nav className="text-sm text-muted-foreground grid gap-4">
              <Link
                href="/account#profile"
                className="font-semibold text-primary"
                prefetch={false}
              >
                Perfil
              </Link>
              <Link href="/account#security" prefetch={false}>
                Segurança
              </Link>
              <Link href="/account#notifications" prefetch={false}>
                Notificações
              </Link>
            </nav>
            <div className="grid gap-6">
              <ProfileSettings user={user} />
              <SecuritySettings />
              <NotificationSettings notificationSettings={notificationsSettings} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function FrameIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  );
}
