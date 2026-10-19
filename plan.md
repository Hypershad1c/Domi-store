# Plan domiStore — boutique autonome sans Shopify

## Périmètre et décisions

domiStore est une boutique marocaine de serrures intelligentes Domi'Lock, en français avec bascule arabe RTL, devise DH, responsive mobile-first et parcours d'achat sans Shopify. Le catalogue, le panier, les commandes, les demandes de devis et l'administration sont gérés par l'application.

- **Frontend** : Next.js 15 App Router, TypeScript, Tailwind CSS, rendu serveur pour les pages publiques et composants client uniquement pour les interactions.
- **Persistance** : Prisma avec PostgreSQL externe compatible Vercel/Neon/Supabase, via `POSTGRES_URL`/`DATABASE_URL` documenté dans `.env.example`. Le projet Webdev possède aussi une base managée de plateforme, mais le modèle Prisma reste PostgreSQL pour respecter le cahier des charges et faciliter l'import Vercel.
- **Images** : adresses cloud stables (`/manus-storage/...` en Preview ou URL Vercel Blob/Cloudinary en production), jamais de stockage persistant local. Les visuels fournis seront conservés comme actifs remplaçables depuis l'admin.
- **Authentification** : session admin côté serveur avec cookie `domistore_session`, `httpOnly`, `SameSite=None; Secure` en Preview/public HTTPS, mot de passe bcrypt et secret serveur. Une route de démo non destructive est prévue quand les secrets/DB ne sont pas encore configurés, sans contourner la protection admin.
- **Validation** : Zod sur les formulaires et mutations serveur.
- **Communication** : commande entièrement intégrée au formulaire panier/checkout et visible dans l'administration ; WhatsApp est retiré de l'ensemble du site.
- **Déploiement** : code prêt pour Vercel via `npm run build`/`prisma migrate deploy`; checkpoint Webdev et connexion au dépôt GitHub sélectionné seront traités après validation du code. Aucun connecteur Shopify ne sera activé.

## Architecture applicative

- `app/` : routes publiques (`/`, `/boutique`, `/produit/[slug]`, `/comparatif`, `/panier`, `/espace-pro`, `/contact`, pages légales) et routes privées `/admin`.
- `app/api/` : mutations panier/commande/devis, auth admin, upload d'images et endpoints de gestion.
- `components/` : header, sélecteur de langue, contact, cartes produit, filtres, panier, formulaires, galerie mobile et composants admin.
- `lib/` : données seed et fallback, Prisma, validation Zod, session, formatage DH et i18n minimal.
- `prisma/` : schéma PostgreSQL, migrations et seed des 3 serrures + compte admin.
- `public/` : favicon, manifest, route manifest, icônes légères et documents SEO ; aucune photo produit durable ne sera stockée ici.

## Design

### Styles explorés

- **Tech premium marocain** — 0,07 : contraste bleu électrique/bleu nuit, panneaux éditoriaux et détails inspirés d'une interface de contrôle.
- **Atelier architectural** — 0,04 : grille de plans, matériaux minéraux et présentation très catalogue.
- **Minimalisme néo-suisse** — 0,05 : typographie stricte, aplats blancs et accent bleu signal.

### Style choisi : Tech premium marocain

