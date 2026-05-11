import { Languages, MapPinned, Sparkles } from "lucide-react";
import { type Profile, travelTypeLabels } from "@/lib/profile/types";
import { AvatarImage } from "@/components/ui/avatar-image";

type ProfileSummaryProps = {
  profile: Profile;
};

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <AvatarImage src={profile.avatar_url} alt={profile.username} />
          <div>
            <h2 className="text-2xl font-bold tracking-normal text-night-950">
              {profile.username}
            </h2>
            <p className="mt-1 text-sm font-semibold text-night-900/62">
              {profile.age} ans · {travelTypeLabels[profile.travel_type]}
            </p>
          </div>
        </div>
      </div>

      {profile.bio ? (
        <p className="mt-5 leading-7 text-night-900/76">{profile.bio}</p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryItem icon={MapPinned} label="Zone" value={profile.approx_area} />
        <SummaryItem
          icon={Languages}
          label="Langues"
          value={profile.languages.length ? profile.languages.join(", ") : "Non renseigné"}
        />
        <SummaryItem
          icon={Sparkles}
          label="Intérêts"
          value={profile.interests.length ? profile.interests.join(", ") : "Non renseigné"}
        />
      </div>
    </article>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value
}: {
  icon: typeof MapPinned;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-lagoon-100/55 p-3">
      <Icon className="h-4 w-4 text-lagoon-500" />
      <p className="mt-3 text-xs font-bold uppercase text-night-900/54">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-night-950">{value}</p>
    </div>
  );
}
