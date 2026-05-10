"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { VisibilityFormState, VisibilityIntent } from "@/lib/visibility/types";

const allowedDurations = new Set(["3", "6", "24"]);
const allowedIntents = new Set([
  "dinner",
  "drink",
  "networking",
  "local_outing",
  "meet"
]);

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue pendant l'activation de la visibilite.";
}

export async function activateVisibilityAction(
  _previousState: VisibilityFormState,
  formData: FormData
): Promise<VisibilityFormState> {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return { status: "error", message: "Configuration Supabase manquante." };
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { status: "error", message: "Tu dois etre connecte pour activer ta visibilite." };
    }

    const intent = String(formData.get("intent") ?? "") as VisibilityIntent;
    const duration = String(formData.get("duration") ?? "");

    if (!allowedIntents.has(intent)) {
      return { status: "error", message: "Choisis une intention valide." };
    }

    if (!allowedDurations.has(duration)) {
      return { status: "error", message: "Choisis une duree valide." };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("approx_area, location_cell, is_suspended, deleted_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      return { status: "error", message: profileError.message };
    }

    if (!profile) {
      return {
        status: "error",
        message: "Complete ton profil avant d'activer la visibilite."
      };
    }

    if (profile.is_suspended || profile.deleted_at) {
      return {
        status: "error",
        message: "Ce compte ne peut pas activer la visibilite."
      };
    }

    const hours = Number(duration) as 3 | 6 | 24;
    const visibleUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    await supabase
      .from("visibility_sessions")
      .update({ ended_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("ended_at", null);

    const { error } = await supabase.from("visibility_sessions").insert({
      user_id: user.id,
      intent,
      approx_area: profile.approx_area,
      location_cell: profile.location_cell,
      visible_until: visibleUntil,
      ended_at: null
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/visibility");
    revalidatePath("/profile");

    return { status: "success", message: "Visibilite activee." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function stopVisibilityAction() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase
    .from("visibility_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("ended_at", null);

  revalidatePath("/dashboard");
  revalidatePath("/visibility");
}
