# Technical Architecture

## Vue d'ensemble

After Check-in sera une application Next.js TypeScript connectee a Supabase pour l'authentification, la base PostgreSQL et le stockage des photos de profil.

Architecture cible:

- Next.js App Router.
- TypeScript strict.
- Tailwind CSS.
- Supabase Auth pour les sessions.
- Supabase PostgreSQL avec RLS.
- Supabase Storage pour les avatars.
- Vercel pour l'hebergement.

## Structure projet proposee

```text
after-check-in/
  app/
    (public)/
      page.tsx
    (auth)/
      login/
        page.tsx
      signup/
        page.tsx
    (app)/
      dashboard/
        page.tsx
      profile/
        page.tsx
      visibility/
        page.tsx
      discover/
        page.tsx
      requests/
        page.tsx
      chat/
        [conversationId]/
          page.tsx
      settings/
        page.tsx
    admin/
      users/
        page.tsx
      reports/
        page.tsx
    api/
      webhooks/
        route.ts
    layout.tsx
    globals.css
  components/
    auth/
    chat/
    discovery/
    forms/
    layout/
    moderation/
    profile/
    ui/
    visibility/
  docs/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    validations/
    utils/
    constants.ts
  middleware.ts
  supabase/
    migrations/
    seed.sql
  types/
    database.ts
```

## Pages Next.js a creer

### Public

- `/`
  - Page d'accueil publique.
  - Concept, benefices, CTA inscription et connexion.

### Auth

- `/signup`
  - Inscription email.
  - Confirmation "J'ai plus de 18 ans".

- `/login`
  - Connexion email.

### Application connectee

- `/dashboard`
  - Resume du profil, intention, visibilite, demandes recentes.

- `/profile`
  - Creation et edition du profil.

- `/visibility`
  - Choix de l'intention.
  - Activation 3h, 6h, 24h.
  - Desactivation manuelle.

- `/discover`
  - Liste des profils visibles dans la meme zone approximative.
  - Acces fiche profil.

- `/discover/[profileId]`
  - Fiche profil.
  - Envoyer une demande.
  - Bloquer ou signaler.

- `/requests`
  - Demandes envoyees et recues.
  - Accepter ou refuser.

- `/chat/[conversationId]`
  - Chat texte apres acceptation.

- `/settings`
  - Deconnexion.
  - Confidentialite.
  - Suppression du compte.

### Admin

- `/admin/users`
  - Liste utilisateurs.
  - Suspension manuelle.

- `/admin/reports`
  - Liste signalements.
  - Changement de statut.

## Composants React necessaires

### Layout

- `AppShell`
- `PublicHeader`
- `AppHeader`
- `BottomNav`
- `PageContainer`
- `EmptyState`
- `LoadingState`
- `ErrorState`

### Auth

- `SignupForm`
- `LoginForm`
- `AdultConfirmationCheckbox`
- `LogoutButton`

### Profil

- `ProfileForm`
- `AvatarUploader`
- `LanguageSelector`
- `InterestInput`
- `TravelTypeSelector`
- `ApproxAreaInput`
- `ProfileCard`
- `ProfileDetails`

### Intention et visibilite

- `IntentSelector`
- `VisibilityDurationSelector`
- `VisibilityStatus`
- `VisibilityCountdown`
- `VisibilityActivationPanel`

### Decouverte

- `DiscoverList`
- `DiscoverProfileCard`
- `IntentBadge`
- `RemainingTimeBadge`
- `SafetyReminder`

### Contact

- `ContactRequestButton`
- `ContactRequestList`
- `ContactRequestItem`
- `RequestStatusBadge`

### Chat

- `ConversationList`
- `MessageList`
- `MessageBubble`
- `MessageComposer`

### Moderation

- `BlockUserButton`
- `ReportUserDialog`
- `ReportReasonSelect`
- `AdminUserTable`
- `AdminReportsTable`
- `SuspendUserButton`

### UI commune

