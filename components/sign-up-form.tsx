"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getDicebearMoodsAvatar } from "@/lib/avatar";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: getDicebearMoodsAvatar(fullName || email),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setIsOAuthLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Gagal mendaftar dengan Google");
      setIsOAuthLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/20 p-2 border border-primary/30">
            <Image
              src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
              alt="Alpha Kids Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold font-heading flex items-center justify-center gap-1.5">
            Daftar Akun Baru
            <Sparkles className="size-4 text-primary fill-primary" />
          </CardTitle>
          <CardDescription>
            Bergabung dengan platform edukasi digital Alpha Kids
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-11 border-border font-medium hover:bg-accent"
              onClick={handleGoogleSignUp}
              disabled={isOAuthLoading || isLoading}
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              {isOAuthLoading ? "Menghubungkan..." : "Daftar dengan Google"}
            </Button>

            <div className="relative flex items-center justify-center text-xs">
              <span className="w-full border-t border-border" />
              <span className="bg-card px-3 text-muted-foreground uppercase tracking-wider font-medium">
                atau email
              </span>
              <span className="w-full border-t border-border" />
            </div>

            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama Peserta / Anak"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="repeat-password">Ulangi Kata Sandi</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Ketik ulang kata sandi"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-primary-foreground bg-primary hover:bg-primary/90 mt-2"
                disabled={isLoading || isOAuthLoading}
              >
                {isLoading ? "Mendaftarkan..." : "Daftar Akun"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Sudah memiliki akun?{" "}
              <Link href="/auth/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                Masuk
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
