import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiscoverableProfile } from "@/lib/discovery/types";

export async function getDiscoverableProfiles(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_discoverable_profiles");

  return {
    data: (data ?? []) as DiscoverableProfile[],
    error
  };
}
