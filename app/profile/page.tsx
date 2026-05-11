import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  MapPinned,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
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

        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-xl shadow-night-950/8">
          <section className="bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.22),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md bg-lagoon-100 text-night-950 ring-4 ring-white/12">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <UserRound className="h-10 w-10" />
                  )}
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
                    <Sparkles className="h-4 w-4" />
                    {profile ? "Profil actif" : "Profil à compléter"}
                  </span>
                  <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                    Ton profil voyageur
                  </h1>
                  <p className="mt-3 max-w-2xl leading-7 text-white/72">
                    Complète les informations visibles par les autres voyageurs avant
                    d’activer ta disponibilité temporaire.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold leading-6">
                <span className="flex items-center gap-2 text-lagoon-100">
                  <CheckCircle2 className="h-4 w-4" />
                  Connecté avec
                </span>
                <p className="mt-1 max-w-xs truncate text-white">{user.email}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.38fr_0.62fr] lg:p-8">
            <aside className="grid content-start gap-4">
              {profile ? <ProfileSummary profile={profile} /> : null}
              <ProfileTip
                icon={Camera}
                title="Photo simple"
                text="Un portrait clair suffit. Évite les images de groupe pour inspirer confiance."
              />
              <ProfileTip
                icon={MapPinned}
                title="Zone approximative"
                text="Indique une ville ou un quartier large, jamais une adresse précise."
              />
              <ProfileTip
                icon={ShieldCheck}
                title="Confidentialité"
                text="Aucun numéro de chambre, aucune distance exacte et aucune position GPS précise."
              />
            </aside>

            <section className="rounded-md border border-night-900/10 bg-night-950/3 p-5 sm:p-6">
              {isMissingProfilesTable ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-5 text-red-800">
                  <h2 className="text-xl font-bold tracking-normal">Table profil manquante</h2>
                  <p className="mt-3 leading-7">
                    Exécute la migration SQL `supabase/migrations/0001_profiles.sql`
                    dans Supabase, puis recharge cette page.
                  </p>
                </div>
              ) : (
                <ProfileForm profile={profile ?? null} />
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProfileTip({
  icon: Icon,
  title,
  text
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-lagoon-500" />
      <h2 className="mt-3 font-bold text-night-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-night-900/68">{text}</p>
    </article>
  );
}
