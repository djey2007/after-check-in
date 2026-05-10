import { redirect } from "next/navigation";
import { ArrowLeft, Compass, ShieldCheck } from "lucide-react";
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

        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="rounded-md border border-night-900/10 bg-white p-6 shadow-sm">
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-lagoon-100 text-night-950">
              <Compass className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-normal text-night-950">Decouverte</h1>
            <p className="mt-3 leading-7 text-night-900/72">
              Profils visibles dans ta zone approximative avec leur intention en cours.
            </p>
            {profile ? (
              <div className="mt-5 rounded-md bg-gold-400/20 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
                Ta zone actuelle: {profile.approx_area}
              </div>
            ) : null}
            <div className="mt-6 rounded-md border border-night-900/10 p-4">
              <ShieldCheck className="h-5 w-5 text-lagoon-500" />
              <p className="mt-3 text-sm font-semibold text-night-950">Cadre de securite</p>
              <p className="mt-2 text-sm leading-6 text-night-900/68">
                La decouverte exclut les profils bloques, suspendus ou expires.
              </p>
            </div>
          </aside>

          <section>
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
                {error.message}
              </div>
            ) : null}

            {profiles.length > 0 ? (
              <div className="grid gap-4">
                {profiles.map((profileItem) => (
                  <DiscoverCard key={profileItem.id} profile={profileItem} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-night-900/10 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold tracking-normal text-night-950">
                  Aucun profil visible pour le moment
                </h2>
                <p className="mt-3 leading-7 text-night-900/72">
                  Tu verras ici les personnes qui ont active leur visibilite dans la
                  meme zone approximative que toi.
                </p>
                <ButtonLink href="/visibility" className="mt-5">
                  Activer la visibilite
                </ButtonLink>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

