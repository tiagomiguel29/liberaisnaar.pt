"use client";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import toast from "react-hot-toast";

type UserPreferences = Tables<"user_preferences">;

export const NotificationSettings = ({
  notificationSettings,
}: {
  notificationSettings: UserPreferences;
}) => {
  const supabase = createClient();

  const [settings, setSettings] =
    useState<UserPreferences>(notificationSettings);

  const [loading, setLoading] = useState(false);

  async function saveSettingsReq() {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      const { error } = await supabase
        .from("user_preferences")
        .update({
          followed_initiatives_notify: settings.followed_initiatives_notify,
          new_initiatives_notify: settings.new_initiatives_notify,
        })
        .eq("user_id", settings.user_id)
        .single();
      if (error) {
        console.error(error);
        reject(new Error("Error saving settings."));
      } else {
        resolve(true);
      }
      setLoading(false);
    });
  }

  async function saveSettings() {
    toast.promise(saveSettingsReq(), {
      loading: "A guardar...",
      success: "Definições atualizadas.",
      error: "Erro ao guardar definições.",
    });
  }

  return (
    <Card id="notifications">
      <CardHeader>
        <CardTitle>Notificações</CardTitle>
        <CardDescription>Gere as tuas notificações.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="new-initiatives"
              checked={settings.new_initiatives_notify}
              onCheckedChange={() =>
                setSettings({
                  ...settings,
                  new_initiatives_notify: !settings.new_initiatives_notify,
                })
              }
            />
            <label
              htmlFor="new-initiatives"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Novas Iniciativas
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followed-initiatives"
              checked={settings.followed_initiatives_notify}
              onCheckedChange={() =>
                setSettings({
                  ...settings,
                  followed_initiatives_notify:
                    !settings.followed_initiatives_notify,
                })
              }
            />
            <label
              htmlFor="followed-initiatives"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Iniciativas Guardadas
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? <Spinner /> : "Guardar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
