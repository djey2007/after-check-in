import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Image
        src="/brand/after-check-in-logo.png"
        alt="After Check-in"
        width={compact ? 56 : 80}
        height={compact ? 56 : 80}
        className="h-14 w-14 rounded-md object-contain sm:h-16 sm:w-16"
        priority
      />
      <div className="leading-none">
        <p className="text-xl font-bold tracking-normal text-night-950 sm:text-2xl">After</p>
        <p className="text-xl font-bold tracking-normal text-night-950 sm:text-2xl">
          Check-in
        </p>
      </div>
    </div>
  );
}
