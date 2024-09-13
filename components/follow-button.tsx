"use client";

import { Follow } from "@/types/extended.types";
import { Button } from "./ui/button";
import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const FollowButton = ({
  initiativeId,
  followed,
  userId,
}: {
  initiativeId: number;
  userId: string;
  followed: Follow[];
}) => {
  const [isFollowing, setIsFollowing] = useState(
    followed.some((f) => f.initiative_id === initiativeId)
  );

  const follow = async () => {
    const { data, error } = await createClient()
      .from("followed_initiatives")
      .insert([
        {
          user_id: userId,
          initiative_id: initiativeId,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }
    setIsFollowing(true);
  };

  const unfollow = async () => {
    const { error } = await createClient()
      .from("followed_initiatives")
      .delete()
      .eq("user_id", userId)
      .eq("initiative_id", initiativeId);

    if (error) {
      console.error(error);
      return;
    }
    setIsFollowing(false);
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8"
        onClick={isFollowing ? unfollow : follow}
    >
      <BookmarkIcon
        className={`h-5 w-5 ${
          isFollowing ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
      <span className="sr-only">
        {isFollowing ? "Não seguir" : "Seguir"} inicitative
      </span>
    </Button>
  );
};
