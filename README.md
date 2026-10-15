# domiStore — boutique autonome sans Shopify

Boutique Next.js 15 pour les serrures intelligentes Domi'Lock. Le projet ne dépend d'aucun backend Shopify : le catalogue, le panier, les commandes, les demandes de devis et l'espace admin sont dans l'application.

## Stack

Next.js 15 App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL cloud, bcrypt et Zod. Les images durables doivent venir de Vercel Blob, Cloudinary ou du stockage projet ; `public/product-lock.svg` est uniquement un visuel fallback jusqu'à l'ajout des images du catalogue Domi'Lock.

## Lancer localement

```bash
cp .env.example .env
pnpm install
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run db:seed
pnpm dev
```

Renseigner `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL` et un `ADMIN_PASSWORD_HASH` bcrypt avant la migration et le seed. Pour générer un hash :

```bash
node -e "console.log(require('bcryptjs').hashSync('CHANGEZ-MOI', 12))"
```

## Administration

Ouvrir `/admin/login` avec `ADMIN_EMAIL` et le mot de passe correspondant à `ADMIN_PASSWORD_HASH`. Le dashboard donne accès aux produits, commandes et demandes de devis. Les mutations sont protégées côté serveur par cookie `domistore_session` httpOnly et les suppressions demandent une confirmation dans l'interface.

## Vercel sans Shopify

1. Importer le dépôt GitHub dans Vercel comme projet **Next.js**.
2. Ajouter les variables de `.env.example` dans Development et Production, notamment `POSTGRES_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_WHATSAPP_NUMBER` et `NEXT_PUBLIC_SITE_URL`.
3. Utiliser le build `pnpm install --frozen-lockfile && pnpm build` et le répertoire de sortie par défaut Next.js.
4. La commande de build exécute `prisma generate`, `prisma migrate deploy`, puis `next build`.
5. Après le premier déploiement, exécuter le seed depuis un environnement disposant de `POSTGRES_URL` : `pnpm run db:seed`.
6. Pour `domistore.ma`, ajouter le domaine dans Vercel puis créer les enregistrements DNS indiqués par Vercel.

## WhatsApp

Le numéro public est `212754253515` (`0754 253 515` au format local). Les CTA utilisent `wa.me` et préremplissent le nom du modèle ou de la demande.

## Visuels catalogue

Le dépôt initial reçu dans l'espace de travail ne contenait que le cahier des charges texte et pas le PDF Domi'Lock. Remplacer les visuels fallback depuis l'admin ou ajouter les fichiers cloud dans les champs d'images des produits dès que le catalogue est disponible.
