import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LayoutDashboard, LogIn, Sparkles } from "lucide-react";

export async function SiteNavbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 p-1 border border-primary/30 transition-transform group-hover:scale-105">
            <Image
              src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
              alt="Alpha Kids Logo"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1">
              Alpha Kids
              <Sparkles className="size-3 text-primary fill-primary" />
            </span>
            <span className="text-[10px] text-muted-foreground font-medium -mt-1 tracking-wider uppercase">
              Program Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Beranda
          </Link>
          <Link href="/programs" className="transition-colors hover:text-foreground">
            Katalog Program
          </Link>
          <Link href="/#keunggulan" className="transition-colors hover:text-foreground">
            Keunggulan
          </Link>
          <Link href="/#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons & Theme */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          {user ? (
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl gap-1.5 shadow-sm">
              <Link href="/dashboard">
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="font-medium hover:bg-accent">
                <Link href="/auth/login" className="flex items-center gap-1.5">
                  <LogIn className="size-4" />
                  <span>Masuk</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-sm hidden sm:inline-flex">
                <Link href="/auth/sign-up">
                  Daftar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
