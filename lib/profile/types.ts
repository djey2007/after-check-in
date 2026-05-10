export type TravelType = "business" | "personal" | "both";

export type Profile = {
  id: string;
  username: string;
  age: number;
  avatar_url: string | null;
  bio: string | null;
  languages: string[];
  interests: string[];
  travel_type: TravelType;
  approx_area: string;
  location_cell: string | null;
  is_adult_confirmed: boolean;
};

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialProfileFormState: ProfileFormState = {
  status: "idle",
  message: ""
};

export const travelTypeLabels: Record<TravelType, string> = {
  business: "Professionnel",
  personal: "Personnel",
  both: "Les deux"
};
