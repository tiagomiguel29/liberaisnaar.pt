import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import { TextField } from "@mui/material";

export const metadata: Metadata = {
  title: "Liberais na AR | Sign up",
};

export default async function Signup({
  searchParams,
}: {
  searchParams: Message;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const mfaCheck = await supabase.rpc("check_mfa");

    if (!mfaCheck.error && mfaCheck.data) {
      return redirect("/account");
    }
  }

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <form className="flex flex-col mx-auto">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Já tens conta?{" "}
            <Link
              className="text-primary font-medium underline"
              href="/sign-in"
            >
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 [&>input]:mb-3">
            <TextField name="name" label="Name" required variant="outlined" />
            <TextField name="email" label="Email" required variant="outlined" />
            <TextField
              name="password"
              label="Password"
              type="password"
              required
              variant="outlined"
            />
            <SubmitButton formAction={signUpAction} pendingText="A submeter...">
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
