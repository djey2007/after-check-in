export type ReportReason =
  | "inappropriate_behavior"
  | "harassment"
  | "fake_profile"
  | "offensive_content"
  | "other";

export type ModerationFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialModerationFormState: ModerationFormState = {
  status: "idle",
  message: ""
};

export const reportReasonLabels: Record<ReportReason, string> = {
  inappropriate_behavior: "Comportement inapproprie",
  harassment: "Harcelement",
  fake_profile: "Faux profil",
  offensive_content: "Contenu offensant",
  other: "Autre"
};

export type AdminReport = {
  id: string;
  reporter_id: string;
  reported_id: string;
  reporter_username: string;
  reported_username: string;
  reason: ReportReason;
  details: string;
  status: "open" | "reviewed" | "dismissed";
  created_at: string;
};

export type AdminUser = {
  id: string;
  username: string;
  age: number;
  approx_area: string;
  is_admin: boolean;
  is_suspended: boolean;
  deleted_at: string | null;
  created_at: string;
};
