import { redirect, notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Languages,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getDiscoverableProfiles } from "@/lib/discovery/queries";
import { getProfileByUserId } from "@/lib/profile/queries";
import { ContactRequestForm } from "@/components/contact/contact-request-form";
import { ModerationPanel } from "@/components/moderation/moderation-panel";
import { visibilityIntentLabels } from "@/lib/visibility/types";
import { travelTypeLabels } from "@/lib/profile/types";

export default async function DiscoverProfilePage({
  params
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
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
    redirect(`/login?redirectTo=/discover/${profileId}`);
  }

  const { data: currentUserProfile } = await getProfileByUserId(supabase, user.id);
  const { data: discoverableProfiles } = await getDiscoverableProfiles(supabase);
  const targetProfile = (discoverableProfiles ?? []).find((item) => item.id === profileId);

  if (!targetProfile) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ButtonLink href="/discover" variant="ghost" className="mb-5 px-0">
          <ArrowLeft className="h-4 w-4" />
          Retour à la découverte
        </ButtonLink>

        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-xl shadow-night-950/8">
          <section className="bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.22),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-lagoon-100 text-night-950 ring-4 ring-white/12">
                  {targetProfile.avatar_url ? (
                    <img
                      src={targetProfile.avatar_url}
                      alt={targetProfile.username}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <UserRound className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
                    <Sparkles className="h-4 w-4" />
                    {visibilityIntentLabels[targetProfile.current_intent]}
                  </span>
                  <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                    {targetProfile.username}
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-white/68">
                    {targetProfile.age} ans · {travelTypeLabels[targetProfile.travel_type]}
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold leading-6">
                <span className="flex items-center gap-2 text-lagoon-100">
                  <Clock3 className="h-4 w-4" />
                  Encore visible
                </span>
                <p className="mt-1 text-lg font-bold text-white">
                  {formatRemaining(targetProfile.remaining_seconds)}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
            <aside className="grid content-start gap-4">
              {currentUserProfile ? (
                <div className="rounded-md border border-gold-400/30 bg-gold-400/14 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
                  Ta zone : {currentUserProfile.approx_area}
                </div>
              ) : null}

              <DetailCard
                icon={MapPinned}
                title="Zone approximative"
                value={targetProfile.approx_area}
              />
              <DetailCard
                icon={Languages}
                title="Langues"
                value={targetProfile.languages.join(", ") || "Non renseigné"}
              />
              <DetailCard
                icon={Sparkles}
                title="Intérêts"
                value={targetProfile.interests.join(", ") || "Non renseigné"}
              />
              <DetailCard
                icon={ShieldCheck}
                title="Cadre"
                value="Pas de chambre, pas de position exacte."
              />
            </aside>

            <section className="grid gap-5">
              <article className="rounded-md border border-night-900/10 bg-night-950/3 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-lagoon-500">Bio</p>
                {targetProfile.bio ? (
                  <p className="mt-3 leading-7 text-night-900/76">{targetProfile.bio}</p>
                ) : (
                  <p className="mt-3 leading-7 text-night-900/76">Aucune bio renseignée.</p>
                )}
              </article>

              <div className="rounded-md border border-night-900/10 bg-night-950 p-5 text-white">
                <MessageCircle className="h-6 w-6 text-lagoon-400" />
                <h2 className="mt-4 text-xl font-bold tracking-normal">Demande de contact</h2>
                <p className="mt-3 leading-7 text-white/72">
                  Envoie une demande simple. Le chat ne sera ouvert qu’après acceptation.
                </p>
                <div className="mt-5">
                  <ContactRequestForm receiverId={targetProfile.id} />
                </div>
              </div>

              <ModerationPanel targetUserId={targetProfile.id} />
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailCard({
  icon: Icon,
  title,
  value
}: {
  icon: typeof MapPinned;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-night-900/10 bg-night-950/3 p-4">
      <Icon className="h-5 w-5 text-lagoon-500" />
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-night-900/54">{title}</p>
      <p className="mt-2 font-semibold text-night-950">{value}</p>
    </div>
  );
}

function formatRemaining(seconds: number) {
  const totalMinutes = Math.max(0, Math.ceil(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}`;
}
