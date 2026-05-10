"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContactFormState } from "@/lib/contact/types";

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

export async function sendContactRequestAction(
  _previousState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
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

    const receiverId = String(formData.get("receiverId") ?? "");
    const message = String(formData.get("message") ?? "").trim();

    if (!receiverId || receiverId === user.id) {
      return { status: "error", message: "Destinataire invalide." };
    }

    if (message.length > 240) {
      return { status: "error", message: "Le message doit faire 240 caracteres maximum." };
    }

    const { error } = await supabase.from("contact_requests").insert({
      sender_id: user.id,
      receiver_id: receiverId,
      message,
      status: "pending"
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    revalidatePath("/requests");
    revalidatePath(`/discover/${receiverId}`);

    return { status: "success", message: "Demande envoyee." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

export async function respondToContactRequestAction(formData: FormData) {
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

  const requestId = String(formData.get("requestId") ?? "");
  const response = String(formData.get("response") ?? "");

  if (!requestId || !["accepted", "declined"].includes(response)) {
    return;
  }

  const { data: request, error: requestError } = await supabase
    .from("contact_requests")
    .select("id, sender_id, receiver_id, status")
    .eq("id", requestId)
    .eq("receiver_id", user.id)
    .eq("status", "pending")
    .maybeSingle();

  if (requestError || !request) {
    return;
  }

  await supabase
    .from("contact_requests")
    .update({ status: response, responded_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("receiver_id", user.id);

  if (response === "accepted") {
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("contact_request_id", requestId)
      .maybeSingle();

    const conversationId = existingConversation?.id;

    if (conversationId) {
      redirect(`/chat/${conversationId}` as never);
    }

    const { data: conversation } = await supabase
      .from("conversations")
      .insert({
        contact_request_id: request.id,
        participant_a: request.sender_id,
        participant_b: request.receiver_id
      })
      .select("id")
      .single();

    if (conversation?.id) {
      redirect(`/chat/${conversation.id}` as never);
    }
  }

  revalidatePath("/requests");
}

export async function sendMessageAction(formData: FormData) {
  try {
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

    const conversationId = String(formData.get("conversationId") ?? "");
    const body = String(formData.get("body") ?? "").trim();

    if (!conversationId || !body || body.length > 2000) {
      return;
    }

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body
    });

    revalidatePath(`/chat/${conversationId}`);
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }
  }
}
