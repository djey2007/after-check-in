import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  MapPinned,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { getProfileByUserId } from "@/lib/profile/queries";
import { getCurrentVisibilitySession } from "@/lib/visibility/queries";
import { VisibilityForm } from "@/components/visibility/visibility-form";
import { stopVisibilityAction } from "@/app/visibility/actions";
import { Button } from "@/components/ui/button";
import { visibilityIntentLabels } from "@/lib/visibility/types";

function getRemainingLabel(visibleUntil: string) {
  const remainingMs = new Date(visibleUntil).getTime() - Date.now();

  if (remainingMs <= 0) {
    return "Expirée";
  }

  const totalMinutes = Math.ceil(remainingMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min restantes`;
  }

  return `${hours}h ${minutes} min restantes`;
}

export default async function VisibilityPage() {
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
    redirect("/login?redirectTo=/visibility");
  }

  const { data: profile } = await getProfileByUserId(supabase, user.id);
  const { data: currentSession } = await getCurrentVisibilitySession(supabase, user.id);

  const visibleSession =
    currentSession && new Date(currentSession.visible_until).getTime() > Date.now()
      ? currentSession
      : null;

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
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
                  <Clock3 className="h-4 w-4" />
                  Visibilité temporaire
                </span>
                <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-normal sm:text-4xl">
                  Rends-toi disponible, seulement quand tu le décides.
                </h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/72">
                  Choisis ton intention, une durée, et reste visible uniquement dans
                  ta zone approximative. À expiration, ton profil disparaît automatiquement.
                </p>
              </div>

              {profile ? (
                <div className="rounded-md border border-white/12 bg-white/8 px-4 py-3 text-sm font-semibold leading-6">
                  <span className="flex items-center gap-2 text-lagoon-100">
                    <MapPinned className="h-4 w-4" />
                    Zone actuelle
                  </span>
                  <p className="mt-1 text-lg font-bold text-white">{profile.approx_area}</p>
                </div>
              ) : null}
            </div>
          </section>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.34fr_0.66fr] lg:p-8">
            <aside className="grid content-start gap-4">
              {profile ? (
                <InfoCard
                  icon={UserRound}
                  title="Profil prêt"
                  text={`Connecté avec ${user.email}`}
                />
              ) : (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
                  Complète ton profil avant d’activer la visibilité.
                </div>
              )}
              <InfoCard
                icon={ShieldCheck}
                title="Cadre de sécurité"
                text="Rencontre dans un lieu public. Aucun numéro de chambre ni localisation précise."
              />
              <InfoCard
                icon={Sparkles}
                title="Expiration automatique"
                text="Ta présence s’arrête seule à la fin de la durée choisie."
              />
            </aside>

          <section className="rounded-md border border-night-900/10 bg-night-950/3 p-5 sm:p-6">
            {visibleSession ? (
              <div className="mb-6 rounded-md border border-lagoon-500/20 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-night-900/62">Visibilité active</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-normal text-night-950">
                      {visibilityIntentLabels[visibleSession.intent]}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-night-900/72">
                      {visibleSession.approx_area} · {getRemainingLabel(visibleSession.visible_until)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white px-3 py-2 text-sm font-bold text-night-950">
                    <TimerReset className="inline-block h-4 w-4" /> En ligne
                  </div>
                </div>

                <form action={stopVisibilityAction} className="mt-5">
                  <Button type="submit" variant="secondary">
                    Désactiver maintenant
                  </Button>
                </form>
              </div>
            ) : null}

            {profile ? (
              <VisibilityForm currentSession={visibleSession} />
            ) : (
              <div className="rounded-md border border-gold-400/30 bg-gold-400/14 p-5 text-night-950">
                <h2 className="text-xl font-bold tracking-normal">Profil requis</h2>
                <p className="mt-2 leading-7">
                  Tu dois compléter ton profil avant d&apos;activer ta visibilité.
                </p>
                <ButtonLink href="/profile" className="mt-4">
                  Compléter le profil
                </ButtonLink>
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InfoCard
                icon={UserRound}
                title="Intention"
                text="Tu choisis ce que tu cherches maintenant."
              />
              <InfoCard
                icon={Sparkles}
                title="Expiration"
                text="La présence s'arrête automatiquement."
              />
              <InfoCard
                icon={Clock3}
                title="Confidentialité"
                text="Aucune précision de chambre ou GPS."
              />
            </div>
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
  icon: typeof Clock3;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-lagoon-500" />
      <h2 className="mt-3 font-bold text-night-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-night-900/68">{text}</p>
    </article>
  );
}
