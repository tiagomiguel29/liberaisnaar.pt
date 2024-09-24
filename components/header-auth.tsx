import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { SheetClose } from "./ui/sheet";

export async function HeaderAuth() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Button
              asChild
              size="sm"
              variant={"secondary"}
            >
      <Link
                  href="/account"
                  className="flex items-center gap-x-2"
                >
                  <UserIcon className="h-4 w-4" />
                  {user.user_metadata.name}
                </Link>
                </Button>
      <form action={signOutAction}>
        <Button type="submit" size="sm" variant={"destructive"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" className="w-full" variant={"secondary"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" className="w-full" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

export async function HeaderAuthMobile() {  
  const { data: { user } } = await createClient().auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Button
        asChild
        size="sm"
        variant={"secondary"}
      >
        <SheetClose asChild>
        <Link
          href="/account"
          className="flex items-center gap-x-2"
        >
          <UserIcon className="h-4 w-4" />
          {user.user_metadata.name}
        </Link>
        </SheetClose>
      </Button>
      <form action={signOutAction}>
        <SheetClose asChild>
        <Button type="submit" size="sm" variant={"destructive"}>
          Sign out
        </Button>
        </SheetClose>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" className="w-full" variant={"secondary"}>
        <SheetClose asChild>
        <Link href="/sign-in">Sign in</Link>
        </SheetClose>
      </Button>
      <Button asChild size="sm" className="w-full" variant={"default"}>
        <SheetClose asChild>
        <Link href="/sign-up">Sign up</Link>
        </SheetClose>
      </Button>
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
  )
}