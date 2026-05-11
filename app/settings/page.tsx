import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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

        <div className="rounded-md bg-night-950 p-6 text-white shadow-glow">
          <p className="text-sm font-semibold text-lagoon-100/80">Compte</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal sm:text-4xl">
            Parametres
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/72">
            Gestion minimale du compte et de la confidentialite pour le MVP.
          </p>
        </div>

        <section className="mt-6 rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-lagoon-500" />
          <h2 className="mt-4 text-xl font-bold tracking-normal text-night-950">
            Confidentialite
          </h2>
          <p className="mt-2 leading-7 text-night-900/72">
            After Check-in ne publie ni numero de chambre, ni distance exacte, ni
            position GPS precise. La visibilite peut etre coupee a tout moment.
          </p>
        </section>

        <div className="mt-6">
          <BlockedUsersList blockedUsers={blockedUsers} />
        </div>

        <div className="mt-6">
          <DeleteAccountForm />
        </div>
      </section>
    </main>
  );
}
