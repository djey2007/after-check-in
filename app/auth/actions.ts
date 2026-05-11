"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMissingSupabaseMessage } from "@/lib/supabase/config";
import type { AuthFormState } from "@/lib/auth/form-state";

function getAuthExceptionMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur inattendue est survenue. Verifie la configuration Supabase puis reessaie.";
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

function getSafeRedirectPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return { status: "error", message: getMissingSupabaseMessage() };
    }

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const isAdultConfirmed = formData.get("isAdultConfirmed") === "on";

    if (!email || !password) {
      return { status: "error", message: "Email et mot de passe sont requis." };
    }

    if (password.length < 8) {
      return { status: "error", message: "Le mot de passe doit contenir au moins 8 caracteres." };
    }

    if (!isAdultConfirmed) {
      return {
        status: "error",
        message: "Tu dois confirmer que tu as plus de 18 ans pour utiliser After Check-in."
      };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
        data: {
          is_adult_confirmed: true
        }
      }
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    return {
      status: "success",
      message:
        "Compte cree. Si la confirmation email est activee dans Supabase, verifie ta boite mail avant connexion."
    };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    return { status: "error", message: getAuthExceptionMessage(error) };
  }
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  try {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
      return { status: "error", message: getMissingSupabaseMessage() };
    }

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

    if (!email || !password) {
      return { status: "error", message: "Email et mot de passe sont requis." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    redirect(getSafeRedirectPath(redirectTo) as never);
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    return { status: "error", message: getAuthExceptionMessage(error) };
  }
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
