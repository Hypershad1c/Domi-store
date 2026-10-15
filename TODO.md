# TODO domiStore

## 1. Socle autonome sans Shopify
- [ ] Le projet est un site Next.js 15 App Router en TypeScript et Tailwind CSS.
- [ ] Le catalogue, le panier, les commandes, les demandes de devis et l'espace admin sont gérés par le code du projet ; aucune dépendance Shopify ni activation de Shopify.
- [ ] La persistance de production est prévue pour PostgreSQL cloud via Prisma ; SQLite et stockage local persistant sont exclus.
- [ ] Les secrets ne sont pas codés en dur et `.env.example` documente les variables attendues.

## 2. Identité, navigation et responsive
- [ ] Le nom domiStore, le slogan « Serrures intelligentes pour chaque porte », le bleu #2563EB, le bleu marine #0F1F4D, les fonds clairs et une police de type Inter sont appliqués.
- [ ] Le site est mobile-first, avec header, navigation, bascule arabe RTL et CTA WhatsApp.
- [ ] Le logo Domi'Lock fourni pourra remplacer le fallback logo ; le nom domiStore est visible dans l'en-tête.

## 3. Parcours public de vente
- [ ] L'accueil contient hero, trois produits mis en avant, Pourquoi domiStore, particuliers/promoteurs, livraison et installation gratuites, assistance après installation, devis sur demande et CTA WhatsApp.
- [ ] La boutique propose grille, recherche, filtres gamme/prix/caméra/reconnaissance faciale et tri par prix.
- [ ] Chaque fiche produit affiche galerie, prix, prix barré optionnel, description, caractéristiques, stock, ajout au panier et commande WhatsApp avec message prérempli.
- [ ] Le comparatif met en regard les trois modèles sur prix, niveau, empreinte, code, carte, clé, application, caméra, reconnaissance faciale et alimentation.
- [ ] Le panier et la commande demandent nom, téléphone, ville, adresse et remarque, indiquent le paiement à la livraison, enregistrent la commande et affichent une confirmation avec option WhatsApp.
- [ ] L'espace Pro enregistre nom, société, ville, nombre de portes, modèle souhaité et message.
- [ ] Contact affiche WhatsApp 0754 253 515 et un bouton WhatsApp flottant est présent sur tout le site.
- [ ] Mentions légales, conditions de vente et politique de livraison existent.

## 4. Données initiales et administration
- [ ] Le seed crée Domy X5 à 1 660 DH, Domy M1 Pro à 2 599 DH et Domy M24 à 3 199 DH avec leurs caractéristiques détaillées.
- [ ] `/admin` est protégé par authentification et mot de passe hashé ; les cookies de Preview/public sont compatibles `SameSite=None; Secure`.
- [ ] L'admin permet d'ajouter, modifier et supprimer un produit avec confirmation, catégorie, prix, descriptions, caractéristiques dynamiques, images multiples, ordre, principale, stock, publié/brouillon et mise en avant.
- [ ] Les catégories, commandes et demandes de devis sont gérables ; les commandes passent par nouvelle, confirmée, expédiée, livrée ou annulée.
- [ ] Le dashboard affiche commandes, chiffre d'affaires et produits les plus commandés.
- [ ] Les changements admin sont visibles immédiatement côté public grâce à revalidation/lecture serveur.

## 5. Images, qualité et SEO
- [ ] Les images produit utilisent des adresses cloud durables et l'admin prévoit leur remplacement ; aucune image durable n'est stockée dans le dossier du projet.
- [ ] Les images ont des textes alternatifs et utilisent `next/image` quand applicable.
- [ ] Les pages publiques ont metadata route-spécifique, Open Graph/Twitter, canonical configuré, contenu SSR, sitemap.xml et robots.txt.
- [ ] `public/manus-routes.json` recense toutes les routes publiques et admin pertinentes hors API.
- [ ] La validation TypeScript/JSON et le build de production passent sans diagnostic bloquant.

## 6. Dépôt et mise en ligne
- [ ] Le code est checkpointé sur la branche main du projet.
- [ ] Le dépôt GitHub `Hypershad1c/Domi-store` est connecté via le flux autorisé, sans écraser de contenu non lié.
- [ ] Le déploiement Vercel est documenté/configuré lorsque l'accès et les variables sont disponibles ; sinon le guide d'import, variables, migration, seed et domaine `domistore.ma` est livré.
- [ ] L'URL de production n'est annoncée qu'après vérification d'une publication réussie ; sinon l'URL de Preview est explicitement étiquetée comme telle.
