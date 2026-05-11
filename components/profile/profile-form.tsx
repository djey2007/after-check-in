"use client";

import { useState } from "react";
import { useActionState } from "react";
import { saveProfileAction } from "@/app/profile/actions";
import {
  initialProfileFormState,
  type Profile,
  travelTypeLabels
} from "@/lib/profile/types";
import {
  approximateLocationRadiusKm,
  getApproxLocationCell,
  getApproxLocationCellBounds,
  type ApproxLocationCellBounds
} from "@/lib/location/cell";
import { AuthMessage } from "@/components/auth/auth-message";
import { SubmitButton } from "@/components/auth/submit-button";

type ProfileFormProps = {
  profile: Profile | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const [state, action] = useActionState(saveProfileAction, initialProfileFormState);
  const [locationCell, setLocationCell] = useState(profile?.location_cell ?? "");
  const [mapBounds, setMapBounds] = useState<ApproxLocationCellBounds | null>(
    profile?.location_cell ? getApproxLocationCellBounds(profile.location_cell) : null
  );
  const [locationStatus, setLocationStatus] = useState(
    profile?.location_cell ? "Position approximative activée." : ""
  );

  function requestApproxLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Ton navigateur ne permet pas la géolocalisation.");
      return;
    }

    setLocationStatus("Demande de position en cours...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const cell = getApproxLocationCell(
          position.coords.latitude,
          position.coords.longitude
        );

        if (!cell) {
          setLocationStatus("Position impossible à convertir en zone approximative.");
          return;
        }

        setLocationCell(cell);
        setMapBounds(getApproxLocationCellBounds(cell));
        setLocationStatus(
          "Position approximative trouvée. Clique sur Enregistrer le profil pour la conserver."
        );
      },
      () => {
        setLocationStatus("Position non autorisée. Tu peux garder la zone saisie manuellement.");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 10 * 60 * 1000,
        timeout: 10000
      }
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="location_cell" value={locationCell} />

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
          Âge
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
        Photo de profil
        <input
          name="avatar"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 py-3 text-sm font-normal file:mr-4 file:rounded-md file:border-0 file:bg-lagoon-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-night-950"
        />
        <span className="text-xs font-semibold leading-5 text-night-900/58">
          JPG, PNG ou WebP. 2 Mo maximum.
        </span>
      </label>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Zone approximative
        <span className="text-xs font-semibold leading-5 text-night-900/58">
          Ce texte est affiché aux autres utilisateurs. Exemple : ville, quartier ou zone large.
        </span>
        <input
          name="approx_area"
          required
          maxLength={80}
          placeholder="Ex: Bordeaux centre, Paris - Massy, Saintes"
          defaultValue={profile?.approx_area ?? ""}
          className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <div className="rounded-md border border-night-900/10 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-night-950">Position approximative</p>
            <p className="mt-1 text-sm leading-6 text-night-900/68">
              Optionnel : le GPS sert à trouver les personnes dans la même zone,
              avec un rayon d&apos;environ {approximateLocationRadiusKm} km. Le nom
              de zone ci-dessus reste l&apos;information lisible affichée aux autres.
            </p>
          </div>
          <button
            type="button"
            onClick={requestApproxLocation}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-night-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-night-950 transition hover:border-lagoon-500/60 hover:text-night-900"
          >
            Utiliser ma position
          </button>
        </div>
        {locationStatus ? (
          <p className="mt-3 rounded-md bg-lagoon-100 px-3 py-2 text-sm font-semibold leading-6 text-night-950">
            {locationStatus}
          </p>
        ) : null}
        {mapBounds ? <ApproxLocationMap bounds={mapBounds} /> : null}
      </div>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Bio courte
        <textarea
          name="bio"
          maxLength={240}
          rows={4}
          placeholder="Une phrase simple pour te présenter."
          defaultValue={profile?.bio ?? ""}
          className="rounded-md border border-night-900/12 bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Langues parlées
          <input
            name="languages"
            placeholder="Français, anglais"
            defaultValue={profile?.languages.join(", ") ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-night-950">
          Centres d&apos;intérêt
          <input
            name="interests"
            placeholder="Cuisine, sport, culture"
            defaultValue={profile?.interests.join(", ") ?? ""}
            className="min-h-12 rounded-md border border-night-900/12 bg-white px-4 text-base font-normal outline-none transition focus:border-lagoon-500 focus:ring-4 focus:ring-lagoon-500/15"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-night-950">
        Type de déplacement
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
        Ne renseigne jamais de numéro de chambre, d&apos;adresse précise ou de position GPS.
      </div>

      <AuthMessage status={state.status} message={state.message} />
      <SubmitButton pendingLabel="Enregistrement...">Enregistrer le profil</SubmitButton>
    </form>
  );
}

function ApproxLocationMap({ bounds }: { bounds: ApproxLocationCellBounds }) {
  const paddedBounds = padBounds(bounds);
  const mapUrl = [
    "https://www.openstreetmap.org/export/embed.html?bbox=",
    encodeURIComponent(
      [
        paddedBounds.minLongitude,
        paddedBounds.minLatitude,
        paddedBounds.maxLongitude,
        paddedBounds.maxLatitude
      ].join(",")
    ),
    "&layer=mapnik"
  ].join("");

  return (
    <div className="mt-4 overflow-hidden rounded-md border border-night-900/10 bg-night-950/3">
      <div className="relative h-56 w-full">
        <iframe
          title="Carte de la zone approximative"
          src={mapUrl}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-md bg-white/92 px-3 py-2 text-sm font-semibold leading-6 text-night-950 shadow-lg">
          Zone approximative affichée : rayon d&apos;environ {approximateLocationRadiusKm} km.
          Le point GPS exact n&apos;est ni affiché ni stocké.
        </div>
      </div>
    </div>
  );
}

function padBounds(bounds: ApproxLocationCellBounds) {
  const padding = 0.02;

  return {
    minLatitude: Math.max(-90, bounds.minLatitude - padding),
    minLongitude: Math.max(-180, bounds.minLongitude - padding),
    maxLatitude: Math.min(90, bounds.maxLatitude + padding),
    maxLongitude: Math.min(180, bounds.maxLongitude + padding)
  };
}
