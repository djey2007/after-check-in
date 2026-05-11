"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SendHorizonal } from "lucide-react";
import { sendMessageAction } from "@/app/requests/actions";

type ChatMessageFormProps = {
  conversationId: string;
  otherParticipantId: string;
};

export function ChatMessageForm({
  conversationId,
  otherParticipantId
}: ChatMessageFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await sendMessageAction(formData);
          formRef.current?.reset();
          router.refresh();
        });
      }}
      className="border-t border-night-900/10 bg-white p-4"
    >
      <input type="hidden" name="conversationId" value={conversationId} />
      <input type="hidden" name="otherParticipantId" value={otherParticipantId} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <textarea
          name="body"
          maxLength={2000}
          rows={2}
          placeholder="Écris ton message..."
          className="min-h-16 flex-1 rounded-md border border-night-900/15 bg-white px-4 py-3 text-base text-night-950 outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-lagoon-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-lagoon-400 disabled:cursor-not-allowed disabled:opacity-65"
        >
          <SendHorizonal className="h-4 w-4" />
          {isPending ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
