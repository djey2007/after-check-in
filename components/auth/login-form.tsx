"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/auth/actions";
import type { AuthFormState } from "@/lib/auth/form-state";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type LoginFormProps = {
  initialState: AuthFormState;
  redirectTo?: string;
};

export function LoginForm({ initialState, redirectTo = "/dashboard" }: LoginFormProps) {
  const [state, action] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

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
          autoComplete="current-password"
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Connexion...">Se connecter</SubmitButton>
    </form>
  );
}
