"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const defaultClasses = "text-sm font-medium hover:text-gray-300 transition-colors";
const activeClasses = "bg-white text-primary px-3 py-2 rounded-md";


export const NavLink = ({ name, href }: { name: string; href: string }) => {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== '/' && pathname.startsWith(href));

 
    return (
      <Link
        key={name}
        href={href}
        className={`${defaultClasses} ${active ? activeClasses : ""}`}
        prefetch={false}
      >
        {name}
      </Link>
    );
  


  
};