- `Button`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `Badge`
- `Card`
- `Dialog`
- `Tabs`
- `Toast`

## Architecture Supabase

### Clients

- `lib/supabase/client.ts`: client navigateur.
- `lib/supabase/server.ts`: client server components/actions.
- `middleware.ts`: rafraichissement des sessions et protection des routes.

### Server actions ou route handlers

Actions recommandees:

- `createProfile`
- `updateProfile`
- `uploadAvatar`
- `activateVisibility`
- `endVisibility`
- `sendContactRequest`
- `respondToContactRequest`
- `sendMessage`
- `blockUser`
- `reportUser`
- `deleteAccount`
- `suspendUser`

Les actions sensibles doivent verifier l'utilisateur courant cote serveur, meme si RLS est activee.

## Gestion de l'expiration de visibilite

Le MVP peut fonctionner sans cron:

- Les requetes de decouverte filtrent `visible_until > now()`.
- L'interface affiche le temps restant cote client.
- Une session expiree n'est simplement plus retournee.

Evolution possible:

- Tache planifiee pour marquer les sessions expirees.
- Notifications avant expiration.

## Variables d'environnement

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` ne doit jamais etre exposee au navigateur. Elle doit etre reservee aux operations serveur/admin strictement necessaires.

## Strategie de tests

### Etape MVP

- Tests manuels par parcours.
- Validation mobile et desktop.
- Tests RLS via utilisateurs distincts.
- Tests de non-regression sur les flux critiques.

### Evolution

- Tests unitaires pour validations.
- Tests d'integration pour actions serveur.
- Tests e2e Playwright pour le parcours principal.

## Parcours de test principal

1. Creer utilisateur A.
2. Completer profil A.
3. Activer visibilite A dans "Paris - Massy".
4. Creer utilisateur B.
5. Completer profil B dans "Paris - Massy".
6. B voit A dans la decouverte.
7. B envoie une demande.
8. A accepte.
9. A et B echangent dans le chat.
10. A bloque B.
11. B ne peut plus contacter A.
12. A signale B.
13. L'admin voit le signalement et suspend B.

## Plan de developpement testable

### Phase 1: Socle Next.js

Livrables:

- Projet Next.js initialise.
- Tailwind configure.
- Layout public et page d'accueil.

Test:

- L'application demarre en local.
- La page d'accueil est responsive.

### Phase 2: Authentification

Livrables:

- Connexion Supabase.
- Inscription.
- Connexion.
- Deconnexion.
- Protection des routes connectees.

Test:

- Un utilisateur peut creer un compte, se connecter et se deconnecter.

### Phase 3: Profil

Livrables:

- Table `profiles`.
- Formulaire de profil.
- Upload avatar.
- Validation age et zone approximative.

Test:

- Un profil complet est enregistre et relu.

### Phase 4: Visibilite

Livrables:

- Table `visibility_sessions`.
- Choix intention.
- Activation duree.
- Desactivation.

Test:

- Une visibilite active apparait jusqu'a `visible_until`.

### Phase 5: Decouverte

Livrables:

- RPC ou vue de decouverte.
- Liste profils visibles.
- Fiche profil.

Test:

- Deux utilisateurs dans la meme zone se voient sans localisation precise.

### Phase 6: Demandes et chat

Livrables:

- Demandes de contact.
- Acceptation/refus.
- Conversations et messages texte.

Test:

- Le chat est inaccessible avant acceptation et disponible apres.

### Phase 7: Moderation et admin

Livrables:

- Blocage.
- Signalement.
- Admin users.
- Admin reports.
- Suspension.

Test:

- Un blocage masque les profils.
- Un signalement apparait dans l'admin.
- Un compte suspendu ne peut plus etre visible.

### Phase 8: Durcissement

Livrables:

- Revue RLS.
- Etats vides et erreurs.
- Responsive complet.
- Nettoyage UX.

Test:

- Parcours complet valide sur mobile et desktop.

