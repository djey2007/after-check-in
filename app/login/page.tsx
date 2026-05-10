import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
        <Logo />
        <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">Connexion</h1>
        <p className="mt-3 leading-7 text-night-900/72">
          Le formulaire Supabase Auth sera branche dans la prochaine etape de test.
        </p>
        <div className="mt-8 grid gap-3">
          <div className="rounded-md border border-night-900/12 px-4 py-3 text-night-900/60">
            Email
          </div>
          <div className="rounded-md border border-night-900/12 px-4 py-3 text-night-900/60">
            Mot de passe
          </div>
          <ButtonLink href="/dashboard">Continuer</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Retour a l&apos;accueil
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
