# Checklist QA MVP

Cette checklist sert à valider After Check-in avant un test public limité.

## Préparation

- Vérifier que Vercel est déployé sur `https://after-check-in.vercel.app`.
- Vérifier que les variables Vercel sont présentes :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL=https://after-check-in.vercel.app`
- Vérifier dans Supabase Auth que l’URL de redirection de production existe :
  - `https://after-check-in.vercel.app/auth/callback`
- Créer au moins deux comptes de test avec deux emails différents.

## Parcours compte

- Créer un compte avec confirmation `J’ai plus de 18 ans`.
- Se connecter avec le compte créé.
- Se déconnecter.
- Se reconnecter.
- Vérifier qu’une page protégée redirige vers `/login` si l’utilisateur est déconnecté.

## Profil

- Compléter un profil avec pseudo, âge, bio, langues, centres d’intérêt, type de déplacement et zone approximative.
- Ajouter une photo JPG, PNG ou WebP inférieure à 2 Mo.
- Vérifier que la photo s’affiche dans le profil, le dashboard et la découverte.
- Vérifier qu’un âge inférieur à 18 ans est refusé.
- Vérifier qu’un numéro de chambre dans la bio ou la zone est refusé.
- Modifier le profil et vérifier que les changements sont conservés après reconnexion.

## Visibilité

- Activer une visibilité avec chaque intention :
  - Dîner
  - Boire un verre
  - Networking
  - Sortie locale
  - Rencontre
- Tester les durées 3h, 6h et 24h.
- Vérifier que la visibilité active apparaît sur le dashboard.
- Désactiver manuellement la visibilité.
- Vérifier qu’un profil sans visibilité active n’apparaît pas dans la découverte.

## Localisation approximative

- Renseigner deux profils dans la même zone texte et vérifier qu’ils se voient.
- Renseigner deux profils dans des zones différentes et vérifier qu’ils ne se voient pas.
- Tester le bouton de position approximative si le navigateur autorise la géolocalisation.
- Vérifier qu’aucune distance exacte ni position GPS précise n’est affichée.

## Découverte

- Depuis le compte A, activer la visibilité.
- Depuis le compte B dans la même zone, ouvrir `/discover`.
- Vérifier que le compte A apparaît.
- Ouvrir la fiche profil.
- Vérifier que l’intention, la zone approximative et la durée restante sont visibles.

## Demandes et chat

- Envoyer une demande de contact du compte B vers le compte A.
- Vérifier que la demande apparaît dans `/requests` côté A.
- Refuser une demande et vérifier qu’aucun chat ne s’ouvre.
- Envoyer une nouvelle demande de test si nécessaire.
- Accepter une demande et vérifier la redirection vers le chat.
- Envoyer un message depuis A.
- Vérifier que le message apparaît côté B sans rechargement manuel après quelques secondes.
- Vérifier que le chat ne permet que du texte.

## Blocage et signalement

- Depuis une fiche profil, bloquer un utilisateur.
- Vérifier que le profil bloqué disparaît de la découverte.
- Aller dans `/settings` et débloquer l’utilisateur.
- Signaler un utilisateur avec chaque motif disponible.
- Vérifier que le signalement apparaît dans `/admin` pour un compte admin.

## Admin

- Vérifier qu’un utilisateur non-admin est redirigé hors de `/admin`.
- Vérifier qu’un admin voit la liste des utilisateurs.
- Suspendre un compte non-admin.
- Vérifier que le compte suspendu ne peut plus apparaître en découverte.
- Réactiver le compte.
- Marquer un signalement comme traité.
- Ignorer un signalement.

## Paramètres et suppression

- Vérifier la liste des utilisateurs bloqués.
- Tenter une suppression sans écrire `SUPPRIMER` et vérifier que rien ne se passe.
- Supprimer un compte de test avec confirmation.
- Vérifier que le compte est déconnecté.
- Vérifier que son profil ne s’affiche plus en découverte.

## Pages publiques

- Vérifier `/`.
- Vérifier `/privacy`.
- Vérifier `/terms`.
- Vérifier les liens du footer.
- Vérifier le rendu mobile et desktop.

## Critères de validation MVP

- Aucun numéro de chambre n’est affiché.
- Aucune distance exacte n’est affichée.
- Aucune position GPS précise n’est affichée.
- Les profils visibles expirent ou peuvent être désactivés.
- Le chat n’est disponible qu’après acceptation.
- Le blocage retire les profils de la découverte.
- Les signalements sont visibles côté admin.
