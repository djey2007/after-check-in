import { ArrowLeft, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const privacyItems = [
  {
    title: "Localisation approximative",
    text: "After Check-in utilise une zone large ou une ville saisie par l’utilisateur. L’application ne doit pas afficher de position GPS précise, de distance exacte ou de numéro de chambre.",
    icon: EyeOff
  },
  {
    title: "Visibilité temporaire",
    text: "Un profil devient visible uniquement quand l’utilisateur l’active, pour une durée limitée. À expiration, la visibilité s’arrête automatiquement.",
    icon: LockKeyhole
  },
  {
    title: "Consentement",
    text: "Le chat est disponible seulement après acceptation d’une demande de contact. Les utilisateurs peuvent bloquer ou signaler un profil.",
    icon: ShieldCheck
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo compact />
        <ButtonLink href="/" variant="secondary">
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </ButtonLink>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-md border border-night-900/10 bg-white shadow-xl shadow-night-950/8">
          <div className="bg-[radial-gradient(circle_at_88%_18%,rgba(245,185,76,0.22),transparent_30%),linear-gradient(135deg,#05233f_0%,#061d36_58%,#03162a_100%)] p-6 text-white sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-lagoon-300/35 bg-white/8 px-3 py-1.5 text-sm font-bold text-lagoon-100">
              <ShieldCheck className="h-4 w-4" />
              Confidentialité
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
              Politique de confidentialité
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Cette page présente les principes de confidentialité prévus pour le MVP
              After Check-in. Elle devra être complétée juridiquement avant un lancement
              commercial à grande échelle.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:p-8">
            {privacyItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-md border border-night-900/10 bg-night-950/3 p-5">
                  <Icon className="h-5 w-5 text-lagoon-500" />
                  <h2 className="mt-3 text-xl font-bold tracking-normal text-night-950">
                    {item.title}
                  </h2>
                  <p className="mt-2 leading-7 text-night-900/72">{item.text}</p>
                </article>
              );
            })}

            <article className="rounded-md border border-night-900/10 bg-white p-5">
              <h2 className="text-xl font-bold tracking-normal text-night-950">
                Données du compte
              </h2>
              <p className="mt-2 leading-7 text-night-900/72">
                Les données de profil servent à afficher un profil social minimal :
                pseudo, âge, photo, bio, langues, centres d’intérêt, type de déplacement
                et zone approximative. L’utilisateur peut demander la suppression de son
                compte depuis les paramètres.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
