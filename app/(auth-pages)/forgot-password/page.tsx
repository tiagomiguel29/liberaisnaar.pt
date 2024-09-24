import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/server";
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
    return redirect("/protected");
  }

  return (
    <Card>
      <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6  mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 [&>input]:mb-3 min-w-64 max-w-64">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
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
