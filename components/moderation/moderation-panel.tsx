"use client";

import { useActionState } from "react";
import { ShieldAlert } from "lucide-react";
import { blockUserAction, reportUserAction } from "@/app/moderation/actions";
import {
  initialModerationFormState,
  reportReasonLabels,
  type ReportReason
} from "@/lib/moderation/types";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type ModerationPanelProps = {
  targetUserId: string;
};

export function ModerationPanel({ targetUserId }: ModerationPanelProps) {
  const [state, action] = useActionState(reportUserAction, initialModerationFormState);

  return (
    <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-5 text-night-950">
      <ShieldAlert className="h-6 w-6 text-red-700" />
      <h2 className="mt-4 text-xl font-bold tracking-normal">Securite</h2>
      <p className="mt-2 text-sm leading-6 text-night-900/70">
        Bloquer masque ce profil de tes resultats. Signaler transmet le cas a la moderation.
      </p>

      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="reportedId" value={targetUserId} />
        <label className="grid gap-2 text-sm font-semibold">
          Motif
          <select
            name="reason"
            className="min-h-11 rounded-md border border-night-900/15 bg-white px-3 text-sm outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
            required
          >
            {(Object.entries(reportReasonLabels) as [ReportReason, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Details optionnels
          <textarea
            name="details"
            maxLength={500}
            rows={3}
            className="rounded-md border border-night-900/15 bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>
        <AuthMessage status={state.status} message={state.message} />
        <SubmitButton pendingLabel="Signalement...">Signaler</SubmitButton>
      </form>

      <form action={blockUserAction} className="mt-3">
        <input type="hidden" name="blockedId" value={targetUserId} />
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100"
        >
          Bloquer ce profil
        </button>
      </form>
    </div>
  );
}
