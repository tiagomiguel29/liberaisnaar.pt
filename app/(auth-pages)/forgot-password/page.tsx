import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { TextField } from "@mui/material";
import { redirect } from "next/navigation";

export default async function ForgotPassword({
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

  return (
    <Card className="w-full">
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6  mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 [&>input]:mb-3">
            <TextField label="Email" type="email" name="email" required />
            <SubmitButton formAction={forgotPasswordAction}>
              Reset Password
            </SubmitButton>
            <div className="mt-2">
              <FormMessage message={searchParams} />
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
