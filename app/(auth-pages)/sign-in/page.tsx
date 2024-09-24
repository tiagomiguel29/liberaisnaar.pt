"use client";

import { FormMessage, Message } from "@/components/form-message";
import { Spinner } from "@/components/spinner";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { errors } from "@/utils/supabase/errors";
import { set } from "date-fns";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Login({ searchParams }: { searchParams: Message }) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null); // TODO: Replace `any` with user type
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [readyToShow, setReadyToShow] = useState(false);
  const [showMFAScreen, setShowMFAScreen] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [MFAError, setMFAError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  if (loading) {
    return <Spinner />;
  }

  if (user) {
    window.location.href = "/account"; // Redirect to account page
    return null; // Prevent rendering the login form
  }

  const signInAction = async (event: any) => {
    setLoginLoading(true);
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginLoading(false);
      if (error.code) {
        setLoginError(
          errors[error.code] || "Ocorreu um erro. Por favor tenta novamente."
        );
      } else {
        setLoginError("Ocorreu um erro. Por favor tenta novamente.");
      }
    } else {
      getMFAStatus();
    }
  };

  const getMFAStatus = async () => {
    try {
      const { data, error } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) {
        setLoginError("Ocorreu um erro. Por favor tenta novamente.");
        return;
      }

      setLoginError("");

      setLoginLoading(false);
      if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
        setShowMFAScreen(true);
      } else {
        window.location.href = "/account";
      }
    } finally {
      setReadyToShow(true);
    }
    setLoginLoading(false);
  };

  const on2FASubmitClicked = (code = verifyCode) => {
    setLoginLoading(true);
    setMFAError("");
    (async () => {
      const factors = await supabase.auth.mfa.listFactors();
      if (factors.error) {
        setMFAError("Ocorreu um erro. Por favor tenta novamente.");
        setLoginLoading(false);
        return;
      }

      const totpFactor = factors.data.totp[0];

      if (!totpFactor) {
        setMFAError("Ocorreu um erro. Por favor tenta novamente.");
        setLoginLoading(false);
        return;
      }

      const factorId = totpFactor.id;

      const challenge = await supabase.auth.mfa.challenge({ factorId });
      if (challenge.error) {
        setMFAError("Ocorreu um erro. Por favor tenta novamente.");
        setLoginLoading(false);
        return;
      }

      const challengeId = challenge.data.id;

      console.log(code);
      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });
      if (verify.error) {
        if (verify.error.code) {
          setMFAError(
            errors[verify.error.code] ||
              "Ocorreu um erro. Por favor tenta novamente."
          );
        } else {
          setMFAError("Ocorreu um erro. Por favor tenta novamente.");
        }
        setLoginLoading(false);
        setVerifyCode("");
        return;
      }
      window.location.href = "/account";
    })();
  };

  function handleOTPChange(value: string) {
    setVerifyCode(value);

    console.log(value);
    if (value.length === 6) {
      on2FASubmitClicked(value);
    }
  }

  return (
    <>
      {!showMFAScreen && (
        <Card>
          <form
            className="flex-1 flex flex-col min-w-64"
            onSubmit={signInAction}
          >
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
                {loginError && (
                  <div className="mb-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  </div>
                )}
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
                <Button type="submit" disabled={loginLoading}>
                  {loginLoading ? <Spinner /> : "Login"}
                </Button>
                <FormMessage message={searchParams} />
              </div>
            </CardContent>
          </form>
        </Card>
      )}
      {showMFAScreen && readyToShow && (
        <Card>
          <CardHeader>
            <CardTitle>Autenicação de Dois Fatores</CardTitle>
            <CardDescription>
              Introduz o código de autenticação de dois fatores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-w-64 flex flex-col gap-2 [&>input]:mb-3">
              {MFAError && (
                <div className="mb-2">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{MFAError}</AlertDescription>
                  </Alert>
                </div>
              )}
              <div className="flex justify-center items-center">
                <InputOTP
                  maxLength={6}
                  value={verifyCode}
                  onChange={handleOTPChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center items-center">
              <Button
                onClick={() => on2FASubmitClicked()}
                disabled={loginLoading || verifyCode.length !== 6}
              >
                {loginLoading ? <Spinner /> : "Verificar"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
