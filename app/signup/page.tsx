import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
        <Logo />
        <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">
          Creer un compte
        </h1>
        <p className="mt-3 leading-7 text-night-900/72">
          Premiere version de l&apos;ecran d&apos;inscription. L&apos;authentification email sera
          connectee a Supabase ensuite.
        </p>
        <div className="mt-8 grid gap-3">
          <div className="rounded-md border border-night-900/12 px-4 py-3 text-night-900/60">
            Email
          </div>
          <div className="rounded-md border border-night-900/12 px-4 py-3 text-night-900/60">
            Mot de passe
          </div>
          <div className="flex items-center gap-3 rounded-md bg-lagoon-100 px-4 py-3 text-sm font-semibold text-night-950">
            <CheckCircle2 className="h-5 w-5 text-lagoon-500" />
            J&apos;ai plus de 18 ans
          </div>
          <ButtonLink href="/dashboard">Demarrer</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Retour a l&apos;accueil
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
