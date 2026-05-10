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
