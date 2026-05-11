import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function PublicHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
      <Logo className="shrink-0" size="large" />
      <nav className="flex shrink-0 items-center gap-1 rounded-md border border-night-900/10 bg-white/75 p-1 shadow-sm backdrop-blur sm:gap-2">
        <ButtonLink href="/login" variant="ghost" className="hidden sm:inline-flex">
          Se connecter
        </ButtonLink>
        <ButtonLink href="/signup" className="px-3 sm:px-5">
          Créer un compte
        </ButtonLink>
      </nav>
    </header>
  );
}
