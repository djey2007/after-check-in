import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/profile/types";

export const profileSelect =
  "id, username, age, avatar_url, bio, languages, interests, travel_type, approx_area, location_cell, is_adult_confirmed, is_admin";

export async function getProfileByUserId(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", userId)
    .maybeSingle<Profile>();
}
