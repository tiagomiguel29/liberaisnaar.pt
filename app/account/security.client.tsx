"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { use, useEffect, useState } from "react";

type Enroll2FA = {
  id: string;
  totp: {
    qr_code: string;
    secret: string;
    uri: string;
  };
  type: "totp";
  friendly_name: string | null;
};

export const SecuritySettings = () => {
  const [active2FA, setActive2FA] = useState(false);

  const [dialog2FAOpen, setDialog2FAOpen] = useState(false);

  const supabase = createClient();

  const [currentFactorId, setCurrentFactorId] = useState<string | null>(null);


  useEffect(() => {
    // Check if 2FA is enabled
    const check2FA = async () => {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) {
        console.error(error);
        return;
      }
      if (data.totp.length > 0) {
        setActive2FA(true);
        setCurrentFactorId(data.totp[0].id);
      }


    }

    check2FA();
  }, []);

  async function handleSwitch2FAToggle() {
    if (dialog2FAOpen) return;

    if (active2FA) {
      // TODO: Handle 2FA disable
      await supabase.auth.mfa.unenroll({
        factorId: currentFactorId!
      })

      // TODO: Toast notification
      setActive2FA(false);
      return;
    }

    setDialog2FAOpen(true);
  }

  return (
    <>
      <Card id="security">
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Atualiza a segurança da tua conta</CardDescription>
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
              <Switch
                id="two-factor"
                checked={active2FA}
                onCheckedChange={handleSwitch2FAToggle}
              />
              <label
                htmlFor="two-factor"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {active2FA ? "Desativar" : "Ativar"} 2FA
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6">
          <Button>Atualizar Segurança</Button>
        </CardFooter>
      </Card>
      <Setup2FA open={dialog2FAOpen} close={() => setDialog2FAOpen(false)} setActive2FA={setActive2FA} />
    </>
  );
};

const Setup2FA = ({ open, close, setActive2FA }: { open: boolean, close: () => void, setActive2FA: (active: boolean) => void }) => {
  const supabase = createClient();
  const [factorId, setFactorId] = useState('')
  const [qr, setQR] = useState('') // holds the QR code image SVG
  const [verifyCode, setVerifyCode] = useState('') // contains the code entered by the user
  const [error, setError] = useState('') // holds an error message

  const handleClose = () => {
    close()
  }

  const onEnableClicked = () => {

    setError('')
    ;(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error) {
        setError(challenge.error.message)
        throw challenge.error
      }

      const challengeId = challenge.data.id

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      })
      if (verify.error) {
        setError(verify.error.message)
        throw verify.error
      }

      setActive2FA(true)
      handleClose()
    })()
  }

  useEffect(() => {
    if (!open) return
    ;(async () => {
      const res = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })
      if (res.error) {
        throw error
      }

      const data: Enroll2FA = res.data as Enroll2FA

      setFactorId(data.id)

      // Supabase Auth returns an SVG QR code which you can convert into a data
      // URL that you can place in an <img> tag.
      setQR(data.totp.qr_code)
    })()
  }, [open])

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar 2FA</DialogTitle>
          <DialogDescription>
            Faz scan do QR code com a tua aplicação de autenticação e insere o
            código para ativar a autenticação de dois fatores.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-row justify-center items-center">
            {qr && (
              <img src={qr} />
            )}
          </div>
          <div className="flex flex-row justify-center items-center my-4">
            <InputOTP maxLength={6} value={verifyCode} onChange={setVerifyCode} >
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
        <DialogFooter>
          <div className="flex flex-row gap-x-2">
            <Button variant="destructive" onClick={handleClose}>Cancelar</Button>
            <Button variant="default" onClick={onEnableClicked}>Ativar 2FA</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
