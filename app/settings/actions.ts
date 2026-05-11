"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteAccountAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  const confirmation = String(formData.get("confirmation") ?? "").trim();

  if (confirmation !== "SUPPRIMER") {
    return;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const now = new Date().toISOString();

  await supabase
    .from("visibility_sessions")
    .update({ ended_at: now })
    .eq("user_id", user.id)
    .is("ended_at", null);

  await supabase
    .from("profiles")
    .update({
      deleted_at: now,
      is_suspended: true
    })
    .eq("id", user.id);

  await supabase.auth.signOut();
  redirect("/");
}
