import { Clock3, MapPinned, MessageCircle, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { redirect } from "next/navigation";
import { getProfileByUserId } from "@/lib/profile/queries";
import { ProfileSummary } from "@/components/profile/profile-summary";

export default async function DashboardPage() {
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
    redirect("/login?redirectTo=/dashboard");
  }

  const { data: profile } = await getProfileByUserId(supabase, user.id);

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-md bg-night-950 p-6 text-white shadow-glow">
          <p className="text-sm font-semibold text-lagoon-100/80">
            Connecte avec {user.email}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            Tableau de bord After Check-in
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/72">
            {profile
              ? "Ton profil est enregistre. La prochaine etape sera l activation de la visibilite temporaire."
              : "Ton compte est actif. Complete ton profil pour continuer le parcours MVP."}
          </p>
        </div>

        {profile ? (
          <div className="mt-6">
            <ProfileSummary profile={profile} />
          </div>
        ) : (
          <div className="mt-6 rounded-md border border-gold-400/30 bg-gold-400/14 p-5 text-night-950">
            <h2 className="text-xl font-bold tracking-normal">Profil incomplet</h2>
            <p className="mt-2 leading-7">
              Ajoute ton pseudo, ton age, ta zone approximative et quelques infos
              utiles avant d&apos;activer ta visibilite.
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard icon={UserRound} title="Profil" text="Pseudo, photo, bio et zone." />
          <DashboardCard icon={Clock3} title="Visibilite" text="3h, 6h ou 24h." />
          <DashboardCard icon={MapPinned} title="Decouverte" text="Meme zone approximative." />
          <DashboardCard icon={MessageCircle} title="Demandes" text="Chat apres acceptation." />
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/profile">{profile ? "Voir / modifier le profil" : "Completer le profil"}</ButtonLink>
          <ButtonLink href="/visibility" variant="secondary">
            Activer la visibilite
          </ButtonLink>
          <ButtonLink href="/discover" variant="secondary">
            Decouvrir
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Retour accueil
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  text
}: {
  icon: typeof UserRound;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white p-5">
      <Icon className="h-6 w-6 text-lagoon-500" />
      <h2 className="mt-4 font-bold text-night-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-night-900/68">{text}</p>
    </article>
  );
}
