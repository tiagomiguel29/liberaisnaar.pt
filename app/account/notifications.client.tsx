"use client"
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

import { Tables } from "@/types/database.types"
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

type NotificationSettings = Tables<"notification_settings">

export const NotificationSettings = ({notificationSettings} : {notificationSettings: NotificationSettings}) => {
    const supabase = createClient();

    const [settings, setSettings] = useState<NotificationSettings>(notificationSettings)

    async function saveSettings() {
        const { error } = await supabase.from("notification_settings").upsert(settings).eq("user_id", settings.user_id).single();
        if (error) {
            console.error(error);

            // TODO: Show error message
        }

        // TODO: Show success message
    }


    return (
        <Card id="notifications">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Gere as tuas notificações.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="new-initiatives" checked={settings.new_initiatives} onCheckedChange={() => setSettings({...settings, new_initiatives: !settings.new_initiatives})} />
              <label
                htmlFor="new-initiatives"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Novas Iniciativas
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="followed-initiatives" checked={settings.followed_initiatives} onCheckedChange={() => setSettings({...settings, followed_initiatives: !settings.followed_initiatives})} />
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
          <Button onClick={saveSettings}>Guardar</Button>
        </CardFooter>
      </Card> 
    )
}