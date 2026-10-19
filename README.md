# domiStore — boutique autonome sans Shopify

Boutique Next.js 15 App Router pour les serrures intelligentes Domi'Lock. Le projet ne dépend d'aucun backend Shopify : le catalogue, le panier, les commandes, les demandes de devis et l'espace admin sont dans l'application.

## Stack

Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL cloud, bcrypt, Zod, ExcelJS et Vercel Blob pour les visuels admin et la sauvegarde privée du classeur Excel. Les visuels des modèles fournis dans `Catalogue_Domi-Lock.pdf` sont extraits dans `public/products/`. Le logo Domi Store et le visuel du nouveau **Domy X5 Slim** proviennent des fichiers Google Drive fournis.

## Lancer localement

```bash
cp .env.example .env
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run db:seed
pnpm dev
```

Renseigner `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` et, pour l'upload d'images et la synchronisation Excel, `BLOB_READ_WRITE_TOKEN`. Pour générer un hash :

```bash
node -e "console.log(require('bcryptjs').hashSync('CHANGEZ-MOI', 12))"
```

## Commandes et confirmation admin

Le client ajoute les produits au panier puis remplit le formulaire intégré avec nom, téléphone, ville, adresse et remarque. La commande est enregistrée dans PostgreSQL avec le statut `NEW`. L'administrateur ouvre `/admin/commandes` et passe la commande à `Confirmée`, puis éventuellement `Expédiée`, `Livrée` ou `Annulée`.

Le bouton **Télécharger Excel** génère `domistore-commandes.xlsx` à partir de PostgreSQL à chaque clic. Si `BLOB_READ_WRITE_TOKEN` est configuré, le classeur privé est resynchronisé après chaque création ou changement de statut. La commande utilise une clé d'idempotence contre les doubles clics, vérifie le stock dans une transaction PostgreSQL et enregistre chaque changement de statut dans `OrderAudit`. L'administration permet aussi de rechercher les commandes et de les filtrer par statut.

## Catalogue

Le catalogue contient Domy X5 (1 660 DH), Domy X5 Slim (1 699 DH), Domy M1 Pro (2 599 DH) et Domy M24 (3 199 DH). Le nouveau X5 Slim inclut empreinte, code, carte IC/RFID, clé mécanique, application Tuya, autonomie jusqu'à 12 mois, livraison/installation et garantie 5 ans.

## Service après-vente

La page `/service-apres-vente` permet d'envoyer une demande de diagnostic ou d'intervention après l'installation. Les demandes sont enregistrées dans PostgreSQL et suivies depuis `/admin/sav` avec les statuts `NEW`, `IN_PROGRESS`, `RESOLVED` et `CLOSED`. Les migrations doivent être appliquées avec `pnpm exec prisma migrate deploy` avant utilisation en production.

## Animations et identité

Le logo fourni est utilisé dans l'en-tête et comme logo de projet. La page d'accueil utilise des animations de révélation, flottement et transitions de survol, avec respect de `prefers-reduced-motion`.

## WhatsApp

WhatsApp a été retiré de l'ensemble du site : aucun bouton flottant, lien de contact, texte de livraison ou option de commande ne renvoie vers WhatsApp. Les canaux de contact sont le téléphone et l'email.

## Notifications email

Les notifications admin sont optionnelles via Resend. Renseigner `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL` et éventuellement `NOTIFICATION_FROM_EMAIL` pour recevoir un email à chaque nouvelle commande et à chaque changement de statut.

## Vercel sans Shopify

1. Importer `Hypershad1c/Domi-store` dans Vercel comme projet **Next.js**.
2. Ajouter les variables de `.env.example` dans Development et Production, notamment `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `BLOB_READ_WRITE_TOKEN` et `NEXT_PUBLIC_SITE_URL`. Le store Vercel Blob utilisé pour les images produit doit être configuré en **public** : les images sont affichées directement sur la boutique. Un token provenant d'un store privé ne peut pas être utilisé avec l'upload public.
3. Utiliser le build `pnpm install --frozen-lockfile && pnpm build` et le répertoire de sortie par défaut Next.js.
4. La commande de build exécute `prisma generate`, `prisma migrate deploy`, `pnpm run db:seed`, puis `next build`. Le seed crée ou met à jour Domy X5, Domy X5 Slim, Domy M1 Pro et Domy M24, ainsi que leurs images principales.
5. Pour un déploiement existant, relancer un déploiement après avoir configuré `POSTGRES_URL` afin que les produits apparaissent dans `/admin/produits`. Le seed est idempotent et peut aussi être lancé manuellement avec `pnpm run db:seed`.
6. Pour `domistore.ma`, ajouter le domaine dans Vercel puis créer les enregistrements DNS indiqués par Vercel.

## Visuels catalogue

Les visuels produits du PDF fourni et les deux assets Google Drive sont intégrés dans `public/`. L'espace admin permet de remplacer les images par des fichiers cloud Vercel Blob sans modifier le code. Si l'upload retourne une erreur de store privé, créer un nouveau Blob Store public dans Vercel, connecter ce store au projet et remplacer `BLOB_READ_WRITE_TOKEN` dans les environnements Production et Preview.

Chaque produit peut maintenant avoir une galerie de 1 à 20 images. Dans `/admin/produits`, ajoutez plusieurs fichiers, choisissez l'image principale, supprimez une image ou modifiez l'ordre avec les flèches. La galerie est enregistrée dans `ProductImage` avec `sortOrder` et `isPrimary`.

Sur chaque fiche produit, les images secondaires sont consultables avec des miniatures, des boutons précédent/suivant et un compteur. Cliquer sur l'image ou sur l'icône d'agrandissement ouvre un zoom plein écran ; Échap et les flèches du clavier sont également pris en charge.

La boutique et les fiches produit lisent le catalogue publié depuis PostgreSQL, y compris les images ajoutées depuis `/admin/produits`. Si PostgreSQL est momentanément indisponible, les visuels locaux du catalogue servent de fallback.
