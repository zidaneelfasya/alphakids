import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 p-1 border border-primary/30">
                <Image
                  src="/assets/img/Simbol Piala AlphaKids_revisi0.png"
                  alt="Alpha Kids Logo"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-foreground flex items-center gap-1">
                Alpha Kids
                <Sparkles className="size-4 text-primary fill-primary" />
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Platform komersial dan akses program edukasi digital terpercaya untuk anak. Menumbuhkan potensi, prestasi, dan semangat belajar generasi emas.
            </p>
          </div>

          {/* Nav Col */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Program Kami
            </span>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/programs" className="hover:text-primary transition-colors">
                Bimbingan OSN
              </Link>
              <Link href="/programs" className="hover:text-primary transition-colors">
                Kelas Intensif
              </Link>
              <Link href="/programs" className="hover:text-primary transition-colors">
                Webinar Edukasi
              </Link>
              <Link href="/programs" className="hover:text-primary transition-colors">
                Semua Program
              </Link>
            </div>
          </div>

          {/* Legal / Contact Col */}
          <div className="flex flex-col gap-3">
            <span className="font-heading font-bold text-sm text-foreground uppercase tracking-wider">
              Bantuan & Kontak
            </span>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/#faq" className="hover:text-primary transition-colors">
                Tanya Jawab (FAQ)
              </Link>
              <Link href="/auth/login" className="hover:text-primary transition-colors">
                Masuk ke Akun
              </Link>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                Instagram Alpha Kids
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Alpha Kids. Hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan <Heart className="size-3.5 text-accent-pink fill-accent-pink" /> untuk pendidikan anak Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}
