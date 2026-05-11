import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-night-950 text-white shadow-glow hover:bg-night-900 focus-visible:outline-lagoon-500",
  secondary:
    "border border-night-900/15 bg-white/88 text-night-950 hover:border-lagoon-500/60 hover:bg-white hover:text-night-900 focus-visible:outline-lagoon-500",
  ghost:
    "text-night-900 hover:bg-night-950/5 focus-visible:outline-lagoon-500"
};

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(baseClass, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
};

export function ButtonLink({
  className,
  href,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href as never}
      className={cn(baseClass, variants[variant], className)}
      {...props}
    />
  );
}
