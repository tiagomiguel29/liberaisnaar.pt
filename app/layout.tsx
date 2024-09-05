import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Liberais na AR",
  description: "Acompanha a atividade dos deputados liberais na Assembleia da República",
};

const navItems = [
  { name: "Home", href: "/" },
  { name: "Iniciativas", href: "/iniciativas" },
  { name: "Deputados", href: "/deputados" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
        
              <header className="bg-[#00558f] w-full text-white py-4 px-6 md:px-8 flex items-center justify-between">
                
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                
                  <span className="text-lg font-semibold">Liberais na AR</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium hover:text-gray-300 transition-colors"
                    prefetch={false}
                  >
                    {item.name}
                  </Link>
                ))  
                }
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </nav>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <MenuIcon className="h-6 w-6" />
                      <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="grid gap-4 py-6">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                        prefetch={false}
                      >
                    
                        <span>Liberais na AR</span>
                      </Link>
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-lg font-medium hover:text-gray-300 transition-colors"
                          prefetch={false}
                        >
                          {item.name}
                        </Link>
                      ))}
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    </div>
                  </SheetContent>
                </Sheet>
              </header>
              

              <div className="w-full p-5 flex flex-col items-center">
                {children}
              </div>

              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <p>
                  Developed by{" "}
                  <a
                    href="https://github.com/tiagomiguel29"
                    target="_blank"
                    className="font-bold hover:underline"
                    rel="noreferrer"
                  >
                    Tiago Oliveira
                  </a>
                </p>
                <ThemeSwitcher />
              </footer>
          
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

function MenuIcon(props: any) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

