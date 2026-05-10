import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SignupForm } from "@/components/auth/signup-form";
import { initialAuthFormState } from "@/lib/auth/form-state";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
        <Logo />
        <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">
          Creer un compte
        </h1>
        <p className="mt-3 leading-7 text-night-900/72">
          Inscris-toi par email pour rejoindre After Check-in. Le service est reserve
          aux utilisateurs majeurs.
        </p>
        <SignupForm initialState={initialAuthFormState} />
        <div className="mt-5 grid gap-3">
          <ButtonLink href="/login" variant="secondary">
            J&apos;ai deja un compte
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Retour a l&apos;accueil
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
