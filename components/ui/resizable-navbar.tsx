"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// Spring transition settings for smooth morphing dropdown
const springTransition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 15,
  stiffness: 120,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// ============================================================================
// 1. NAVBAR SCROLL CONTEXT & CONTAINER
// ============================================================================
const NavbarContext = React.createContext<{ visible: boolean }>({ visible: false });

export const useNavbar = () => React.useContext(NavbarContext);

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <NavbarContext.Provider value={{ visible }}>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 pointer-events-none",
          className
        )}
      >
        <div className="w-full pointer-events-auto">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(
                  child as React.ReactElement<{ visible?: boolean }>,
                  { visible }
                )
              : child
          )}
        </div>
      </header>
    </NavbarContext.Provider>
  );
};

// ============================================================================
// 2. NAV BODY (RESIZABLE FLOATING PILL CONTAINER ON SCROLL)
// ============================================================================
interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export const NavBody = ({ children, className, visible: propVisible }: NavBodyProps) => {
  const context = useNavbar();
  const visible = propVisible !== undefined ? propVisible : context.visible;

  // Split children into Left, Center, Right slots if 3 children are provided
  // This guarantees the Center Menu is mathematically centered at all times
  // and will NEVER shift when the logo text appears or disappears.
  const childArray = React.Children.toArray(children);
  const hasThreeSlots = childArray.length === 3;

  return (
    <motion.div
      initial={{
        width: "92%",
        maxWidth: "1200px",
        y: 14,
        borderRadius: "9999px",
      }}
      animate={{
        width: visible ? "86%" : "92%",
        maxWidth: visible ? "880px" : "1200px",
        y: visible ? 10 : 14,
        borderRadius: "9999px",
        paddingTop: visible ? "8px" : "11px",
        paddingBottom: visible ? "8px" : "11px",
        paddingLeft: visible ? "20px" : "24px",
        paddingRight: visible ? "20px" : "24px",
        borderWidth: "1px",
        borderColor: visible ? "rgba(153, 106, 172, 0.25)" : "rgba(237, 228, 242, 0.9)",
        boxShadow: visible
          ? "0 20px 40px -15px rgba(153, 106, 172, 0.18), 0 0 0 1px rgba(153, 106, 172, 0.12)"
          : "0 10px 30px -10px rgba(153, 106, 172, 0.1), 0 0 0 1px rgba(237, 228, 242, 0.8)",
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 40,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden lg:flex flex-row items-center justify-between rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-visible transition-colors duration-200 border border-[#EDE4F2]/80",
        className
      )}
    >
      {hasThreeSlots ? (
        <>
          <div className="flex-1 flex items-center justify-start min-w-0">
            {childArray[0]}
          </div>
          <div className="flex-none flex items-center justify-center">
            {childArray[1]}
          </div>
          <div className="flex-1 flex items-center justify-end min-w-0">
            {childArray[2]}
          </div>
        </>
      ) : (
        children
      )}
    </motion.div>
  );
};

// ============================================================================
// 3. HOVER DROPDOWN MENU SYSTEM (FUSED FROM NAVBAR-MENU)
// ============================================================================
export const NavMenu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative flex items-center justify-center space-x-1 sm:space-x-2 overflow-visible",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const NavMenuItem = ({
  setActive,
  active,
  item,
  href,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  href?: string;
  children?: React.ReactNode;
}) => {
  const isItemActive = active === item;

  const triggerSpan = (
    <motion.span
      transition={{ duration: 0.2 }}
      className={cn(
        "px-3.5 xl:px-4 py-2 rounded-full text-xs xl:text-sm font-semibold tracking-tight transition-all duration-200 inline-block",
        isItemActive
          ? "bg-[#E8F8FA] text-[#21b1db] shadow-sm"
          : "text-slate-700 dark:text-slate-200 hover:text-[#21b1db] hover:bg-[#21b1db]/5"
      )}
    >
      {item}
    </motion.span>
  );

  return (
    <div
      onMouseEnter={() => setActive(item)}
      className="relative cursor-pointer py-1.5"
    >
      {href ? (
        <Link href={href} className="focus:outline-none">
          {triggerSpan}
        </Link>
      ) : (
        triggerSpan
      )}

      {/* Floating Animated Morphing Dropdown Popover */}
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 8 }}
          transition={springTransition}
        >
          {isItemActive && children && (
            <div className="absolute top-[calc(100%_+_0.75rem)] left-1/2 transform -translate-x-1/2 z-[70] pt-2">
              <motion.div
                transition={springTransition}
                layoutId="active-dropdown"
                className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-[#E8F8FA] dark:border-slate-800 shadow-2xl shadow-cyan-950/10"
              >
                <motion.div layout className="w-max h-full p-5">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// 4. DROPDOWN SUB-COMPONENTS (HOVERED LINK & PRODUCT ITEM SHOWCASE)
// ============================================================================
export const NavHoveredLink = ({
  href,
  children,
  badge,
  description,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  badge?: string;
  description?: string;
  className?: string;
} & React.ComponentPropsWithoutRef<typeof Link>) => {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col py-1.5 px-2.5 rounded-xl hover:bg-[#E8F8FA]/60 dark:hover:bg-slate-800/60 transition-all duration-200",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-[#21b1db] transition-colors flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#21b1db] opacity-0 group-hover:opacity-100 transition-opacity" />
          {children}
        </span>
        {badge && (
          <span className="px-2 py-0.5 rounded-full bg-[#FFCC07] text-amber-950 text-[10px] font-semibold shadow-xs">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <span className="text-[11px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 pl-3 leading-tight mt-0.5 line-clamp-1">
          {description}
        </span>
      )}
    </Link>
  );
};

export const NavProductItem = ({
  title,
  description,
  href,
  src,
  badge,
  price,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  badge?: string;
  price?: string;
}) => {
  return (
    <Link
      href={href}
      className="group flex flex-col space-y-2 p-3 rounded-2xl bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 hover:border-[#21b1db]/40 hover:shadow-lg hover:shadow-[#21b1db]/10 transition-all duration-200 max-w-[200px]"
    >
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="200px"
        />
        {badge && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-full bg-[#FFCC07] text-amber-950 font-semibold text-[10px] shadow-sm">
              {badge}
            </span>
          </div>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#21b1db] transition-colors line-clamp-1">
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
          {description}
        </p>
        {price && (
          <span className="block mt-1.5 text-xs font-semibold text-[#ef599a]">
            {price}
          </span>
        )}
      </div>
    </Link>
  );
};

// ============================================================================
// 5. NAVBAR BRAND LOGO (ALPHA KIDS THEMED WITH ANIMATED SCROLL TEXT)
// ============================================================================
export const NavbarLogo = ({
  href = "/",
  className,
  visible: propVisible,
}: {
  href?: string;
  className?: string;
  visible?: boolean;
}) => {
  const context = useNavbar();
  const isScrolled = propVisible !== undefined ? propVisible : context.visible;

  return (
    <Link
      href={href}
      className={cn(
        "relative z-20 flex items-center gap-2 sm:gap-2.5 transition-transform hover:scale-105 shrink-0",
        className
      )}
    >
      <Image
        src="/assets/img/logo.png"
        alt="Alpha Kids Logo"
        width={36}
        height={36}
        className="h-8 sm:h-9 w-auto object-contain shrink-0"
        priority
      />

      <AnimatePresence initial={false}>
        {!isScrolled && (
          <motion.span
            initial={{ opacity: 0, width: 0, x: -6 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: -6 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="font-semibold text-sm sm:text-base tracking-tight whitespace-nowrap overflow-hidden inline-flex items-center gap-1 select-none"
          >
            <span className="text-slate-900 dark:text-white">Alpha</span>
            <span className="text-[#21b1db]">Kids</span>
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
};

// ============================================================================
// 6. NAVBAR BUTTON (ALPHA KIDS PILL STYLE)
// ============================================================================
export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 xl:px-5 py-2 rounded-full text-xs font-semibold relative cursor-pointer transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-95 text-center";

  const variantStyles = {
    primary:
      "bg-[#21b1db] hover:bg-[#1ca0c7] text-white shadow-md shadow-[#21b1db]/20",
    secondary:
      "bg-[#E8F8FA] hover:bg-[#d6f2f8] text-[#21b1db] border border-[#21b1db]/30 shadow-xs",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#21b1db] hover:text-[#21b1db] hover:bg-[#21b1db]/5",
    ghost:
      "bg-transparent text-slate-700 dark:text-slate-200 hover:text-[#21b1db] hover:bg-[#E8F8FA]/50",
  };

  if (href && Tag === "a") {
    return (
      <Link
        href={href}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Tag
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

// ============================================================================
// 7. RESPONSIVE MOBILE NAVIGATION DRAWER
// ============================================================================
interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export const MobileNav = ({ children, className, visible: propVisible }: MobileNavProps) => {
  const context = useNavbar();
  const visible = propVisible !== undefined ? propVisible : context.visible;

  return (
    <motion.div
      initial={{
        width: "92%",
        y: 12,
        borderRadius: "1.5rem",
      }}
      animate={{
        width: "92%",
        y: visible ? 8 : 12,
        borderRadius: "1.5rem",
        paddingTop: visible ? "8px" : "12px",
        paddingBottom: visible ? "8px" : "12px",
        paddingLeft: "16px",
        paddingRight: "16px",
        borderWidth: "1px",
        borderColor: visible ? "rgba(33, 177, 219, 0.25)" : "rgba(232, 248, 250, 0.9)",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(33, 177, 219, 0.15)"
          : "0 6px 20px -6px rgba(33, 177, 219, 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 40,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-[92%] flex-col items-center justify-between rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md lg:hidden border border-[#E8F8FA]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle navigation menu"
      className="size-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#21b1db] transition-colors"
    >
      {isOpen ? <IconX className="size-5" /> : <IconMenu2 className="size-5" />}
    </button>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn(
            "w-full flex flex-col items-start justify-start gap-4 pt-4 pb-2 border-t border-slate-100 dark:border-slate-800 mt-3",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
