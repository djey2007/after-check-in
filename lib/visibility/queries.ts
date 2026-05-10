import type { SupabaseClient } from "@supabase/supabase-js";
import type { VisibilitySession } from "@/lib/visibility/types";

export const visibilitySelect =
  "id, user_id, intent, approx_area, visible_until, ended_at, created_at";

export async function getCurrentVisibilitySession(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("visibility_sessions")
    .select(visibilitySelect)
    .eq("user_id", userId)
    .is("ended_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<VisibilitySession>();
}

