# domiStore — boutique autonome sans Shopify

Boutique Next.js 15 App Router pour les serrures intelligentes Domi'Lock. Le projet ne dépend d'aucun backend Shopify : le catalogue, le panier, les commandes, les demandes de devis et l'espace admin sont dans l'application.

## Stack

Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL cloud, bcrypt, Zod et Vercel Blob pour les visuels admin. Les visuels des trois modèles fournis dans `Catalogue_Domi-Lock.pdf` sont extraits dans `public/products/` et servent désormais au catalogue initial.

## Lancer localement

```bash
cp .env.example .env
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run db:seed
pnpm dev
```

Renseigner `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` et, pour l'upload d'images, `BLOB_READ_WRITE_TOKEN`. Pour générer un hash :

```bash
node -e "console.log(require('bcryptjs').hashSync('CHANGEZ-MOI', 12))"
```

## Administration

Ouvrir `/admin/login` avec `ADMIN_EMAIL` et le mot de passe correspondant à `ADMIN_PASSWORD_HASH`. Le dashboard donne accès aux produits, catégories, commandes et demandes de devis. Les produits sont éditables avec statut publié/brouillon, mise en avant, stock, caractéristiques et image principale. Le bouton d'upload envoie les fichiers vers Vercel Blob (PNG/JPEG/WebP, 5 Mo max). Les commandes disposent des statuts Nouvelle, Confirmée, Expédiée, Livrée et Annulée.

## Vercel sans Shopify

1. Importer `Hypershad1c/Domi-store` dans Vercel comme projet **Next.js**.
2. Ajouter les variables de `.env.example` dans Development et Production, notamment `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_WHATSAPP_NUMBER` et `NEXT_PUBLIC_SITE_URL`.
3. Utiliser le build `pnpm install --frozen-lockfile && pnpm build` et le répertoire de sortie par défaut Next.js.
4. La commande de build exécute `prisma generate`, `prisma migrate deploy`, puis `next build`.
5. Après le premier déploiement, exécuter le seed depuis un environnement disposant de `POSTGRES_URL` : `pnpm run db:seed`.
6. Pour `domistore.ma`, ajouter le domaine dans Vercel puis créer les enregistrements DNS indiqués par Vercel.

## WhatsApp

Le numéro public est `212754253515` (`0754 253 515` au format local). Les CTA utilisent `wa.me` et préremplissent le nom du modèle ou de la demande.

## Visuels catalogue

Les visuels produits du PDF fourni ont été extraits et intégrés dans `public/products/`. L'espace admin permet de les remplacer par des fichiers cloud Vercel Blob sans modifier le code.
