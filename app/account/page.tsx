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
import { Checkbox } from "@/components/ui/checkbox";
import { NotificationSettings } from "./notifications.client";
import { Tables } from "@/types/database.types";

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
            <h1 className="font-semibold text-3xl">Account Settings</h1>
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
              <Card id="profile">
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>
                    Atualiza as tua informações
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        defaultValue={user.user_metadata.name}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        defaultValue={user.email}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button>Guardar</Button>
                </CardFooter>
              </Card>
              <Card id="security">
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Atualiza a segurança da tua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="current-password">Password Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">Nova Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirmar Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="two-factor" />
                      <label
                        htmlFor="two-factor"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Ativar 2FA
                      </label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button>Atualizar Segurança</Button>
                </CardFooter>
              </Card>
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
