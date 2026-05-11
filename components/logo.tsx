import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
  size?: "default" | "large";
};

export function Logo({ className, compact = false, size = "default" }: LogoProps) {
  const isLarge = size === "large";
  const imageWidth = isLarge ? 280 : compact ? 180 : 260;
  const imageHeight = Math.round(imageWidth / 2.13);

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/brand/after-check-in-logo-cropped.png"
        alt="After Check-in"
        width={imageWidth}
        height={imageHeight}
        className={cn(
          "h-auto rounded-md object-contain",
          isLarge
            ? "w-36 sm:w-44 lg:w-48"
            : compact
              ? "w-28 sm:w-36"
              : "w-40 sm:w-52"
        )}
        priority
      />
    </div>
  );
}
