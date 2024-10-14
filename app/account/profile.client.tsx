"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Button, TextField } from "@mui/material";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const ProfileSettings = ({ user }: { user: any }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [updatingName, setUpdatingName] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [emailInfoMessage, setEmailInfoMessage] = useState("");

  const supabase = createClient();

  async function handleNameChange() {
    setUpdatingName(true);
    if (name === "") {
      setNameError("O nome não pode estar vazio");
      setUpdatingName(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        name,
      },
    });

    if (error) {
      setNameError(error.message);
      setUpdatingName(false);
      return;
    }

    setNameError("");
    setUpdatingName(false);
    toast.success("Nome atualizado com sucesso");
  }

  async function handleEmailChange() {
    setUpdatingEmail(true);
    if (email === "") {
      setEmailError("O email não pode estar vazio");
      setUpdatingEmail(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email,
    });

    if (error) {
      setEmailError(error.message);
      setUpdatingEmail(false);
      return;
    }

    setEmailError("");
    setEmailInfoMessage("Segue as instruções no email anterior e no novo email para confirmar a alteração.");
    setUpdatingEmail(false);
  }

  return (
    <>
      {/* Name Change */}
      <Card id="profile">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Atualiza as tua informações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {nameError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{nameError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <TextField
                id="name"
                label="Name"
                placeholder={user.user_metadata.name}
                value={name}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6">
          <Button variant="contained" onClick={handleNameChange} disabled={updatingName}>
            {updatingName ? <Spinner /> : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
      {/* Email Change */}
      <Card id="email">
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>Atualiza o teu email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {emailError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{emailError}</AlertDescription>
              </Alert>
            )}
            {emailInfoMessage && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>{emailInfoMessage}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <TextField
                id="email"
                label="Email"
                placeholder={user.email}
                value={email}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-6">
          <Button variant="contained" onClick={handleEmailChange} disabled={updatingEmail}>
            {updatingEmail ? <Spinner /> : "Guardar"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
