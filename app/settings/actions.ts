"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DeleteAccountFormState = {
  status: "idle" | "error";
  message: string;
};

export async function unblockUserAction(formData: FormData) {
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

  if (!blockedId) {
    return;
  }

  await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", blockedId);

  revalidatePath("/settings");
  revalidatePath("/discover");
}

export async function deleteAccountAction(
  _previousState: DeleteAccountFormState,
  formData: FormData
): Promise<DeleteAccountFormState> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { status: "error", message: "Configuration Supabase manquante." };
  }

  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (confirmation !== "SUPPRIMER") {
    return {
      status: "error",
      message: "Écris SUPPRIMER pour confirmer la suppression du compte."
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Tu dois être connecté pour supprimer ton compte." };
  }

  const { error } = await supabase.rpc("soft_delete_current_user");

  if (error) {
    return {
      status: "error",
      message: `La suppression du compte a échoué : ${error.message}`
    };
  }

  await supabase.auth.signOut();
  redirect("/");
}
