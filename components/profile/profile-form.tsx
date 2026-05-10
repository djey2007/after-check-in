"use client";

import { useActionState } from "react";
import { saveProfileAction } from "@/app/profile/actions";
import {
  initialProfileFormState,
  type Profile,
  travelTypeLabels
} from "@/lib/profile/types";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type ProfileFormProps = {
  profile: Profile | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, action] = useActionState(saveProfileAction, initialProfileFormState);

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Pseudo
          <input
            name="username"
            required
            minLength={2}
            maxLength={32}
            defaultValue={profile?.username ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Age
          <input
            name="age"
            type="number"
            required
            min={18}
            max={120}
            defaultValue={profile?.age ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Zone approximative
        <input
          name="approx_area"
          required
          maxLength={80}
          placeholder="Ex: Bordeaux centre, Paris - Massy, Saintes"
          defaultValue={profile?.approx_area ?? ""}
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Bio courte
        <textarea
          name="bio"
          maxLength={240}
          rows={4}
          placeholder="Une phrase simple pour te presenter."
          defaultValue={profile?.bio ?? ""}
          className="rounded-md border border-night-900/12 bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Langues parlees
          <input
            name="languages"
            placeholder="Francais, anglais"
            defaultValue={profile?.languages.join(", ") ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Centres d&apos;interet
          <input
            name="interests"
            placeholder="Cuisine, sport, culture"
            defaultValue={profile?.interests.join(", ") ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Type de deplacement
        <select
          name="travel_type"
          defaultValue={profile?.travel_type ?? "business"}
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        >
          {Object.entries(travelTypeLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-md bg-lagoon-100 px-4 py-3 text-sm font-semibold leading-6 text-night-950">
        Ne renseigne jamais de numero de chambre, d&apos;adresse precise ou de position GPS.
      </div>

      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Enregistrement...">Enregistrer le profil</SubmitButton>
    </form>
  );
}
