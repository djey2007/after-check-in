"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileFormState, TravelType } from "@/lib/profile/types";
import { isApproxLocationCell } from "@/lib/location/cell";

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

function getAvatarExtension(type: string) {
  if (type === "image/jpeg") {
    return "jpg";
  }

  if (type === "image/png") {
    return "png";
  }

  if (type === "image/webp") {
    return "webp";
  }

  return null;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

    return "Une erreur inattendue est survenue pendant l’enregistrement du profil.";
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
        message: "Tu dois être connecté pour enregistrer ton profil."
      };
    }

    const username = String(formData.get("username") ?? "").trim();
    const age = Number(formData.get("age"));
    const bio = String(formData.get("bio") ?? "").trim();
    const approxArea = String(formData.get("approx_area") ?? "").trim();
    const locationCell = String(formData.get("location_cell") ?? "").trim();
    const travelType = String(formData.get("travel_type") ?? "business") as TravelType;
    const languages = splitList(formData.get("languages"));
    const interests = splitList(formData.get("interests"));
    const avatar = formData.get("avatar");

    if (username.length < 2 || username.length > 32) {
      return { status: "error", message: "Le pseudo doit contenir entre 2 et 32 caractères." };
    }

    if (!Number.isInteger(age) || age < 18 || age > 120) {
      return { status: "error", message: "L’âge doit être supérieur ou égal à 18 ans." };
    }

    if (bio.length > 240) {
      return { status: "error", message: "La bio doit faire 240 caractères maximum." };
    }

    if (approxArea.length < 2 || approxArea.length > 80) {
      return { status: "error", message: "La zone approximative doit faire entre 2 et 80 caractères." };
    }

    if (looksLikeRoomNumber(approxArea) || looksLikeRoomNumber(bio)) {
      return {
        status: "error",
        message: "Ne renseigne jamais de numéro de chambre. Utilise seulement une zone approximative."
      };
    }

    if (locationCell && !isApproxLocationCell(locationCell)) {
      return { status: "error", message: "La zone GPS approximative est invalide." };
    }

    if (!["business", "personal", "both"].includes(travelType)) {
      return { status: "error", message: "Type de déplacement invalide." };
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    let avatarUrl = existingProfile?.avatar_url ?? null;

    if (avatar instanceof File && avatar.size > 0) {
      const extension = getAvatarExtension(avatar.type);

      if (!extension) {
        return { status: "error", message: "La photo doit être en JPG, PNG ou WebP." };
      }

      if (avatar.size > 2 * 1024 * 1024) {
        return { status: "error", message: "La photo doit faire 2 Mo maximum." };
      }

      const path = `${user.id}/avatar-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(path, avatar, {
          cacheControl: "3600",
          contentType: avatar.type,
          upsert: true
        });

      if (uploadError) {
        return { status: "error", message: uploadError.message };
      }

      const { data: publicUrl } = supabase.storage.from("profile-photos").getPublicUrl(path);
      avatarUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      age,
      avatar_url: avatarUrl,
      bio,
      languages,
      interests,
      travel_type: travelType,
      approx_area: approxArea,
      location_cell: locationCell || null,
      is_adult_confirmed: true
    });

    if (error) {
      if (error.message.toLowerCase().includes("profiles")) {
        return {
          status: "error",
          message: "La table profiles n’existe pas encore dans Supabase. Exécute la migration SQL fournie dans le projet."
        };
      }

      return { status: "error", message: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { status: "success", message: "Profil enregistré." };
  } catch (error) {
    return { status: "error", message: getErrorMessage(error) };
  }
}
