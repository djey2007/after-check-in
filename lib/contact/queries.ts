import type { SupabaseClient } from "@supabase/supabase-js";
import { profileSelect } from "@/lib/profile/queries";
import type {
  ContactRequest,
  ContactRequestWithProfiles,
  Conversation,
  Message
} from "@/lib/contact/types";

const contactRequestSelect = "id, sender_id, receiver_id, status, message, created_at, responded_at";
const conversationSelect = "id, contact_request_id, participant_a, participant_b, created_at";

export async function getContactRequestsForUser(supabase: SupabaseClient, userId: string) {
  const { data: requests, error } = await supabase
    .from("contact_requests")
    .select(contactRequestSelect)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .returns<ContactRequest[]>();

  if (error || !requests?.length) {
    return { data: [] as ContactRequestWithProfiles[], error };
  }

  const profileIds = Array.from(
    new Set(requests.flatMap((request) => [request.sender_id, request.receiver_id]))
  );
  const requestIds = requests.map((request) => request.id);

  const [{ data: profiles }, { data: conversations }] = await Promise.all([
    supabase.from("profiles").select(profileSelect).in("id", profileIds),
    supabase.from("conversations").select(conversationSelect).in("contact_request_id", requestIds)
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const conversationMap = new Map(
    ((conversations ?? []) as Conversation[]).map((conversation) => [
      conversation.contact_request_id,
      conversation
    ])
  );

  return {
    data: requests.map((request) => ({
      ...request,
      sender: profileMap.get(request.sender_id) ?? null,
      receiver: profileMap.get(request.receiver_id) ?? null,
      conversation: conversationMap.get(request.id) ?? null
    })),
    error: null
  };
}

export async function getConversationForUser(
  supabase: SupabaseClient,
  conversationId: string,
  userId: string
) {
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(conversationSelect)
    .eq("id", conversationId)
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .maybeSingle<Conversation>();

  return { data: conversation, error };
}

export async function getMessagesForConversation(supabase: SupabaseClient, conversationId: string) {
  return supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, created_at, read_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .returns<Message[]>();
}

