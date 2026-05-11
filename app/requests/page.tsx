import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Inbox, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getContactRequestsForUser } from "@/lib/contact/queries";
import { respondToContactRequestAction } from "@/app/requests/actions";
import type { ContactRequestWithProfiles } from "@/lib/contact/types";

export default async function RequestsPage() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-xl rounded-md border border-night-900/10 bg-white p-6 shadow-xl shadow-night-950/8">
          <Logo />
          <h1 className="mt-8 text-3xl font-bold tracking-normal text-night-950">
            Supabase à configurer
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
    redirect("/login?redirectTo=/requests");
  }

  const { data: requests, error } = await getContactRequestsForUser(supabase, user.id);
  const incoming = requests.filter((request) => request.receiver_id === user.id);
  const outgoing = requests.filter((request) => request.sender_id === user.id);

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ButtonLink href="/dashboard" variant="ghost" className="mb-5 px-0">
          <ArrowLeft className="h-4 w-4" />
          Tableau de bord
        </ButtonLink>

        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-xl shadow-night-950/8">
          <section className="bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.22),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
              <MessageCircle className="h-4 w-4" />
              Contact après consentement
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
              Demandes et conversations
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Accepte uniquement les demandes qui te semblent claires. Privilégie les
              lieux publics comme le lobby, le bar ou le restaurant.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-semibold sm:grid-cols-3">
              <SafetyPill icon={CheckCircle2} text="Chat après acceptation" />
              <SafetyPill icon={ShieldCheck} text="Consentement prioritaire" />
              <SafetyPill icon={MessageCircle} text="Texte uniquement" />
            </div>
          </section>
        </div>

        {error ? (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
            {error.message}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RequestColumn
            icon={Inbox}
            title="Reçues"
            emptyText="Aucune demande reçue pour le moment."
            requests={incoming}
            currentUserId={user.id}
            canRespond
          />
          <RequestColumn
            icon={Send}
            title="Envoyées"
            emptyText="Aucune demande envoyée pour le moment."
            requests={outgoing}
            currentUserId={user.id}
          />
        </div>
      </section>
    </main>
  );
}

function RequestColumn({
  icon: Icon,
  title,
  emptyText,
  requests,
  currentUserId,
  canRespond = false
}: {
  icon: typeof Inbox;
  title: string;
  emptyText: string;
  requests: ContactRequestWithProfiles[];
  currentUserId: string;
  canRespond?: boolean;
}) {
  return (
    <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lagoon-100 text-night-950">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold tracking-normal text-night-950">{title}</h2>
      </div>

      {requests.length > 0 ? (
        <div className="mt-5 grid gap-4">
          {requests.map((request) => {
            const otherProfile =
              request.sender_id === currentUserId ? request.receiver : request.sender;

            return (
              <article
                key={request.id}
                className="rounded-md border border-night-900/10 bg-night-950/3 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-night-950">
                      {otherProfile?.username ?? "Profil"}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-night-900/68">
                      {otherProfile?.approx_area ?? "Zone non renseignée"}
                    </p>
                  </div>
                  <StatusPill status={request.status} />
                </div>

                {request.message ? (
                  <p className="mt-4 rounded-md bg-white p-3 text-sm leading-6 text-night-900/72">
                    {request.message}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  {request.status === "accepted" && request.conversation ? (
                    <ButtonLink href={`/chat/${request.conversation.id}`} className="w-full sm:w-auto">
                      <MessageCircle className="h-4 w-4" />
                      Ouvrir le chat
                    </ButtonLink>
                  ) : null}

                  {canRespond && request.status === "pending" ? (
                    <>
                      <ResponseForm requestId={request.id} response="accepted" label="Accepter" />
                      <ResponseForm requestId={request.id} response="declined" label="Refuser" secondary />
                    </>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-5 rounded-md bg-night-950/5 p-4 text-sm leading-6 text-night-900/68">
          {emptyText}
        </p>
      )}
    </section>
  );
}

function ResponseForm({
  requestId,
  response,
  label,
  secondary = false
}: {
  requestId: string;
  response: "accepted" | "declined";
  label: string;
  secondary?: boolean;
}) {
  return (
    <form action={respondToContactRequestAction} className="w-full sm:w-auto">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="response" value={response} />
      <button
        type="submit"
        className={
          secondary
            ? "inline-flex min-h-11 w-full items-center justify-center rounded-md border border-night-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-night-950 transition hover:border-lagoon-500/60"
            : "inline-flex min-h-11 w-full items-center justify-center rounded-md bg-lagoon-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-lagoon-400"
        }
      >
        {label}
      </button>
    </form>
  );
}

function StatusPill({ status }: { status: ContactRequestWithProfiles["status"] }) {
  const labelByStatus = {
    pending: "En attente",
    accepted: "Acceptée",
    declined: "Refusée",
    cancelled: "Annulée"
  };

  return (
    <span className="inline-flex min-h-8 items-center rounded-md bg-gold-400/20 px-3 text-xs font-bold uppercase tracking-wide text-night-950">
      {labelByStatus[status]}
    </span>
  );
}

function SafetyPill({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/8 px-3 py-2 text-lagoon-100">
      <Icon className="h-4 w-4" />
      {text}
    </span>
  );
}
