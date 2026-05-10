import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
  size?: "default" | "large";
};

export function Logo({ className, compact = false, size = "default" }: LogoProps) {
  const isLarge = size === "large";
  const imageSize = isLarge ? 112 : compact ? 56 : 80;

  return (
    <div className={cn("flex items-center", isLarge ? "gap-5" : "gap-4", className)}>
      <Image
        src="/brand/after-check-in-logo.png"
        alt="After Check-in"
        width={imageSize}
        height={imageSize}
        className={cn(
          "rounded-md object-contain",
          isLarge ? "h-20 w-20 sm:h-28 sm:w-28" : "h-14 w-14 sm:h-16 sm:w-16"
        )}
        priority
      />
      <div className="leading-none">
        <p
          className={cn(
            "font-bold tracking-normal text-night-950",
            isLarge ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          After
        </p>
        <p
          className={cn(
            "font-bold tracking-normal text-night-950",
            isLarge ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          Check-in
        </p>
      </div>
    </div>
  );
}
