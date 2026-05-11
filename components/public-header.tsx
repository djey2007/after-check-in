import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function PublicHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <Logo className="shrink-0" size="large" />
      <nav className="flex items-center gap-2 rounded-md border border-night-900/10 bg-white/70 p-1 shadow-sm backdrop-blur">
        <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
          Se connecter
        </ButtonLink>
        <ButtonLink href="/signup">Creer un compte</ButtonLink>
      </nav>
    </header>
  );
}
