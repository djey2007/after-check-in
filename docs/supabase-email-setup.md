# Configuration des emails Supabase

Cette fiche aide à éviter les redirections vers `localhost` et à rendre les emails d’authentification cohérents avec After Check-in.

## URLs à vérifier

Dans Supabase :

1. Ouvrir le projet.
2. Aller dans **Authentication > URL Configuration**.
3. Renseigner :

```text
Site URL:
https://after-check-in.vercel.app
```

4. Ajouter dans **Redirect URLs** :

```text
https://after-check-in.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## Email provider

Dans **Authentication > Providers > Email** :

- Activer Email.
- Vérifier si la confirmation email est activée ou désactivée selon le test voulu.
- Pour un test public, garder la confirmation email activée.

## Templates emails

Dans **Authentication > Email Templates**, adapter les templates avec un ton simple.

### Confirmation de compte

Sujet recommandé :

```text
Confirme ton compte After Check-in
```

Texte recommandé :

```text
Bienvenue sur After Check-in.

Confirme ton adresse email pour créer ton compte et rejoindre l’application.

{{ .ConfirmationURL }}

After Check-in est réservé aux utilisateurs majeurs. Ne partage jamais de numéro de chambre ou de localisation précise.
```

### Magic link ou connexion email

Sujet recommandé :

```text
Ton lien de connexion After Check-in
```

Texte recommandé :

```text
Voici ton lien de connexion After Check-in :

{{ .ConfirmationURL }}

Si tu n’es pas à l’origine de cette demande, tu peux ignorer cet email.
```

## Test à réaliser

- Créer un nouveau compte avec une adresse réelle.
- Vérifier que l’email arrive.
- Cliquer sur le lien.
- Vérifier que l’utilisateur revient sur :

```text
https://after-check-in.vercel.app/auth/callback
```

- Vérifier qu’il est ensuite redirigé correctement dans l’application.

## Points d’attention

- Ne jamais utiliser `localhost` comme Site URL en production.
- Garder `localhost` uniquement dans les Redirect URLs pour les tests locaux.
- Si les emails n’arrivent pas, vérifier les spams et les limites du service email Supabase.
