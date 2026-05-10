import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/auth/login-form";
import { initialAuthFormState } from "@/lib/auth/form-state";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
        <Logo />
        <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">Connexion</h1>
        <p className="mt-3 leading-7 text-night-900/72">
          Connecte-toi pour activer ton profil, choisir ton intention et decouvrir les
          personnes disponibles dans ta zone.
        </p>
        <LoginForm
          initialState={initialAuthFormState}
          redirectTo={params.redirectTo ?? "/dashboard"}
        />
        <div className="mt-5 grid gap-3">
          <ButtonLink href="/signup" variant="secondary">
            Creer un compte
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Retour a l&apos;accueil
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
