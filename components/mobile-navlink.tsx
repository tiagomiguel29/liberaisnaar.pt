import Link from "next/link";
import { SheetClose } from "./ui/sheet";

export const MobileNavLink = ({ name, href }: { name: string; href: string }) => {
  return (
    <SheetClose asChild>
      <Link
        key={name}
        href={href}
        className="text-lg font-medium hover:text-gray-300 transition-colors"
        prefetch={false}
      >
        {name}
      </Link>
    </SheetClose>
  );
};
