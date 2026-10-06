"use client";

import Image from "next/image";
import Link from "next/link";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export interface ProgramCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  thumbnailUrl: string | null;
  categoryName?: string;
  startAt: string | null;
  endAt: string | null;
}

export function ProgramCard({
  name,
  slug,
  description,
  price,
  thumbnailUrl,
  categoryName,
  startAt,
  endAt,
}: ProgramCardProps) {
  const fallbackImage = "/assets/img/Konten Piramida AlphaKids_revisi0.png";

  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-accent/30">
        <Image
          src={thumbnailUrl || fallbackImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {categoryName && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-primary/95 text-primary-foreground font-semibold px-2.5 py-0.5 shadow-sm">
              {categoryName}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        {/* Period */}
        {(startAt || endAt) && (
          <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Calendar className="size-3.5 text-primary shrink-0" />
            <span>
              {formatDateIndo(startAt)} {endAt ? `– ${formatDateIndo(endAt)}` : ""}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold font-heading tracking-tight text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
          {description}
        </p>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
          <div>
            <span className="text-xs text-muted-foreground block font-medium">Investasi Belajar</span>
            <span className="text-xl font-bold font-heading text-foreground">
              {price === 0 ? "Gratis" : formatRupiah(price)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl group/btn gap-1.5">
          <Link href={`/programs/${slug}`}>
            <span>Lihat Detail Program</span>
            <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
