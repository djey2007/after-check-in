import { ArrowLeft, CheckCircle2, Hotel, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const terms = [
  {
    title: "Utilisateurs majeurs uniquement",
    text: "After Check-in est réservé aux personnes de 18 ans et plus. L’utilisateur confirme être majeur lors de la création de compte.",
    icon: CheckCircle2
  },
  {
    title: "Rencontres dans des lieux publics",
    text: "L’application recommande les lieux publics : lobby, bar, restaurant ou espace commun. Aucun numéro de chambre ne doit être partagé.",
    icon: Hotel
  },
  {
    title: "Respect et modération",
    text: "Les comportements inappropriés, le harcèlement, les faux profils et les contenus offensants peuvent être signalés et entraîner une suspension.",
    icon: ShieldCheck
  }
];

export default function TermsPage() {
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
              Conditions
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
              Conditions d’utilisation
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-white/72">
              Ces conditions MVP fixent le cadre d’utilisation attendu pour les tests
              After Check-in. Elles devront être revues juridiquement avant un lancement
              commercial.
            </p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:p-8">
            {terms.map((item) => {
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
                Version de test
              </h2>
              <p className="mt-2 leading-7 text-night-900/72">
                Le service est en phase MVP. Certaines fonctionnalités peuvent évoluer,
                être interrompues ou ajustées selon les retours utilisateurs, les besoins
                de sécurité et les contraintes techniques.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
