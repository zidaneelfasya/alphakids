"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote?: string;
  name?: string;
  designation?: string;
  src: string;
};

export interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  autoplayInterval?: number; // Interval in milliseconds, default 3000ms (3 detik)
  compact?: boolean; // Compact mode for Hero / Card placement
  className?: string;
  imageClassName?: string;
  showControls?: boolean;
}

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
  autoplayInterval = 3000,
  compact = false,
  className,
  imageClassName,
  showControls = false,
}: AnimatedTestimonialsProps) => {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const isActive = (index: number) => {
    return index === active;
  };

  // Autoplay effect with customizable interval (default: 3000ms)
  useEffect(() => {
    if (!autoplay || isHovered || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, isHovered, handleNext, active, testimonials.length]);

  // Deterministic rotations to avoid SSR hydration mismatch
  const getRotation = (index: number) => {
    const rotations = [-6, 6, -3, 5, -5];
    return rotations[index % rotations.length];
  };

  // Compact Mode: Specially crafted for Hero placement with layered card stack and micro controls
  if (compact) {
    return (
      <div
        className={cn("relative flex flex-col items-center select-none", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Card Stack Container */}
        <div className="relative w-36 h-40 sm:w-44 sm:h-48 md:w-48 md:h-52">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: getRotation(index),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.75,
                  scale: isActive(index) ? 1 : 0.92,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : getRotation(index),
                  zIndex: isActive(index)
                    ? 40
                    : testimonials.length + 2 - index,
                  y: isActive(index) ? [0, -35, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: getRotation(index),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom cursor-pointer"
                onClick={handleNext}
              >
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden ">
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name || `Alpha Kids ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 176px, 208px"
                    draggable={false}
                    className={cn(
                      "h-full w-full object-cover object-center",
                      imageClassName
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Compact Navigation Controls (Pill & Dots) */}
        {showControls && testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-3.5 z-30">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Gambar sebelumnya"
              className="group/btn flex size-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-700 hover:bg-[#21b1db] hover:text-white text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              <IconArrowLeft className="size-3.5 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>

            {/* Micro dot indicators */}
            <div className="flex items-center gap-1 px-1">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active
                      ? "w-4 bg-[#21b1db]"
                      : "w-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Gambar selanjutnya"
              className="group/btn flex size-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200/80 dark:border-slate-700 hover:bg-[#21b1db] hover:text-white text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            >
              <IconArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Full 2-Column Testimonials Layout
  return (
    <div
      className={cn(
        "mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: getRotation(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : getRotation(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: getRotation(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-xl">
                    <Image
                      src={testimonial.src}
                      alt={testimonial.name || "Testimonial"}
                      fill
                      draggable={false}
                      className={cn(
                        "object-cover object-center",
                        imageClassName
                      )}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            {testimonials[active]?.name && (
              <h3 className="text-2xl font-bold text-black dark:text-white">
                {testimonials[active].name}
              </h3>
            )}
            {testimonials[active]?.designation && (
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                {testimonials[active].designation}
              </p>
            )}
            {testimonials[active]?.quote && (
              <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            )}
          </motion.div>
          {showControls && (
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                type="button"
                onClick={handlePrev}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              >
                <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
              >
                <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
