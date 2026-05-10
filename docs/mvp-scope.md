# MVP Scope

## Objectif du MVP

Construire une premiere version web responsive, simple, securisee et testable rapidement. Le MVP doit valider l'interet du concept et le parcours principal avant d'investir dans une application native.

## Inclus dans la V1

### Page d'accueil publique

- Presentation du concept.
- Bouton "Creer un compte".
- Bouton "Se connecter".
- Messages de securite: majorite, lieux publics, pas de localisation precise.

### Authentification

- Inscription par email.
- Connexion par email.
- Deconnexion.
- Confirmation obligatoire "J'ai plus de 18 ans".

### Profil utilisateur

- Pseudo.
- Age.
- Photo de profil.
- Bio courte.
- Langues parlees.
- Centres d'interet.
- Type de deplacement: professionnel, personnel, les deux.
- Zone approximative.

### Intention du moment

Une intention active parmi:

- Diner.
- Boire un verre.
- Networking.
- Sortie locale.
- Rencontre.

### Visibilite temporaire

Activation pour:

- 3 heures.
- 6 heures.
- 24 heures.

La visibilite est controlee par un champ `visible_until`. Un profil est visible uniquement si `visible_until > now()`.

### Localisation approximative

- Champ libre ou normalise de zone approximative.
- Exemples: "Paris - Massy", "Bordeaux centre", "Saintes".
- Aucune coordonnee GPS en V1.
- Aucun numero de chambre.
- Aucune distance exacte.

### Decouverte

- Profils visibles dans la meme zone approximative.
- Intention actuelle.
- Temps restant de visibilite.
- Fiche profil consultable.

### Demandes de contact

- Envoyer une demande.
- Accepter une demande.
- Refuser une demande.
- Chat disponible uniquement apres acceptation.

### Chat

- Texte uniquement.
- Pas d'image.
- Pas d'audio.
- Pas de video.

### Securite et moderation

- Bloquer un utilisateur.
- Signaler un utilisateur.
- Motifs:
  - comportement inapproprie
  - harcelement
  - faux profil
  - contenu offensant
  - autre
- Les utilisateurs bloques ne doivent plus apparaitre dans les resultats.
- Les signalements doivent apparaitre dans un espace admin.

### Admin minimal

- Liste des utilisateurs.
- Liste des signalements.
- Suspension manuelle d'un compte.

### Compte et confidentialite

- Suppression du compte.
- Politique de non-affichage de donnees sensibles.
- Architecture compatible avec une future page de preferences de confidentialite.

## Exclu de la V1

- Application mobile native.
- Geolocalisation GPS precise.
- Distance exacte.
- Numero de chambre.
- Verification d'identite avancee.
- Matching algorithmique complexe.
- Paiement.
- Notifications push natives.
- Images, audio ou video dans le chat.
- Groupes et evenements publics.
- Messagerie sans acceptation mutuelle.

## Definition of Done MVP

- Le parcours complet fonctionne sur mobile et desktop.
- Les donnees sont protegees par RLS.
- Un utilisateur suspendu ne peut plus utiliser les fonctions principales.
- Un utilisateur bloque disparait de la decouverte.
- Un chat n'existe qu'apres demande acceptee.
- Aucune localisation precise n'est stockee ou affichee.
- Les erreurs et etats vides sont geres proprement.

