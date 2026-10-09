import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Ignite Wax logo badge — the client's actual artwork (sage circular badge
 * with the white candle glyph), rendered from their supplied logo file.
 * Circular-alpha PNG, so it sits cleanly on any background.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-sage",
        className,
      )}
      aria-hidden="true"
    >
      <Image
        src="/images/site/logo-emblem.png"
        alt=""
        fill
        sizes="(max-width: 640px) 40px, 48px"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  );
}

export function Logo({
  className,
  compact = false,
  tone = "dark",
  markClassName,
}: {
  className?: string;
  compact?: boolean;
  /** "dark" = ink text for light backgrounds; "light" = softwhite text for dark backgrounds (footer). */
  tone?: "dark" | "light";
  /** Extra classes for the circular mark, e.g. a ring when it sits on a matching sage background. */
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-10 w-10 shrink-0", markClassName)} />
      {!compact && (
        <span
          className={cn(
            "font-display text-[19px] font-bold tracking-tight",
            tone === "light" ? "text-softwhite" : "text-ink",
          )}
        >
          Ignite Wax
        </span>
      )}
    </span>
  );
}
