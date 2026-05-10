import Link from "next/link";
import { ArrowRight, Clock3, Sparkles, UserRound } from "lucide-react";
import type { DiscoverableProfile } from "@/lib/discovery/types";
import { visibilityIntentLabels } from "@/lib/visibility/types";
import { travelTypeLabels } from "@/lib/profile/types";

type DiscoverCardProps = {
  profile: DiscoverableProfile;
};

function formatRemaining(seconds: number) {
  const totalMinutes = Math.max(0, Math.ceil(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} min restantes`;
  }

  return `${hours}h ${minutes} min restantes`;
}

export function DiscoverCard({ profile }: DiscoverCardProps) {
  return (
    <article className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-lagoon-100 text-night-950">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <UserRound className="h-6 w-6" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-normal text-night-950">{profile.username}</h2>
            <p className="text-sm font-semibold text-night-900/62">
              {profile.age} ans - {travelTypeLabels[profile.travel_type]}
            </p>
          </div>
        </div>

        <span className="rounded-md bg-gold-400/18 px-2 py-1 text-xs font-bold text-night-950">
          {visibilityIntentLabels[profile.current_intent]}
        </span>
      </div>

      {profile.bio ? <p className="mt-4 leading-7 text-night-900/76">{profile.bio}</p> : null}

      <div className="mt-4 grid gap-2 text-sm text-night-900/72">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lagoon-500" />
          {profile.approx_area}
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-lagoon-500" />
          {formatRemaining(profile.remaining_seconds)}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-night-950/5 px-2 py-1 text-xs font-semibold text-night-900"
            >
              {interest}
            </span>
          ))}
        </div>
        <Link
          href={`/discover/${profile.id}` as never}
          className="inline-flex items-center gap-2 text-sm font-semibold text-lagoon-500"
        >
          Voir
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
