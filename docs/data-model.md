# Data Model Supabase

## Principes

- Supabase Auth gere l'identite primaire via `auth.users`.
- Les informations publiques et applicatives sont stockees dans `public.profiles`.
- Aucune position GPS precise n'est stockee pour le MVP.
- Aucun numero de chambre n'est stocke.
- Les visibilites temporaires sont gerees par date d'expiration.
- Les relations de contact controlent l'acces au chat.
- Le blocage et les suspensions doivent etre pris en compte dans toutes les requetes sensibles.

## Types enumeres

```sql
create type travel_type as enum ('business', 'personal', 'both');
create type current_intent as enum ('dinner', 'drink', 'networking', 'local_outing', 'meet');
create type contact_request_status as enum ('pending', 'accepted', 'declined', 'cancelled');
create type report_reason as enum ('inappropriate_behavior', 'harassment', 'fake_profile', 'offensive_content', 'other');
create type report_status as enum ('open', 'reviewed', 'dismissed', 'action_taken');
```

## Tables

### `profiles`

Profil applicatif lie a `auth.users`.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK, references `auth.users(id)` |
| `username` | `text` | Unique, requis |
| `age` | `int` | Requis, `age >= 18` |
| `avatar_url` | `text` | URL Supabase Storage |
| `bio` | `text` | Courte, limite applicative recommandee |
| `languages` | `text[]` | Langues parlees |
| `interests` | `text[]` | Centres d'interet |
| `travel_type` | `travel_type` | Professionnel, personnel, les deux |
| `approx_area` | `text` | Zone approximative |
| `is_adult_confirmed` | `boolean` | Obligatoire |
| `is_admin` | `boolean` | False par defaut |
| `is_suspended` | `boolean` | False par defaut |
| `deleted_at` | `timestamptz` | Suppression logique optionnelle |
| `created_at` | `timestamptz` | Defaut `now()` |
| `updated_at` | `timestamptz` | Defaut `now()` |

Contraintes:

- `age >= 18`
- `length(username) between 2 and 32`
- `approx_area` ne doit pas contenir de numero de chambre via validation applicative.

### `visibility_sessions`

Session de visibilite temporaire.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `user_id` | `uuid` | References `profiles(id)` |
| `intent` | `current_intent` | Intention active |
| `approx_area` | `text` | Copie de la zone au moment de l'activation |
| `visible_until` | `timestamptz` | Expiration |
| `created_at` | `timestamptz` | Defaut `now()` |
| `ended_at` | `timestamptz` | Fin manuelle optionnelle |

Un utilisateur est visible si:

```sql
visible_until > now()
and ended_at is null
```

Approche recommandee MVP:

- Une seule session active par utilisateur.
- A l'activation, terminer les anciennes sessions actives puis creer une nouvelle ligne.

### `contact_requests`

Demandes de contact entre deux utilisateurs.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `sender_id` | `uuid` | References `profiles(id)` |
| `receiver_id` | `uuid` | References `profiles(id)` |
| `status` | `contact_request_status` | `pending` par defaut |
| `message` | `text` | Message court optionnel |
| `created_at` | `timestamptz` | Defaut `now()` |
| `responded_at` | `timestamptz` | Date d'acceptation/refus |

Contraintes:

- `sender_id <> receiver_id`
- Eviter les doublons actifs via index unique partiel sur les demandes `pending` ou `accepted`.

### `conversations`

Conversation creee apres acceptation.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `contact_request_id` | `uuid` | References `contact_requests(id)` |
| `participant_a` | `uuid` | References `profiles(id)` |
| `participant_b` | `uuid` | References `profiles(id)` |
| `created_at` | `timestamptz` | Defaut `now()` |

### `messages`

Messages texte.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `conversation_id` | `uuid` | References `conversations(id)` |
| `sender_id` | `uuid` | References `profiles(id)` |
| `body` | `text` | Texte uniquement |
| `created_at` | `timestamptz` | Defaut `now()` |
| `read_at` | `timestamptz` | Optionnel |

Contraintes:

- `length(body) between 1 and 2000`
- `sender_id` doit etre participant de la conversation.

### `blocks`

Blocages utilisateur.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `blocker_id` | `uuid` | Utilisateur qui bloque |
| `blocked_id` | `uuid` | Utilisateur bloque |
| `created_at` | `timestamptz` | Defaut `now()` |

Contraintes:

- `blocker_id <> blocked_id`
- Unique `blocker_id, blocked_id`

### `reports`

Signalements.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `reporter_id` | `uuid` | Utilisateur qui signale |
| `reported_id` | `uuid` | Utilisateur signale |
| `reason` | `report_reason` | Motif |
| `details` | `text` | Optionnel |
| `status` | `report_status` | `open` par defaut |
| `created_at` | `timestamptz` | Defaut `now()` |
| `reviewed_by` | `uuid` | Admin optionnel |
| `reviewed_at` | `timestamptz` | Optionnel |

### `account_deletion_requests`

Option de suppression de compte.

| Colonne | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `user_id` | `uuid` | References `profiles(id)` |
| `requested_at` | `timestamptz` | Defaut `now()` |
| `processed_at` | `timestamptz` | Optionnel |

Pour le MVP, la suppression peut etre logique via `profiles.deleted_at`, puis une suppression physique geree par tache admin.

## Vues et fonctions recommandees

### Vue `discoverable_profiles`

Vue ou RPC retournant les profils visibles compatibles avec l'utilisateur courant:

- Meme `approx_area`.
- Visibilite non expiree.
- Compte non suspendu.
- Compte non supprime.
- Exclut l'utilisateur courant.
- Exclut les utilisateurs bloques dans les deux sens.

Une fonction RPC `get_discoverable_profiles()` est recommandee pour centraliser la logique et eviter les oublis cote frontend.

### Fonction `activate_visibility(intent, duration_hours)`

Fonction RPC recommandee:

- Verifie que l'utilisateur est majeur confirme.
- Verifie que le profil est complet.
- Verifie que le compte n'est pas suspendu.
- Termine les anciennes sessions actives.
- Cree une session avec `visible_until = now() + duration`.
- Limite `duration_hours` a 3, 6 ou 24.

## Index recommandes

```sql
create index profiles_approx_area_idx on profiles (approx_area);
create index profiles_suspended_deleted_idx on profiles (is_suspended, deleted_at);
create index visibility_active_idx on visibility_sessions (approx_area, visible_until) where ended_at is null;
create index contact_requests_sender_idx on contact_requests (sender_id);
create index contact_requests_receiver_idx on contact_requests (receiver_id);
create index conversations_participant_a_idx on conversations (participant_a);
create index conversations_participant_b_idx on conversations (participant_b);
create index messages_conversation_created_idx on messages (conversation_id, created_at);
create index blocks_blocker_idx on blocks (blocker_id);
create index blocks_blocked_idx on blocks (blocked_id);
create index reports_status_created_idx on reports (status, created_at);
```

