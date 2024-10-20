"use client";

import { FormMessage, Message } from "@/components/form-message";
import { Spinner } from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { createClient } from "@/utils/supabase/client";
import { errors } from "@/utils/supabase/errors";
import { Button, TextField } from "@mui/material";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // TODO: Replace `any` with user type
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

      const res = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (res.error) {
        setLoading(false);
        return;
      }

      if (user) {
        setIsAuthenticated(res.data.currentLevel === res.data.nextLevel);
      }
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
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

      if (data.nextLevel === "aal2" && data.nextLevel !== data.currentLevel) {
        setShowMFAScreen(true);
      } else {
        window.location.href = "/account";
      }
      setLoginLoading(false);

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
        <Card className="w-full">
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
              <div className="flex flex-col gap-4 [&>input]:mb-3">
                {loginError && (
                  <div className="mb-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  </div>
                )}
                <TextField
                  name="email"
                  label="Email"
                  required
                  variant="outlined"
                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  required
                />
                <div className="flex justify-between items-center">
                  <Link
                    className="text-xs text-foreground underline"
                    href="/forgot-password"
                  >
                    Esqueceste-te da password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loginLoading}
                >
                  {loginLoading ? <Spinner /> : "Login"}
                </Button>
                <FormMessage message={searchParams} />
              </div>
            </CardContent>
          </form>
        </Card>
      )}
      {showMFAScreen && readyToShow && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Autenicação de Dois Fatores</CardTitle>
            <CardDescription>
              Introduz o código de autenticação de dois fatores.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 [&>input]:mb-3">
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
                variant="contained"
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
