import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { SheetClose } from "./ui/sheet";
import { redirect } from "next/navigation";
import { Button } from "@mui/material";

export async function HeaderAuth() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mfaCheck = await supabase.rpc("check_mfa");

  let isAuthenticated = false;

  if (!mfaCheck.error && mfaCheck.data) {
    isAuthenticated = true;
  }

  return user && isAuthenticated ? (
    <div className="flex items-center gap-4">
      <Link href="/account" className="flex items-center gap-x-2">
        <Button size="small" variant="contained" color="secondary" startIcon={<UserIcon />}>
          {user.user_metadata.name}
        </Button>
      </Link>
      <form action={signOutAction}>
        <Button type="submit" size="small" variant="contained" color="error">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Link href="/sign-in">
        <Button size="small" variant="contained" color="secondary">
          Sign in
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button size="small" variant="text" color="secondary">
          Sign up
        </Button>
      </Link>
    </div>
  );
}

export async function HeaderAuthMobile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mfaCheck = await supabase.rpc("check_mfa");

  let isAuthenticated = false;

  if (!mfaCheck.error && mfaCheck.data) {
    isAuthenticated = true;
  }

  return user && isAuthenticated ? (
    <div className="flex items-center gap-4">
      <SheetClose asChild>
        <Link href="/account" className="flex items-center gap-x-2">
          <Button size="small" variant="outlined" startIcon={<UserIcon />}>
            {user.user_metadata.name}
          </Button>
        </Link>
      </SheetClose>
      <form action={signOutAction}>
        <SheetClose asChild>
          <Button type="submit" size="small" variant="contained" color="error">
            Sign out
          </Button>
        </SheetClose>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <SheetClose asChild>
        <Link href="/sign-in">
          <Button size="small" className="w-full" variant="contained">
            Sign in
          </Button>
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link href="/sign-up">
          <Button size="small" className="w-full" variant="text">
            Sign up
          </Button>
        </Link>
      </SheetClose>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
