import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  compact?: boolean;
};

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/brand/after-check-in-logo.png"
        alt="After Check-in"
        width={compact ? 44 : 64}
        height={compact ? 44 : 64}
        className="h-11 w-11 rounded-md object-contain sm:h-14 sm:w-14"
        priority
      />
      <div className="leading-none">
        <p className="text-lg font-bold tracking-normal text-night-950 sm:text-xl">After</p>
        <p className="text-lg font-bold tracking-normal text-night-950 sm:text-xl">
          Check-in
        </p>
      </div>
    </div>
  );
}

