import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPinned,
  MessageCircle,
  Settings,
  Sparkles,
  UserRound
} from "lucide-react";
import { redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getProfileByUserId } from "@/lib/profile/queries";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { getCurrentVisibilitySession } from "@/lib/visibility/queries";
import { visibilityIntentLabels } from "@/lib/visibility/types";

export default async function DashboardPage() {
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
    redirect("/login?redirectTo=/dashboard");
  }

  const [{ data: profile }, { data: visibility }] = await Promise.all([
    getProfileByUserId(supabase, user.id),
    getCurrentVisibilitySession(supabase, user.id)
  ]);
  const isVisible = Boolean(visibility && new Date(visibility.visible_until).getTime() > Date.now());

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-md bg-night-950 p-6 text-white shadow-glow sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-lagoon-100/80">
                Connecté avec {user.email}
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-normal sm:text-4xl">
                Ton point de départ après le check-in.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/72">
                {profile
                  ? "Choisis ton intention, active ta visibilité temporaire et découvre les personnes disponibles dans ta zone."
                  : "Complète ton profil pour activer ta visibilité et rejoindre la découverte."}
              </p>
            </div>
            <StatusBadge
              active={isVisible}
              label={
                visibility
                  ? `${visibilityIntentLabels[visibility.intent]} · ${getRemainingLabel(visibility.visible_until)}`
                  : "Invisible"
              }
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="grid gap-6">
            {profile ? (
              <ProfileSummary profile={profile} />
            ) : (
              <div className="rounded-md border border-gold-400/30 bg-gold-400/14 p-5 text-night-950">
                <h2 className="text-xl font-bold tracking-normal">Profil incomplet</h2>
                <p className="mt-2 leading-7">
                  Ajoute ton pseudo, ton âge, ta zone approximative et quelques infos
                  utiles avant d’activer ta visibilité.
                </p>
              </div>
            )}

            <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-lagoon-500" />
                <h2 className="text-xl font-bold tracking-normal text-night-950">
                  Actions rapides
                </h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ButtonLink href="/profile">
                  {profile ? "Modifier le profil" : "Compléter le profil"}
                </ButtonLink>
                <ButtonLink href="/visibility" variant="secondary">
                  {isVisible ? "Gérer la visibilité" : "Activer la visibilité"}
                </ButtonLink>
                <ButtonLink href="/discover" variant="secondary">
                  Découvrir
                </ButtonLink>
                <ButtonLink href="/requests" variant="secondary">
                  Demandes et chat
                </ButtonLink>
                <ButtonLink href="/settings" variant="secondary">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </ButtonLink>
                {profile?.is_admin ? (
                  <ButtonLink href="/admin" variant="secondary">
                    Admin
                  </ButtonLink>
                ) : null}
              </div>
            </section>
          </section>

          <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-lagoon-500">
              Parcours MVP
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-normal text-night-950">
              Ce qu’il te reste à faire
            </h2>

            <div className="mt-6 grid gap-4">
              <JourneyItem
                icon={UserRound}
                title="Profil"
                text="Pseudo, photo, bio courte et zone approximative."
                done={Boolean(profile)}
                href="/profile"
              />
              <JourneyItem
                icon={Clock3}
                title="Visibilité"
                text="Choisis ton intention et une durée de disponibilité."
                done={isVisible}
                href="/visibility"
              />
              <JourneyItem
                icon={MapPinned}
                title="Découverte"
                text="Vois les personnes disponibles dans ta zone approximative."
                done={false}
                href="/discover"
              />
              <JourneyItem
                icon={MessageCircle}
                title="Demandes"
                text="Envoie une demande, puis discute après acceptation."
                done={false}
                href="/requests"
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm font-bold">
      <span className="flex items-center gap-2">
        <span
          className={
            active
              ? "h-2.5 w-2.5 rounded-full bg-lagoon-400"
              : "h-2.5 w-2.5 rounded-full bg-white/38"
          }
        />
        {active ? "Visible maintenant" : "Non visible"}
      </span>
      <p className="mt-1 text-white/72">{label}</p>
    </div>
  );
}

function JourneyItem({
  icon: Icon,
  title,
  text,
  done,
  href
}: {
  icon: typeof UserRound;
  title: string;
  text: string;
  done: boolean;
  href: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-night-950/3 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-lagoon-100 text-lagoon-500">
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-night-950">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-night-900/68">{text}</p>
        </div>
        <ButtonLink href={href} variant="ghost" className="min-h-9 px-2">
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </article>
  );
}

function getRemainingLabel(value: string) {
  const totalMinutes = Math.max(0, Math.ceil((new Date(value).getTime() - Date.now()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min restantes`;
  }

  return `${hours}h ${minutes} restantes`;
}
