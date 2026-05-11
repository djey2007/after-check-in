import { redirect } from "next/navigation";
import { ArrowLeft, EyeOff, LockKeyhole, ShieldCheck, UserX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import { DeleteAccountForm } from "@/components/settings/delete-account-form";
import { BlockedUsersList } from "@/components/settings/blocked-users-list";
import type { BlockedUser } from "@/lib/settings/types";

export default async function SettingsPage() {
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
    redirect("/login?redirectTo=/settings");
  }

  const { data: blockedUsersData } = await supabase
    .rpc("get_my_blocked_users")
    .returns<BlockedUser[]>();
  const blockedUsers = Array.isArray(blockedUsersData) ? blockedUsersData : [];

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <LogoutButton />
      </header>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ButtonLink href="/dashboard" variant="ghost" className="mb-5 px-0">
          <ArrowLeft className="h-4 w-4" />
          Tableau de bord
        </ButtonLink>

        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-xl shadow-night-950/8">
          <section className="bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.22),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
              <LockKeyhole className="h-4 w-4" />
              Compte et confidentialité
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
              Paramètres
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Gère tes blocages, ta confidentialité et la suppression de ton compte
              depuis un espace simple et lisible.
            </p>
          </section>

          <div className="grid gap-6 p-5 sm:p-6 lg:p-8">
            <section className="grid gap-4 sm:grid-cols-3">
              <PrivacyCard
                icon={ShieldCheck}
                title="Pas de chambre"
                text="Aucun numéro de chambre ne doit être affiché ou partagé."
              />
              <PrivacyCard
                icon={EyeOff}
                title="Zone large"
                text="Jamais de distance exacte ni de position GPS précise."
              />
              <PrivacyCard
                icon={UserX}
                title="Blocage immédiat"
                text="Un profil bloqué disparaît de ta découverte."
              />
            </section>

            <BlockedUsersList blockedUsers={blockedUsers} />
            <DeleteAccountForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function PrivacyCard({
  icon: Icon,
  title,
  text
}: {
  icon: typeof ShieldCheck;
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
