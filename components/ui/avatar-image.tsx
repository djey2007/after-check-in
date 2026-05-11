import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarImageProps = {
  src: string | null | undefined;
  alt: string;
  size?: "md" | "lg";
  className?: string;
};

const sizeClasses = {
  md: "h-14 w-14",
  lg: "h-24 w-24"
};

const iconClasses = {
  md: "h-7 w-7",
  lg: "h-10 w-10"
};

export function AvatarImage({
  src,
  alt,
  size = "md",
  className
}: AvatarImageProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-lagoon-100 text-night-950",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={size === "lg" ? "96px" : "56px"}
          className="object-cover"
        />
      ) : (
        <UserRound className={iconClasses[size]} />
      )}
    </div>
  );
}
