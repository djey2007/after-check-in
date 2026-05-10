"use client";

import { useActionState } from "react";
import { sendContactRequestAction } from "@/app/requests/actions";
import { initialContactFormState } from "@/lib/contact/types";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type ContactRequestFormProps = {
  receiverId: string;
};

export function ContactRequestForm({ receiverId }: ContactRequestFormProps) {
  const [state, action] = useActionState(sendContactRequestAction, initialContactFormState);

  if (state.status === "success") {
    return (
      <div className="rounded-md bg-lagoon-100 p-4 text-sm font-semibold leading-6 text-night-950">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="receiverId" value={receiverId} />
      <label className="grid gap-2 text-sm font-semibold text-white">
        Message court
        <textarea
          name="message"
          maxLength={240}
          rows={3}
          placeholder="Ex: Salut, partant pour un verre au lobby ?"
          className="rounded-md border border-white/15 bg-white px-4 py-3 text-base font-normal text-night-950 outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>
      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Envoi...">Envoyer une demande</SubmitButton>
    </form>
  );
}

