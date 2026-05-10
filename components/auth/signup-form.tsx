"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";
import { signUpAction } from "@/app/auth/actions";
import type { AuthFormState } from "@/lib/auth/form-state";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { ButtonLink } from "@/components/ui/button";

type SignupFormProps = {
  initialState: AuthFormState;
};

export function SignupForm({ initialState }: SignupFormProps) {
  const [state, action] = useActionState(signUpAction, initialState);

  if (state.status === "success") {
    return (
      <div className="mt-8 rounded-md border border-lagoon-500/20 bg-lagoon-100 p-5 text-night-950">
        <CheckCircle2 className="h-7 w-7 text-lagoon-500" />
        <h2 className="mt-4 text-xl font-bold tracking-normal">Compte cree</h2>
        <p className="mt-3 leading-7">{state.message}</p>
        <div className="mt-5 grid gap-3">
          <ButtonLink href="/login">Aller a la connexion</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Retour a l&apos;accueil
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <label className="flex items-start gap-3 rounded-md bg-lagoon-100 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
        <input
          name="isAdultConfirmed"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-night-900/20 text-lagoon-500"
        />
        <span>Je confirme avoir plus de 18 ans.</span>
      </label>

      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Creation...">Creer mon compte</SubmitButton>
    </form>
  );
}
