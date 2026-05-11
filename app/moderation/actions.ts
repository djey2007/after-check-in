"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ModerationFormState, ReportReason } from "@/lib/moderation/types";

const allowedReasons = new Set<ReportReason>([
  "inappropriate_behavior",
  "harassment",
  "fake_profile",
  "offensive_content",
  "other"
]);

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

export async function blockUserAction(formData: FormData) {
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

  const blockedId = String(formData.get("blockedId") ?? "");

  if (!blockedId || blockedId === user.id) {
    return;
  }

  await supabase.from("blocks").upsert({
    blocker_id: user.id,
    blocked_id: blockedId
  });

  revalidatePath("/discover");
  redirect("/discover");
}

export async function reportUserAction(
  _previousState: ModerationFormState,
  formData: FormData
): Promise<ModerationFormState> {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return { status: "error", message: "Configuration Supabase manquante." };
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { status: "error", message: "Tu dois etre connecte." };
    }

    const reportedId = String(formData.get("reportedId") ?? "");
    const reason = String(formData.get("reason") ?? "") as ReportReason;
    const details = String(formData.get("details") ?? "").trim();

    if (!reportedId || reportedId === user.id) {
      return { status: "error", message: "Profil signale invalide." };
    }

    if (!allowedReasons.has(reason)) {
      return { status: "error", message: "Motif de signalement invalide." };
    }

    if (details.length > 500) {
      return { status: "error", message: "Le detail doit faire 500 caracteres maximum." };
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_id: reportedId,
      reason,
      details
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/admin");
    return { status: "success", message: "Signalement envoye a la moderation." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function setUserSuspendedAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const targetUserId = String(formData.get("targetUserId") ?? "");
  const suspended = String(formData.get("suspended") ?? "") === "true";

  if (!targetUserId) {
    return;
  }

  await supabase.rpc("admin_set_user_suspended", {
    target_user_id: targetUserId,
    suspended
  });

  revalidatePath("/admin");
}

export async function setReportStatusAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const reportId = String(formData.get("reportId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!reportId || !["reviewed", "dismissed"].includes(status)) {
    return;
  }

  await supabase.rpc("admin_set_report_status", {
    report_id: reportId,
    new_status: status
  });

  revalidatePath("/admin");
}
