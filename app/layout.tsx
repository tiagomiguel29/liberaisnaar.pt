import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { HeaderAuth, HeaderAuthMobile } from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { MobileNavLink } from "@/components/mobile-navlink";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { NavLink } from "@/components/navlink";
import { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeContextProvider } from "./ThemeContext";

const defaultUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Liberais na AR",
  description:
    "Acompanha a atividade dos deputados liberais na Assembleia da República. Recebe notificações de novas iniciativas e sobre atualizações de iniciativas que segues.",
  openGraph: {
    siteName: "Liberais na AR",
    url: defaultUrl,
  },
};

const navItems = [
  { name: "Home", href: "/" },
  { name: "Iniciativas", href: "/iniciativas" },
  { name: "Votações", href: "/votacoes" },
  //{ name: "Deputados", href: "/deputados" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-T7C34HFP" />
      <body className="bg-muted/40 text-foreground">
        <AppRouterCacheProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeContextProvider>
              <Toaster position="top-right" />
              <main className="min-h-screen flex flex-col items-center">
                <header className="bg-primary w-full text-white px-6 md:px-8 flex gap-x-2 items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    prefetch={false}
                  >
                    <img
                      src="/images/logo.png"
                      alt="Liberais na AR"
                      width={360}
                      height={150}
                      className="py-2"
                    />
                  </Link>
                  <nav className="hidden lg:flex py-4 items-center gap-6">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.name}
                        name={item.name}
                        href={item.href}
                      />
                    ))}
                    <HeaderAuth />
                  </nav>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="lg:hidden"
                      >
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold bg-primary px-6 py-8"
                        prefetch={false}
                      >
                        <Image
                          src="/images/logo.png"
                          alt="Liberais na AR"
                          width={360}
                          height={150}
                          className="py-2"
                        />
                      </Link>
                      <div className="grid gap-4 p-6">
                        {navItems.map((item) => (
                          <MobileNavLink
                            key={item.name}
                            name={item.name}
                            href={item.href}
                          />
                        ))}
                        <HeaderAuthMobile />
                      </div>
                    </SheetContent>
                  </Sheet>
                </header>

                <div className="w-full flex flex-col items-center">
                  {children}
                </div>

                <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <div>
                    <Link
                      className="font-bold hover:underline"
                      href={process.env.NEXT_PUBLIC_STATUS_URL!}
                      target="_blank"
                      prefetch={false}
                    >
                      Status
                    </Link>
                  </div>
                  <div className="flex items-center justify-center gap-8">
                    <p>
                      Desenvolvido por{" "}
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
                  </div>
                  <div>
                    Dados obtidos através do{" "}
                    <a
                      href="https://www.parlamento.pt/Cidadania/Paginas/DadosAbertos.aspx"
                      target="_blank"
                      className="font-bold hover:underline"
                    >
                      Portal de Dados Abertos do Parlamento
                    </a>
                  </div>
                </footer>
              </main>
            </ThemeContextProvider>
          </ThemeProvider>

          <SpeedInsights />
          <Analytics />
        </AppRouterCacheProvider>
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
