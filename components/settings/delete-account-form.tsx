import { Trash2 } from "lucide-react";
import { deleteAccountAction } from "@/app/settings/actions";

export function DeleteAccountForm() {
  return (
    <section className="rounded-md border border-red-200 bg-red-50 p-5 text-night-950">
      <Trash2 className="h-6 w-6 text-red-700" />
      <h2 className="mt-4 text-xl font-bold tracking-normal">Supprimer le compte</h2>
      <p className="mt-2 text-sm leading-6 text-night-900/72">
        Cette action désactive ton profil, coupe ta visibilité et te déconnecte.
        Ton profil ne sera plus visible dans la découverte.
      </p>

      <form action={deleteAccountAction} className="mt-4 grid gap-3">
        <label className="grid gap-2 text-sm font-semibold">
          Écris SUPPRIMER pour confirmer
          <input
            name="confirmation"
            className="min-h-11 rounded-md border border-red-200 bg-white px-4 text-base font-normal outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-200"
            required
          />
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Supprimer mon compte
        </button>
      </form>
    </section>
  );
}
