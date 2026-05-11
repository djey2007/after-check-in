# After Check-in

After Check-in est une application web sociale pour les personnes qui dorment a l'hotel et souhaitent rompre la solitude d'un deplacement: diner, boire un verre, networker, decouvrir une sortie locale ou faire une rencontre, selon leur intention du moment.

Le MVP vise une application responsive, mobile-first, testable rapidement dans un navigateur avant une eventuelle application mobile native.

## Positionnement

After Check-in n'est pas une application adulte. Le produit doit rester social, convivial, securise et utile pour les voyageurs seuls, professionnels en deplacement, consultants, commerciaux et personnes en etape. L'intention "Rencontre" existe, mais ne doit pas dominer l'experience.

## Stack cible

- Frontend: Next.js, TypeScript
- UI: Tailwind CSS
- Backend: Supabase
- Authentification: Supabase Auth
- Base de donnees: PostgreSQL via Supabase
- Images de profil: Supabase Storage
- Hebergement cible: Vercel

## Lancer le projet web

```bash
npm install
npm run dev
```

L'application est ensuite disponible sur:

```text
http://localhost:3000
```

Commandes utiles:

```bash
npm run typecheck
npm run build
```

## Configuration Supabase

Creer un fichier `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Variables requises:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Dans Vercel, ajouter les memes variables dans **Project Settings > Environment Variables**.

Pour l'authentification email Supabase:

- Activer Email provider dans Supabase Auth.
- Ajouter `http://localhost:3000/auth/callback` dans les redirect URLs de developpement.
- Ajouter `https://after-check-in.vercel.app/auth/callback` dans les redirect URLs de production.

## Base de donnees Supabase

Les migrations SQL sont dans:

```text
supabase/migrations/
```

Pour creer la table de profils:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0001_profiles.sql`.
4. Cliquer sur **Run**.

La table `profiles` active Row Level Security et permet a chaque utilisateur
connecte de creer, lire et modifier uniquement son propre profil.

Pour activer la visibilite temporaire:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0002_visibility.sql`.
4. Cliquer sur **Run**.

La table `visibility_sessions` stocke l'intention du moment et la date
d'expiration de visibilite.

Pour la decouverte:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0003_discovery.sql`.
4. Cliquer sur **Run**.

La fonction `get_discoverable_profiles()` renvoie uniquement les profils
visibles dans la meme zone approximative, en excluant les comptes bloques,
suspendus ou expires.

Pour les demandes de contact et le chat:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0004_contact_chat.sql`.
4. Cliquer sur **Run**.

Les tables `contact_requests`, `conversations` et `messages` activent Row
Level Security. Le chat est lisible et utilisable uniquement par les deux
participants d'une conversation acceptee.

Pour activer la geolocalisation approximative optionnelle:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0005_approx_location.sql`.
4. Cliquer sur **Run**.

La position GPS exacte n'est jamais stockee. Le navigateur calcule une cellule
approximative et la decouverte utilise cette cellule quand elle existe, avec un
repli sur la zone texte.

Pour activer signalements et admin minimal:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0006_reports_admin.sql`.
4. Cliquer sur **Run**.
5. Promouvoir manuellement le premier admin dans Supabase:

   ```sql
   update public.profiles
   set is_admin = true
   where id = 'USER_ID_A_PROMOUVOIR';
   ```

L'espace `/admin` liste les utilisateurs et les signalements, et permet de
suspendre ou reactiver un compte.

Pour permettre a l'admin de cloturer les signalements:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0008_admin_report_status.sql`.
4. Cliquer sur **Run**.

Pour activer le stockage des photos de profil:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0007_profile_photos_storage.sql`.
4. Cliquer sur **Run**.

Le bucket `profile-photos` accepte JPG, PNG et WebP jusqu'a 2 Mo.

## Suppression de compte

La page `/settings` permet une suppression douce du compte: le profil est marque
comme supprime, la visibilite active est arretee, puis l'utilisateur est
deconnecte. Les profils supprimes sont exclus de la decouverte.

Pour afficher et gerer les utilisateurs bloques dans `/settings`:

1. Ouvrir Supabase.
2. Aller dans **SQL Editor**.
3. Copier le contenu de `supabase/migrations/0009_blocked_users_settings.sql`.
4. Cliquer sur **Run**.

## Documents projet

- [Product brief](docs/product-brief.md)
- [MVP scope](docs/mvp-scope.md)
- [User stories](docs/user-stories.md)
- [Data model](docs/data-model.md)
- [Security & privacy](docs/security-privacy.md)
- [Technical architecture](docs/technical-architecture.md)

## Plan de developpement par etapes

Chaque etape doit produire une version testable separement.

1. **Socle projet**
   - Initialiser Next.js, TypeScript, Tailwind CSS et structure applicative.
   - Configurer linting, formatting et variables d'environnement.
   - Testable: la page d'accueil s'affiche en local et sur mobile.

2. **Supabase et authentification**
   - Creer le projet Supabase, les clients server/browser, inscription, connexion, deconnexion.
   - Ajouter la confirmation "J'ai plus de 18 ans".
   - Testable: creation de compte, connexion, session persistante, deconnexion.

3. **Profil utilisateur**
   - Creer et modifier un profil: pseudo, age, photo, bio, langues, interets, type de deplacement, zone approximative.
   - Connecter Supabase Storage pour les photos.
   - Testable: un utilisateur connecte complete son profil et le retrouve apres reconnexion.

4. **Intention et visibilite temporaire**
   - Choisir une intention et activer la visibilite pour 3h, 6h ou 24h.
   - Stocker une expiration automatique via `visible_until`.
   - Testable: l'utilisateur apparait visible jusqu'a expiration, puis disparait des resultats.

5. **Decouverte**
   - Afficher les profils visibles dans la meme zone approximative.
   - Exclure soi-meme, les comptes bloques, les comptes suspendus et les visibilites expirees.
   - Testable: deux comptes dans la meme zone peuvent se voir, sans distance exacte ni localisation precise.

6. **Demandes de contact**
   - Envoyer, accepter ou refuser une demande.
   - Debloquer l'acces au chat uniquement apres acceptation.
   - Testable: le chat est inaccessible avant acceptation et accessible apres.

7. **Chat texte**
   - Chat simple texte uniquement.
   - Pas d'image, audio ou video en V1.
   - Testable: deux utilisateurs connectes par demande acceptee echangent des messages.

8. **Blocage, signalement et moderation**
   - Bloquer un utilisateur.
   - Signaler avec motif.
   - Admin minimal: utilisateurs, signalements, suspension manuelle.
   - Testable: un utilisateur bloque disparait des resultats; un signalement apparait dans l'admin.

9. **Durcissement MVP**
   - Revue RLS, validation des formulaires, etats vides, erreurs, accessibilite, responsive.
   - Testable: parcours complet mobile et desktop, sans fuite de donnees sensibles.

## Principes non negociables

- Application reservee aux majeurs.
- Aucun numero de chambre.
- Aucune distance exacte.
- Aucune position GPS precise.
- Rencontres recommandees dans des lieux publics: lobby, bar, restaurant.
- Suppression de compte prevue des le depart.
- Confidentialite et moderation integrees au modele de donnees.
