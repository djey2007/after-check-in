# Security & Privacy

## Principes de securite

- Service reserve aux utilisateurs majeurs.
- Confirmation "J'ai plus de 18 ans" obligatoire avant toute visibilite.
- Aucune localisation precise.
- Aucun numero de chambre.
- Aucune distance exacte.
- Quand la position approximative est activee, l'interface annonce un rayon d'environ 3 km. Il ne s'agit pas d'une position exacte.
- Chat uniquement apres acceptation d'une demande de contact.
- Blocage et signalement disponibles des le MVP.
- Les rencontres doivent etre recommandees dans des lieux publics: lobby, bar, restaurant.

## Donnees sensibles interdites

Le produit ne doit pas collecter ni afficher:

- Numero de chambre.
- Coordonnees GPS exactes.
- Distance exacte entre utilisateurs.
- Adresse precise d'hotel.
- Images dans le chat en V1.
- Audio ou video en V1.

## Validation applicative

Les formulaires doivent:

- Refuser les ages inferieurs a 18.
- Limiter la longueur des bios, messages et details de signalement.
- Filtrer les zones approximatives trop precises.
- Ajouter un avertissement si un utilisateur saisit une zone ressemblant a un numero de chambre.
- Interdire les champs inutiles de localisation precise.

## Row Level Security Supabase

RLS doit etre activee sur toutes les tables applicatives.

### `profiles`

Regles recommandees:

- Un utilisateur authentifie peut lire son propre profil.
- Un utilisateur authentifie peut lire les profils retournes par la decouverte, via RPC securisee.
- Un utilisateur peut creer son propre profil si `id = auth.uid()`.
- Un utilisateur peut modifier son propre profil, sauf `is_admin`, `is_suspended`, `deleted_at`.
- Seuls les admins peuvent lire la liste complete des utilisateurs.
- Seuls les admins peuvent modifier `is_suspended`.

### `visibility_sessions`

Regles recommandees:

- Un utilisateur peut lire ses propres sessions.
- La decouverte publique entre utilisateurs connectes doit passer par une vue ou RPC securisee.
- Un utilisateur peut creer une session uniquement pour lui-meme.
- Un utilisateur peut terminer ses propres sessions.
- Les comptes suspendus ne peuvent pas creer de visibilite.

### `contact_requests`

Regles recommandees:

- Un utilisateur peut lire les demandes ou il est `sender_id` ou `receiver_id`.
- Un utilisateur peut creer une demande ou `sender_id = auth.uid()`.
- Un utilisateur ne peut pas creer de demande vers lui-meme.
- Un utilisateur ne peut pas creer de demande vers un utilisateur qui l'a bloque ou qu'il a bloque.
- Seul le receveur peut accepter ou refuser une demande.
- Le statut `accepted` doit declencher ou permettre la creation d'une conversation.

### `conversations`

Regles recommandees:

- Un utilisateur peut lire une conversation seulement s'il est participant.
- Une conversation ne peut exister que pour une demande acceptee.
- Les participants doivent correspondre au sender et receiver de la demande acceptee.

### `messages`

Regles recommandees:

- Un utilisateur peut lire les messages d'une conversation dont il est participant.
- Un utilisateur peut envoyer un message seulement dans une conversation dont il est participant.
- Un utilisateur bloque ne doit plus pouvoir envoyer de message a la personne qui l'a bloque.
- Pas d'upload d'image, audio ou video dans le chat.

### `blocks`

Regles recommandees:

- Un utilisateur peut creer un blocage ou `blocker_id = auth.uid()`.
- Un utilisateur peut lire ses propres blocages.
- Un utilisateur peut supprimer ses propres blocages.
- Les blocages doivent etre appliques dans la decouverte, les demandes et le chat.

### `reports`

Regles recommandees:

- Un utilisateur peut creer un signalement ou `reporter_id = auth.uid()`.
- Un utilisateur peut lire ses propres signalements.
- Un utilisateur signale ne peut pas lire les signalements qui le concernent.
- Seuls les admins peuvent lire tous les signalements et modifier leur statut.

### `account_deletion_requests`

Regles recommandees:

- Un utilisateur peut creer une demande pour lui-meme.
- Un utilisateur peut lire sa propre demande.
- Seuls les admins ou une fonction service-role peuvent marquer la demande comme traitee.

## Supabase Storage

Bucket recommande:

- `profile-photos`

Regles:

- Upload autorise uniquement par l'utilisateur connecte dans un chemin lie a son `auth.uid()`.
- Lecture publique possible pour les avatars, ou lecture authentifiee si l'on veut durcir la confidentialite.
- Taille maximale limitee.
- Types autorises: JPEG, PNG, WebP.
- Pas d'images dans le chat.

## Administration

L'acces admin doit etre protege par:

- `profiles.is_admin = true`.
- Verification cote serveur dans les routes admin.
- RLS dediee.

Actions admin MVP:

- Voir les utilisateurs.
- Voir les signalements.
- Suspendre ou reactiver un compte.
- Marquer un signalement comme traite.

## Suppression de compte

Approche MVP:

- Marquer `profiles.deleted_at`.
- Terminer les visibilites actives.
- Masquer le profil dans la decouverte.
- Bloquer la creation de demandes et messages.

Approche future:

- Suppression physique differee.
- Anonymisation des messages si necessaire.
- Export de donnees utilisateur.

## Recommandations UX de securite

Afficher des rappels discrets:

- "Retrouvez-vous dans un lieu public."
- "Ne partagez pas votre numero de chambre."
- "Gardez votre localisation approximative."
- "Vous controlez votre visibilite."