- **Mouvement** : dashboard hardware premium, avec la retenue d'une marque d'architecture contemporaine.
- **Principes** : hiérarchie nette, confiance avant conversion, espaces respirants, détails techniques lisibles.
- **Couleur** : #0F1F4D ancre la fiabilité et la sécurité ; #2563EB devient le bleu signal des actions ; blanc cassé et gris froid laissent les produits dominer.
- **Mise en page** : composition éditoriale en bandes asymétriques plutôt qu'une grille centrée uniforme ; hero en deux masses, prix et preuve sociale alignés comme une fiche technique.
- **Signatures** : micro-étiquette « ACCÈS INTELLIGENT », lignes de circuit discrètes, pastilles de statut et boutons à rayon moyen.
- **Interaction** : filtres instantanés, CTA très explicites, feedback de panier visible, aucun effet décoratif qui ralentit le choix.
- **Animation** : entrées douces de 180–240 ms, léger décalage des cartes au scroll, états hover par translation de 2 px ; respecter `prefers-reduced-motion`.
- **Typographie** : Inter (ou Geist Sans) pour tout le système ; titres très gras et serrés, corps 15–17 px, chiffres de prix tabulaires et légèrement espacés.
- **Essence** : « La serrure intelligente, installée et accompagnée — pour chaque porte, chaque projet. » Personnalité : fiable, précise, accessible.
- **Voix** : directe et rassurante. Exemples : « Ouvrez votre porte comme vous vivez aujourd'hui. » / « Un projet de plusieurs portes ? Parlons-en. »
- **Wordmark** : verrou géométrique bleu électrique accompagné de `domiStore` en bas de casse ; le mot est espacé pour évoquer une interface produit.
- **Couleur propriétaire** : bleu signal `#2563EB`, utilisé comme repère de navigation et de conversion.

## Données métier

Modèles :

1. **Domy X5** — Essentiel — 1 660 DH : empreinte, code tactile, carte IC/RFID, clé mécanique, Tuya, jusqu'à 12 mois, livraison et installation gratuites.
2. **Domy M1 Pro** — Caméra et vidéophonie — 2 599 DH : caméra 720p, vidéophonie, sonnette, empreinte 200, PIN 150, carte 200, Tuya Smart, Wi-Fi/Bluetooth, clés virtuelles, Alexa/Google Home, codes temporaires, IP55, 4 piles AA, environ 18 mois.
3. **Domy M24** — Premium Face ID — 3 199 DH : reconnaissance faciale 30–80 cm, caméra 1080p, écran 5 pouces, sonnette, empreinte/code/carte, Wi-Fi/WisHome, rapports d'activité, batterie USB 5V, clé de secours, alliage zinc noir, portes 35–120 mm, −30 à 60 °C, pack complet.

Entités : `Product`, `Category`, `ProductImage`, `Order`, `OrderItem`, `QuoteRequest`, `AdminUser`, `Session`. Statuts de commande : `NEW`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`.

## Flux principaux

- Accueil → Boutique → fiche produit → panier → formulaire livraison/paiement à la livraison → confirmation enregistrée en base et exportable dans Excel.
- Fiche produit → ajout au panier ; aucun lien de commande WhatsApp.
- Espace Pro → demande de devis enregistrée et visible dans l'admin.
- Admin → connexion → dashboard → produits/catégories/commandes/devis ; mutations protégées côté serveur et revalidation des pages publiques.
- Langue arabe : labels essentiels et direction RTL sont gérés sans dupliquer le catalogue ; le français reste le contenu principal initial.

## SEO et publication

Chaque page publique aura metadata title/description, Open Graph, canonical conditionnel à `NEXT_PUBLIC_SITE_URL`, contenu HTML SSR et liens internes. Chaque fiche produit expose aussi un JSON-LD `Product` avec prix MAD, disponibilité, images et offre. `sitemap.xml`, `robots.txt` et `manus-routes.json` seront servis. Le build utilise `prisma generate && prisma migrate deploy && next build` dans l'environnement de déploiement, sans secret codé en dur. `.env.example` documentera la DB, le secret de session, l'admin et l'upload.

## Limites explicites

Le catalogue PDF Domi'Lock n'est pas présent dans l'espace de travail actuel ; les cartes utilisent donc une direction visuelle et un fallback local léger jusqu'à ce que les visuels soient ajoutés. Les images seront remplaçables via l'admin. Le déploiement Vercel nécessitera les variables d'environnement et l'autorisation de connexion au compte Vercel si elle n'est pas déjà disponible ; à défaut, le dépôt et les étapes exactes seront livrés.
