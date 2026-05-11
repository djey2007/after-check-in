import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  Coffee,
  Compass,
  Handshake,
  Hotel,
  LockKeyhole,
  MapPinned,
  MessageCircle,
  Moon,
  Route,
  ShieldCheck,
  UserRound,
  Utensils
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { PublicHeader } from "@/components/public-header";

const intents = [
  { label: "Dîner", icon: Utensils },
  { label: "Boire un verre", icon: Coffee },
  { label: "Networking", icon: Handshake },
  { label: "Sortie locale", icon: MapPinned },
  { label: "Rencontre", icon: MessageCircle }
];

const steps = [
  {
    title: "Complète ton profil",
    text: "Un profil court, lisible et pensé pour donner confiance."
  },
  {
    title: "Choisis ton intention",
    text: "Dîner, verre, networking, sortie locale ou rencontre."
  },
  {
    title: "Active ta visibilité",
    text: "Disponible pour 3h, 6h ou 24h, puis invisible automatiquement."
  },
  {
    title: "Échange après acceptation",
    text: "Le chat s’ouvre uniquement quand la demande est acceptée."
  }
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

      <section className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:pb-16 lg:pt-10">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lagoon-500/20 bg-white/85 px-3 py-1 text-sm font-semibold text-night-900 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-lagoon-500" />
            Social, temporaire, sans localisation précise
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-normal text-night-950 sm:text-6xl">
            Le lobby social des voyageurs solos.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-night-900/78 sm:text-lg">
            After Check-in transforme les soirées d’hôtel en moments simples et
            conviviaux : dîner, boire un verre, networker ou sortir avec des
            personnes proches, disponibles et consentantes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/signup" className="w-full px-7 sm:w-auto">
              Créer un compte
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/login" variant="secondary" className="w-full sm:w-auto">
              Se connecter
            </ButtonLink>
          </div>

          <p className="mt-4 flex max-w-xl gap-2 text-sm font-semibold leading-6 text-night-900/64">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-lagoon-500" />
            <span>
            Visible uniquement quand tu le décides. Jamais de numéro de chambre.
            Jamais de localisation précise.
            </span>
          </p>

          <div className="mt-8 grid gap-3 text-sm font-semibold text-night-900/72 sm:grid-cols-3">
            <TrustPill icon={LockKeyhole} text="Réservé aux majeurs" />
            <TrustPill icon={Hotel} text="Lieux publics recommandés" />
            <TrustPill icon={Compass} text="Aucun numéro de chambre" />
          </div>
        </div>

        <div className="relative z-10">
          <ProductMockup />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Pensé pour les voyageurs en déplacement"
          title="Une présence sociale utile, seulement quand elle a du sens."
          text="After Check-in reste simple, discret et volontaire : tu apparais uniquement pendant une fenêtre courte, dans une zone approximative."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {travelerProfiles.map((profile) => (
            <AudienceCard key={profile.title} {...profile} />
          ))}
        </div>
      </section>

      <section className="border-y border-night-900/10 bg-white/72 py-8 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro
            eyebrow="Comment ça marche"
            title="Un parcours court, clair et rassurant."
            text="Le MVP va droit au but : disponibilité temporaire, intention visible, demande acceptée, puis chat texte."
          />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
            {steps.map((step, index) => (
              <StepCard key={step.title} index={index + 1} isLast={index === steps.length - 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Sécurité intégrée"
          title="Pensé pour inspirer confiance, pas pour exposer."
          text="La confidentialité et le consentement sont dans le produit dès le départ."
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-md bg-night-950 p-6 text-white shadow-2xl shadow-night-950/18 sm:p-8 lg:p-9">
          <div className="grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-lagoon-500/15 text-lagoon-400 shadow-glow">
              <Coffee className="h-9 w-9" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-lagoon-100/80">
                Prêt après le check-in ?
              </p>
              <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-normal sm:text-3xl">
                Prêt à transformer vos soirées d’hôtel ?
              </h2>
              <p className="mt-2 text-white/72">
                Rejoignez After Check-in et faites de chaque halte une belle rencontre possible.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/signup" className="bg-gold-400 text-night-950 hover:bg-gold-300">
                Créer un compte
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" className="border-white/20 bg-white/8 text-white hover:bg-white hover:text-night-950">
                Se connecter
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-night-900/10 bg-white/78">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Logo compact />
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-night-900/68">
            <a href="mailto:contact@after-check-in.app">Contact</a>
            <a href="#confidentialite">Confidentialité</a>
            <a href="#conditions">Conditions</a>
          </nav>
          <p className="text-sm font-semibold text-night-900/54">
            © 2026 After Check-in. Tous droits réservés.
          </p>
        </div>
      </footer>
    </main>
  );
}

function ProductMockup() {
  return (
    <div className="premium-surface relative rounded-md p-3 shadow-2xl shadow-night-950/16">
      <div className="rounded-md bg-night-950 p-5 text-white shadow-2xl shadow-night-950/18 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-4">
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
                className={intent.label === "Rencontre" ? "col-span-2 flex min-h-16 items-center gap-4 rounded-md border border-white/10 bg-white/9 p-4 shadow-inner" : "flex min-h-16 items-center gap-4 rounded-md border border-white/10 bg-white/9 p-4 shadow-inner"}
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
  );
}

function SectionIntro({
  eyebrow,
  title,
  text
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-wide text-lagoon-500">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-normal text-night-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-night-900/70">{text}</p>
    </div>
  );
}

function TrustPill({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-night-900/10 bg-white/74 px-4 py-3 shadow-sm backdrop-blur">
      <Icon className="h-4 w-4 text-lagoon-500" />
      <span>{text}</span>
    </div>
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
    <article className="flex gap-4 rounded-md border border-night-900/10 bg-white/86 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-night-950/8">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-lagoon-100 text-lagoon-500">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-bold tracking-normal text-night-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-night-900/68">{text}</p>
      </div>
    </article>
  );
}

function StepCard({
  index,
  title,
  text,
  isLast
}: {
  index: number;
  title: string;
  text: string;
  isLast: boolean;
}) {
  return (
    <article className="relative flex gap-4 rounded-md bg-transparent p-2">
      {!isLast ? (
        <div className="absolute left-14 top-7 hidden h-px w-[calc(100%-3.5rem)] border-t border-dashed border-lagoon-500/45 lg:block" />
      ) : null}
      <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lagoon-500 text-sm font-bold text-white shadow-glow">
        {index}
      </span>
      <div>
        <h3 className="font-bold tracking-normal text-night-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-night-900/68">{text}</p>
      </div>
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
    <article className="rounded-md border border-night-900/10 bg-white p-4 shadow-lg shadow-night-950/8 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-lagoon-100 text-sm font-bold text-night-950">
            {name.slice(0, 1)}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-lagoon-500" />
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
    <article className="rounded-md border border-night-900/10 bg-white/86 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-night-950/8">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-lagoon-100">
        <Icon className="h-6 w-6 text-lagoon-500" />
      </div>
      <h2 className="mt-5 text-xl font-bold tracking-normal text-night-950">{title}</h2>
      <p className="mt-3 leading-7 text-night-900/72">{text}</p>
    </article>
  );
}
