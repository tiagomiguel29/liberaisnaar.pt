"use client";

import { Follow } from "@/types/extended.types";
import { Button } from "./ui/button";
import { BookmarkIcon } from "lucide-react";
import { use, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { resolve } from "path";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const supabase = createClient();
      const res = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (res.error) return;

      setIsAuthenticated(res.data.currentLevel === res.data.nextLevel);
      
    }
    getSession();
  }
  ,[]);

  if (!isAuthenticated) {
    return null;
  }


  const followReq = async () => {
    return new Promise(async (resolve, reject) => {
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
        reject(new Error("Error following inititative."));
      } else {
        setIsFollowing(true);
        resolve(true);
      }
    });
  };

  const unfollowReq = () => {
    return new Promise(async (resolve, reject) => {
      const { error } = await createClient()
        .from("followed_initiatives")
        .delete()
        .eq("user_id", userId)
        .eq("initiative_id", initiativeId);

      if (error) {
        console.error(error);
        reject(new Error("Error unfollowing inititative."));
      } else {
        setIsFollowing(false);
        resolve(true);
      }
    });
  };

  const unfollow = async () => {
    toast.promise(unfollowReq(), {
      loading: "A adicionar...",
      success: <b>Iniciative removida!</b>,
      error: <b>Erro ao remover iniciativa.</b>,
    });
  };

  const follow = async () => {
    toast.promise(followReq(), {
      loading: "A adicionar...",
      success: <b>Iniciativa adicionada!</b>,
      error: <b>Erro ao adicionar iniciativa.</b>,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
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
