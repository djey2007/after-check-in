export type VisibilityIntent = "dinner" | "drink" | "networking" | "local_outing" | "meet";

export type VisibilitySession = {
  id: string;
  user_id: string;
  intent: VisibilityIntent;
  approx_area: string;
  visible_until: string;
  ended_at: string | null;
  created_at: string;
};

export type VisibilityFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialVisibilityFormState: VisibilityFormState = {
  status: "idle",
  message: ""
};

export const visibilityIntentLabels: Record<VisibilityIntent, string> = {
  dinner: "Diner",
  drink: "Boire un verre",
  networking: "Networking",
  local_outing: "Sortie locale",
  meet: "Rencontre"
};

export const visibilityDurationLabels: Record<3 | 6 | 24, string> = {
  3: "3 heures",
  6: "6 heures",
  24: "24 heures"
};

