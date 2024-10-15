import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextField } from "@mui/material";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <div className="w-full sm:w-[550px] flex flex-col gap-12 items-center px-4 py-16">
      <Card className="w-full">
        <form className="flex flex-col mx-auto">
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 [&>input]:mb-3">
              <TextField
                type="password"
                name="password"
                label="New password"
                required
              />
              <TextField
                type="password"
                name="confirmPassword"
                label="Confirm password"
                required
              />
              <SubmitButton formAction={resetPasswordAction}>
                Reset password
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
