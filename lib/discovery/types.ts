import type { TravelType } from "@/lib/profile/types";
import type { VisibilityIntent } from "@/lib/visibility/types";

export type DiscoverableProfile = {
  id: string;
  username: string;
  age: number;
  avatar_url: string | null;
  bio: string;
  languages: string[];
  interests: string[];
  travel_type: TravelType;
  approx_area: string;
  current_intent: VisibilityIntent;
  visible_until: string;
  remaining_seconds: number;
};

