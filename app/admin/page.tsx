import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { reportReasonLabels, type AdminReport, type AdminUser } from "@/lib/moderation/types";
import { setUserSuspendedAction } from "@/app/moderation/actions";

export default async function AdminPage() {
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
    redirect("/login?redirectTo=/admin");
  }

  const { data: isAdmin } = await supabase.rpc("is_current_user_admin");

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const [{ data: reportsData }, { data: usersData }] = await Promise.all([
    supabase.rpc("get_admin_reports").returns<AdminReport[]>(),
    supabase.rpc("get_admin_users").returns<AdminUser[]>()
  ]);
  const reports = Array.isArray(reportsData) ? reportsData : [];
  const users = Array.isArray(usersData) ? usersData : [];

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

        <div className="rounded-md bg-night-950 p-6 text-white shadow-glow">
          <p className="text-sm font-semibold text-lagoon-100/80">Moderation</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            Admin After Check-in
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/72">
            Espace minimal pour suivre les signalements et suspendre un compte.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-lagoon-500" />
              <h2 className="text-xl font-bold tracking-normal text-night-950">Signalements</h2>
            </div>

            {reports.length ? (
              <div className="mt-5 grid gap-4">
                {reports.map((report: AdminReport) => (
                  <article key={report.id} className="rounded-md border border-night-900/10 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-night-950">
                          {report.reported_username}
                        </h3>
                        <p className="mt-1 text-sm text-night-900/62">
                          Signale par {report.reporter_username}
                        </p>
                      </div>
                      <span className="rounded-md bg-gold-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-night-950">
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-night-950">
                      {reportReasonLabels[report.reason]}
                    </p>
                    {report.details ? (
                      <p className="mt-2 rounded-md bg-night-950/5 p-3 text-sm leading-6 text-night-900/72">
                        {report.details}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-night-950/5 p-4 text-sm text-night-900/68">
                Aucun signalement pour le moment.
              </p>
            )}
          </section>

          <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <UsersRound className="h-6 w-6 text-lagoon-500" />
              <h2 className="text-xl font-bold tracking-normal text-night-950">Utilisateurs</h2>
            </div>

            {users.length ? (
              <div className="mt-5 grid gap-3">
                {users.map((profile: AdminUser) => (
                  <article key={profile.id} className="rounded-md border border-night-900/10 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-night-950">{profile.username}</h3>
                        <p className="mt-1 text-sm leading-6 text-night-900/62">
                          {profile.age} ans - {profile.approx_area}
                        </p>
                      </div>
                      <span className="rounded-md bg-night-950/5 px-2 py-1 text-xs font-bold text-night-950">
                        {profile.is_suspended ? "Suspendu" : "Actif"}
                      </span>
                    </div>
                    {!profile.is_admin ? (
                      <form action={setUserSuspendedAction} className="mt-3">
                        <input type="hidden" name="targetUserId" value={profile.id} />
                        <input
                          type="hidden"
                          name="suspended"
                          value={profile.is_suspended ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-night-900/15 bg-white px-4 py-2 text-sm font-semibold text-night-950 transition hover:border-lagoon-500/60"
                        >
                          {profile.is_suspended ? "Reactiver" : "Suspendre"}
                        </button>
                      </form>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-md bg-night-950/5 p-4 text-sm text-night-900/68">
                Aucun utilisateur trouve.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
