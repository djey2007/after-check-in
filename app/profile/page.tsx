import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { ProfileForm } from "@/components/profile/profile-form";
import { getProfileByUserId } from "@/lib/profile/queries";
import { ProfileSummary } from "@/components/profile/profile-summary";

export default async function ProfilePage() {
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
    redirect("/login?redirectTo=/profile");
  }

  const { data: profile, error } = await getProfileByUserId(supabase, user.id);

  const isMissingProfilesTable =
    error &&
    (error.message.toLowerCase().includes("profiles") ||
      error.message.toLowerCase().includes("schema cache"));

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
              <UserRound className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-normal text-night-950">
              Ton profil
            </h1>
            <p className="mt-3 leading-7 text-night-900/72">
              Complete ton profil pour pouvoir ensuite choisir ton intention et
              activer ta visibilite temporaire.
            </p>
            <p className="mt-5 rounded-md bg-lagoon-100 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
              Connecte avec {user.email}
            </p>
            {profile ? (
              <p className="mt-3 rounded-md bg-gold-400/20 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
                Profil deja enregistre. Tu peux le modifier.
              </p>
            ) : null}
          </aside>

          <section className="rounded-md border border-night-900/10 bg-white p-6 shadow-sm">
            {profile ? (
              <div className="mb-6">
                <ProfileSummary profile={profile} />
              </div>
            ) : null}

            {isMissingProfilesTable ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
                <h2 className="text-xl font-bold tracking-normal">Table profil manquante</h2>
                <p className="mt-3 leading-7">
                  Execute la migration SQL `supabase/migrations/0001_profiles.sql`
                  dans Supabase, puis recharge cette page.
                </p>
              </div>
            ) : (
              <ProfileForm profile={profile ?? null} />
            )}

            <div className="mt-6 rounded-md border border-night-900/10 bg-night-950 p-5 text-white">
              <ShieldCheck className="h-6 w-6 text-lagoon-400" />
              <h2 className="mt-4 text-xl font-bold tracking-normal">Regles de confidentialite</h2>
              <p className="mt-3 leading-7 text-white/72">
                Aucun numero de chambre, aucune distance exacte et aucune position GPS
                precise ne seront demandes dans le profil.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
