import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getConversationForUser, getMessagesForConversation } from "@/lib/contact/queries";
import { ChatAutoRefresh } from "@/components/chat/chat-auto-refresh";
import { ChatMessageForm } from "@/components/chat/chat-message-form";

export default async function ChatPage({
  params
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-xl rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
          <Logo />
          <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">
            Supabase a configurer
          </h1>
          <p className="mt-3 leading-7 text-night-900/72">{getMissingSupabaseMessage()}</p>
          <ButtonLink href="/" variant="secondary" className="mt-8">
            Retour accueil
          </ButtonLink>
        </section>
      </main>
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/chat/${conversationId}`);
  }

  const { data: conversation, error } = await getConversationForUser(
    supabase,
    conversationId,
    user.id
  );

  if (error || !conversation) {
    notFound();
  }

  const { data: messages } = await getMessagesForConversation(supabase, conversation.id);
  const otherParticipantId =
    conversation.participant_a === user.id ? conversation.participant_b : conversation.participant_a;

  return (
    <main className="min-h-screen">
      <ChatAutoRefresh />
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ButtonLink href="/requests" variant="ghost" className="mb-5 px-0">
          <ArrowLeft className="h-4 w-4" />
          Demandes
        </ButtonLink>

        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-sm">
          <div className="border-b border-night-900/10 bg-night-950 p-5 text-white">
            <p className="text-sm font-semibold text-lagoon-100/80">Conversation acceptee</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal">Chat texte</h1>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Aucun partage d&apos;image, audio ou video dans cette V1. Pour te retrouver,
              choisis toujours un lieu public.
            </p>
          </div>

          <div className="min-h-[360px] bg-night-950/3 p-4 sm:p-6">
            {messages?.length ? (
              <div className="grid gap-3">
                {messages.map((message) => {
                  const isMine = message.sender_id === user.id;
                  return (
                    <div
                      key={message.id}
                      className={isMine ? "flex justify-end" : "flex justify-start"}
                    >
                      <div
                        className={
                          isMine
                            ? "max-w-[82%] rounded-md bg-lagoon-500 px-4 py-3 text-white"
                            : "max-w-[82%] rounded-md bg-white px-4 py-3 text-night-950 shadow-sm"
                        }
                      >
                        <p className="whitespace-pre-wrap text-sm leading-6">{message.body}</p>
                        <p
                          className={
                            isMine
                              ? "mt-2 text-xs text-white/65"
                              : "mt-2 text-xs text-night-900/48"
                          }
                        >
                          {formatMessageDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[320px] items-center justify-center rounded-md border border-dashed border-night-900/15 bg-white p-6 text-center">
                <div>
                  <p className="font-bold text-night-950">Aucun message pour le moment</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-night-900/68">
                    La conversation est ouverte apres acceptation. Commence simplement
                    et propose un lieu public.
                  </p>
                </div>
              </div>
            )}
            <div id="chat-bottom" />
          </div>

          <ChatMessageForm
            conversationId={conversation.id}
            otherParticipantId={otherParticipantId}
          />
        </div>
      </section>
    </main>
  );
}

function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}
