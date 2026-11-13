import type { Metadata } from "next";
import { Raleway, Poppins, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | Alpha Kids",
    default: "Alpha Kids — Platform Program Edukasi Digital & Bimbingan Juara OSN",
  },
  description: "Platform komersial dan akses program edukasi digital anak terpercaya, bimbingan OSN, webinar, dan kelas intensif berkualitas.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: defaultUrl,
    siteName: "Alpha Kids",
    title: "Alpha Kids — Platform Program Edukasi Digital & Bimbingan Juara OSN",
    description: "Platform komersial dan akses program edukasi digital anak terpercaya, bimbingan OSN, webinar, dan kelas intensif berkualitas.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Alpha Kids — Bimbingan Juara OSN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Kids — Platform Program Edukasi Digital",
    description: "Platform komersial dan akses program edukasi digital anak terpercaya, bimbingan OSN, webinar, dan kelas intensif berkualitas.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const raleway = Raleway({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Alpha Kids",
    url: defaultUrl,
    logo: `${defaultUrl}/assets/img/logo.png`,
    description:
      "Platform komersial dan akses program edukasi digital anak terpercaya, bimbingan OSN, webinar, dan kelas intensif berkualitas.",
    sameAs: [
      "https://www.instagram.com/alphakids_education/",
      "https://www.tiktok.com/@alphakids_education",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Indonesian",
    },
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} ${raleway.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
