import {
  BriefcaseBusiness,
  Clock3,
  Coffee,
  Handshake,
  Hotel,
  MapPinned,
  MessageCircle,
  Moon,
  ShieldCheck,
  Route,
  UserRound,
  Utensils
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";

const intents = [
  { label: "Dîner", icon: Utensils },
  { label: "Boire un verre", icon: Coffee },
  { label: "Networking", icon: Handshake },
  { label: "Sortie locale", icon: MapPinned },
  { label: "Rencontre", icon: MessageCircle }
];

const steps = [
  "Complète ton profil",
  "Choisis ton intention",
  "Active ta visibilité",
  "Échange après acceptation"
];

const travelerProfiles = [
  {
    title: "Professionnels en mission",
    text: "Trouver une table ou un verre après une journée dense, sans perdre de temps.",
    icon: BriefcaseBusiness
  },
  {
    title: "Consultants et commerciaux",
    text: "Créer un moment utile entre deux rendez-vous, dans un cadre simple et clair.",
    icon: Route
  },
  {
    title: "Voyageurs solo",
    text: "Rompre la solitude d’une soirée d’hôtel sans partager sa localisation précise.",
    icon: UserRound
  },
  {
    title: "Soirées étape à l’hôtel",
    text: "Transformer une halte en opportunité conviviale, toujours dans des lieux publics.",
    icon: Moon
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <PublicHeader />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-20 lg:pt-12">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lagoon-500/20 bg-white/85 px-3 py-1 text-sm font-semibold text-night-900 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-lagoon-500" />
            Social, temporaire, sans localisation précise
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-normal text-night-950 sm:text-6xl lg:text-7xl">
            Le lobby social des voyageurs solos.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-night-900/76 sm:text-xl">
            After Check-in transforme les soirées d&apos;hôtel en moments simples et
            conviviaux : dîner, boire un verre, networker ou sortir avec des
            personnes proches, disponibles et consentantes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" className="w-full px-7 sm:w-auto">
              Créer un compte
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" className="w-full sm:w-auto">
              Se connecter
            </ButtonLink>
          </div>

          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-night-900/64">
            Visible uniquement quand tu le décides. Jamais de numéro de chambre.
            Jamais de localisation précise.
          </p>

          <div className="mt-8 grid gap-3 text-sm font-semibold text-night-900/72 sm:grid-cols-3">
            <div className="rounded-md border border-night-900/10 bg-white/72 px-4 py-3 shadow-sm backdrop-blur">
              Réservé aux majeurs
            </div>
            <div className="rounded-md border border-night-900/10 bg-white/72 px-4 py-3 shadow-sm backdrop-blur">
              Lieux publics recommandés
            </div>
            <div className="rounded-md border border-night-900/10 bg-white/72 px-4 py-3 shadow-sm backdrop-blur">
              Aucun numéro de chambre
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="premium-surface rounded-md p-3">
            <div className="rounded-md bg-night-950 p-5 text-white shadow-2xl shadow-night-950/18">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-lagoon-100/80">
                    <Hotel className="h-4 w-4" />
                    Visible maintenant
                  </div>
                  <h2 className="mt-2 text-2xl font-bold tracking-normal">Bordeaux centre</h2>
                </div>
                <div className="rounded-md bg-gold-400 px-3 py-2 text-sm font-bold text-night-950">
                  5h 42
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {intents.map((intent) => {
                  const Icon = intent.icon;

                  return (
                    <div
                      key={intent.label}
                      className="flex min-h-24 flex-col justify-between rounded-md border border-white/10 bg-white/9 p-3 shadow-inner"
                    >
                      <Icon className="h-5 w-5 text-lagoon-400" />
                      <span className="text-sm font-semibold">{intent.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ProfilePreview
                name="Camille"
                intent="Dîner"
                area="Bordeaux centre"
                time="2h restantes"
              />
              <ProfilePreview
                name="Nora"
                intent="Networking"
                area="Bordeaux centre"
                time="45 min restantes"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mb-5 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wide text-lagoon-500">
            Pensé pour les voyageurs en déplacement
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-normal text-night-950 sm:text-3xl">
            Une présence sociale utile, seulement quand elle a du sens.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {travelerProfiles.map((profile) => (
            <AudienceCard key={profile.title} {...profile} />
          ))}
        </div>
      </section>

      <section className="border-y border-night-900/10 bg-white/74 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-night-950 text-sm font-bold text-white shadow-sm">
                {index + 1}
              </span>
              <p className="font-semibold text-night-950">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <Feature
          icon={Clock3}
          title="Visibilité temporaire"
          text="Active ta disponibilité pour 3h, 6h ou 24h. À expiration, ton profil disparaît automatiquement."
        />
        <Feature
          icon={MapPinned}
          title="Zone approximative"
          text="La découverte fonctionne par quartier ou zone libre, sans GPS exact, distance précise ou numéro de chambre."
        />
        <Feature
          icon={ShieldCheck}
          title="Consentement prioritaire"
          text="Les demandes peuvent être acceptées ou refusées. Le chat texte devient disponible uniquement après acceptation."
        />
      </section>
    </main>
  );
}

function AudienceCard({
  icon: Icon,
  title,
  text
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white/82 p-5 shadow-sm backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-night-950 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-bold tracking-normal text-night-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-night-900/68">{text}</p>
    </article>
  );
}

function ProfilePreview({
  name,
  intent,
  area,
  time
}: {
  name: string;
  intent: string;
  area: string;
  time: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white/88 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-night-950 text-sm font-bold text-white">
            {name.slice(0, 1)}
          </div>
          <div>
            <h3 className="font-bold text-night-950">{name}</h3>
            <p className="text-sm text-night-900/62">{area}</p>
          </div>
        </div>
        <span className="rounded-md bg-gold-400/18 px-2 py-1 text-xs font-bold text-night-950">
          {intent}
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-lagoon-500">{time}</p>
    </article>
  );
}

function Feature({
  icon: Icon,
  title,
  text
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white/86 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-night-950/8">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lagoon-100">
        <Icon className="h-6 w-6 text-lagoon-500" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-normal text-night-950">{title}</h2>
      <p className="mt-3 leading-7 text-night-900/72">{text}</p>
    </article>
  );
}
