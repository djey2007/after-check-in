import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Clock3, MapPinned, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getDiscoverableProfiles } from "@/lib/discovery/queries";
import { getProfileByUserId } from "@/lib/profile/queries";
import { ContactRequestForm } from "@/components/contact/contact-request-form";
import { ModerationPanel } from "@/components/moderation/moderation-panel";

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
          Retour a la decouverte
        </ButtonLink>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-md border border-night-900/10 bg-white p-6 shadow-sm">
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-lagoon-100 text-night-950">
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

            <h1 className="mt-6 text-3xl font-bold tracking-normal text-night-950">
              {targetProfile.username}
            </h1>
            <p className="mt-2 text-sm font-semibold text-night-900/62">
              {targetProfile.age} ans
            </p>

            {currentUserProfile ? (
              <div className="mt-5 rounded-md bg-gold-400/20 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
                Ta zone: {currentUserProfile.approx_area}
              </div>
            ) : null}

            <div className="mt-6 rounded-md border border-night-900/10 p-4">
              <MapPinned className="h-5 w-5 text-lagoon-500" />
              <p className="mt-3 text-sm font-semibold text-night-950">Zone</p>
              <p className="mt-2 text-sm leading-6 text-night-900/68">
                {targetProfile.approx_area}
              </p>
            </div>
          </aside>

          <section className="rounded-md border border-night-900/10 bg-white p-6 shadow-sm">
            {targetProfile.bio ? (
              <p className="leading-7 text-night-900/76">{targetProfile.bio}</p>
            ) : (
              <p className="leading-7 text-night-900/76">Aucune bio renseignee.</p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <DetailCard title="Langues" value={targetProfile.languages.join(", ") || "Non renseigne"} />
              <DetailCard title="Interets" value={targetProfile.interests.join(", ") || "Non renseigne"} />
              <DetailCard title="Profil" value={targetProfile.travel_type} />
              <DetailCard title="Visibilite" value={targetProfile.current_intent} />
            </div>

            <div className="mt-6 rounded-md border border-night-900/10 bg-night-950 p-5 text-white">
              <Clock3 className="h-6 w-6 text-lagoon-400" />
              <h2 className="mt-4 text-xl font-bold tracking-normal">Demande de contact</h2>
              <p className="mt-3 leading-7 text-white/72">
                Envoie une demande simple. Le chat ne sera ouvert qu&apos;apres acceptation.
              </p>
              <div className="mt-5">
                <ContactRequestForm receiverId={targetProfile.id} />
              </div>
            </div>

            <ModerationPanel targetUserId={targetProfile.id} />
          </section>
        </div>
      </section>
    </main>
  );
}

function DetailCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md bg-night-950/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-night-900/54">{title}</p>
      <p className="mt-2 font-semibold text-night-950">{value}</p>
    </div>
  );
}
