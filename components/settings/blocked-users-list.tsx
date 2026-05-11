import { Ban } from "lucide-react";
import { unblockUserAction } from "@/app/settings/actions";
import type { BlockedUser } from "@/lib/settings/types";

type BlockedUsersListProps = {
  blockedUsers: BlockedUser[];
};

export function BlockedUsersList({ blockedUsers }: BlockedUsersListProps) {
  return (
    <section className="rounded-md border border-night-900/10 bg-white p-5 shadow-sm">
      <Ban className="h-6 w-6 text-lagoon-500" />
      <h2 className="mt-4 text-xl font-bold tracking-normal text-night-950">
        Utilisateurs bloqués
      </h2>
      <p className="mt-2 text-sm leading-6 text-night-900/72">
        Les profils bloqués ne peuvent plus apparaître dans ta découverte.
      </p>

      {blockedUsers.length ? (
        <div className="mt-4 grid gap-3">
          {blockedUsers.map((blockedUser) => (
            <article
              key={blockedUser.block_id}
              className="rounded-md border border-night-900/10 bg-night-950/3 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-night-950">{blockedUser.username}</h3>
                  <p className="mt-1 text-sm text-night-900/62">{blockedUser.approx_area}</p>
                </div>
                <form action={unblockUserAction}>
                  <input type="hidden" name="blockedId" value={blockedUser.blocked_id} />
                  <button
                    type="submit"
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-night-900/15 bg-white px-4 py-2 text-sm font-semibold text-night-950 transition hover:border-lagoon-500/60 sm:w-auto"
                  >
                    Débloquer
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-night-950/5 p-4 text-sm text-night-900/68">
          Aucun utilisateur bloqué pour le moment.
        </p>
      )}
    </section>
  );
}
