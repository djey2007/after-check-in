export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !anonKey) {
    return null;
  }

  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

  return { url, anonKey };
}

export function getMissingSupabaseMessage() {
  return "Configuration Supabase manquante. Ajoute NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local et dans Vercel.";
}
