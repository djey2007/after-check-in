import { redirect } from "next/navigation";
import { ArrowLeft, Compass, MapPinned, Radar, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getDiscoverableProfiles } from "@/lib/discovery/queries";
import { getProfileByUserId } from "@/lib/profile/queries";
import { DiscoverCard } from "@/components/discovery/discover-card";

export default async function DiscoverPage() {
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
    redirect("/login?redirectTo=/discover");
  }

  const { data: profile } = await getProfileByUserId(supabase, user.id);
  const { data: discoverableProfiles, error } = await getDiscoverableProfiles(supabase);

  const profiles = discoverableProfiles ?? [];

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
          <div className="grid gap-6 bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.24),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
                <Radar className="h-4 w-4" />
                Découverte active
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-normal sm:text-4xl">
                Les personnes disponibles autour de toi.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/72">
                Découvre uniquement les profils visibles dans ta zone approximative.
                Les demandes restent consenties, et le chat s’ouvre seulement après acceptation.
              </p>
            </div>
            {profile ? (
              <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold leading-6">
                <span className="flex items-center gap-2 text-lagoon-100">
                  <MapPinned className="h-4 w-4" />
                  Ta zone actuelle
                </span>
                <p className="mt-1 text-lg font-bold text-white">{profile.approx_area}</p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.34fr_0.66fr] lg:p-8">
            <aside className="grid content-start gap-4">
              <InfoCard
                icon={UsersRound}
                title={`${profiles.length} profil${profiles.length > 1 ? "s" : ""}`}
                text="Disponibles maintenant dans ta zone."
              />
              <InfoCard
                icon={ShieldCheck}
                title="Cadre de sécurité"
                text="Profils bloqués, suspendus ou expirés exclus automatiquement."
              />
              <InfoCard
                icon={Sparkles}
                title="Intention claire"
                text="Chaque profil affiche son intention du moment avant toute demande."
              />
            </aside>

            <section>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
                {error.message}
              </div>
            ) : null}

            {profiles.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {profiles.map((profileItem) => (
                  <DiscoverCard key={profileItem.id} profile={profileItem} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-night-900/10 bg-night-950/3 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-lagoon-100 text-lagoon-600">
                  <Compass className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-normal text-night-950">
                  Aucun profil visible pour le moment
                </h2>
                <p className="mt-3 leading-7 text-night-900/72">
                  Tu verras ici les personnes qui ont activé leur visibilité dans la
                  même zone approximative que toi.
                </p>
                <ButtonLink href="/visibility" className="mt-5">
                  Activer ma visibilité
                </ButtonLink>
              </div>
            )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  text
}: {
  icon: typeof UsersRound;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-night-950/3 p-4">
      <Icon className="h-5 w-5 text-lagoon-500" />
      <h2 className="mt-3 font-bold text-night-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-night-900/68">{text}</p>
    </article>
  );
}
