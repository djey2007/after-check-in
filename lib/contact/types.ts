import type { Profile } from "@/lib/profile/types";

export type ContactRequestStatus = "pending" | "accepted" | "declined" | "cancelled";

export type ContactRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: ContactRequestStatus;
  message: string | null;
  created_at: string;
  responded_at: string | null;
};

export type Conversation = {
  id: string;
  contact_request_id: string;
  participant_a: string;
  participant_b: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export type ContactRequestWithProfiles = ContactRequest & {
  sender: Profile | null;
  receiver: Profile | null;
  conversation: Conversation | null;
};

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: ""
};

