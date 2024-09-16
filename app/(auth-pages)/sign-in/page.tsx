import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams: Message;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/account");
  }

  return (
    <Card>
      <form className="flex-1 flex flex-col min-w-64">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
          <CardDescription>
          Ainda não tens conta?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-up"
            >
              Regista-te
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="min-w-64 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Esqueceste-te da password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
        </CardContent>
      </form>
    </Card>
  );
}