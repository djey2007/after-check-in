"use client";

import { useActionState } from "react";
import { activateVisibilityAction } from "@/app/visibility/actions";
import type { VisibilitySession } from "@/lib/visibility/types";
import {
  initialVisibilityFormState,
  visibilityDurationLabels,
  visibilityIntentLabels
} from "@/lib/visibility/types";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type VisibilityFormProps = {
  currentSession: VisibilitySession | null;
  defaultIntent?: string;
};

export function VisibilityForm({ currentSession, defaultIntent = "dinner" }: VisibilityFormProps) {
  const [state, action] = useActionState(activateVisibilityAction, initialVisibilityFormState);

  return (
    <form action={action} className="grid gap-5">
      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Intention du moment
        <select
          name="intent"
          defaultValue={currentSession?.intent ?? defaultIntent}
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        >
          {Object.entries(visibilityIntentLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(visibilityDurationLabels) as Array<"3" | "6" | "24">).map((value) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-night-900/10 px-4 py-3 text-sm font-semibold text-night-950"
          >
            <input
              type="radio"
              name="duration"
              value={value}
              defaultChecked={value === "3"}
              className="h-4 w-4 text-lagoon-500"
            />
            {visibilityDurationLabels[Number(value) as 3 | 6 | 24]}
          </label>
        ))}
      </div>

      <div className="rounded-md bg-lagoon-100 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
        La visibilité expire automatiquement. Pas de GPS, pas de distance exacte, pas de
        numéro de chambre.
      </div>

      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Activation...">Activer la visibilité</SubmitButton>
    </form>
  );
}
