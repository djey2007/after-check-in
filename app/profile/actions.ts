"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileFormState, TravelType } from "@/lib/profile/types";

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function looksLikeRoomNumber(value: string) {
  return /\b(chambre|room|suite)\s*[a-z-]*\s*\d{1,5}\b/i.test(value);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue pendant l'enregistrement du profil.";
}

export async function saveProfileAction(
  _previousState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return {
        status: "error",
        message: "Configuration Supabase manquante."
      };
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        status: "error",
        message: "Tu dois etre connecte pour enregistrer ton profil."
      };
    }

    const username = String(formData.get("username") ?? "").trim();
    const age = Number(formData.get("age"));
    const bio = String(formData.get("bio") ?? "").trim();
    const approxArea = String(formData.get("approx_area") ?? "").trim();
    const travelType = String(formData.get("travel_type") ?? "business") as TravelType;
    const languages = splitList(formData.get("languages"));
    const interests = splitList(formData.get("interests"));

    if (username.length < 2 || username.length > 32) {
      return { status: "error", message: "Le pseudo doit contenir entre 2 et 32 caracteres." };
    }

    if (!Number.isInteger(age) || age < 18 || age > 120) {
      return { status: "error", message: "L'age doit etre superieur ou egal a 18 ans." };
    }

    if (bio.length > 240) {
      return { status: "error", message: "La bio doit faire 240 caracteres maximum." };
    }

    if (approxArea.length < 2 || approxArea.length > 80) {
      return { status: "error", message: "La zone approximative doit faire entre 2 et 80 caracteres." };
    }

    if (looksLikeRoomNumber(approxArea) || looksLikeRoomNumber(bio)) {
      return {
        status: "error",
        message: "Ne renseigne jamais de numero de chambre. Utilise seulement une zone approximative."
      };
    }

    if (!["business", "personal", "both"].includes(travelType)) {
      return { status: "error", message: "Type de deplacement invalide." };
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      age,
      bio,
      languages,
      interests,
      travel_type: travelType,
      approx_area: approxArea,
      is_adult_confirmed: true
    });

    if (error) {
      if (error.message.toLowerCase().includes("profiles")) {
        return {
          status: "error",
          message: "La table profiles n'existe pas encore dans Supabase. Execute la migration SQL fournie dans le projet."
        };
      }

      return { status: "error", message: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { status: "success", message: "Profil enregistre." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}

