
## 11. Galeries produit
- [x] L’administration permet d’ajouter jusqu’à 20 images par produit via Vercel Blob.
- [x] Chaque image peut être définie comme principale, supprimée ou déplacée dans l’ordre de la galerie.
- [x] Les images principales et secondaires sont persistées dans `ProductImage` avec `sortOrder` et `isPrimary`.

## 12. Galerie interactive produit
- [x] Les images secondaires sont accessibles par miniatures cliquables sur chaque fiche produit.
- [x] La fiche produit propose les boutons précédent/suivant, un compteur d’images et un zoom plein écran.
- [x] Le zoom peut être fermé par clic extérieur ou Échap, et les flèches clavier permettent de naviguer entre les images.

## 13. Refonte Premium 2.0
- [x] La palette navy, bleu signal, cyan, mint et cloud est harmonisée dans les styles globaux.
- [x] Les animations de hero, flottement, shimmer, survol et révélation respectent `prefers-reduced-motion`.
- [x] La page d’accueil présente garanties, parcours en trois étapes, témoignages, FAQ et CTA projet.
- [x] Les cartes produit affichent badges, stock, technologie principale, nombre de vues et aperçu secondaire au survol.
- [x] Le layout global dispose d’un footer enrichi et de données structurées Organization pour le SEO.

## 14. Outils avancés de gestion des produits
- [x] La liste admin permet une recherche par nom, slug ou gamme, ainsi qu’un filtre Publié/Brouillon.
- [x] Les stocks faibles sont signalés à partir de 3 unités ou moins, avec le nombre d’images et la date de modification visibles.
- [x] Un produit peut être dupliqué avec sa galerie, une copie en brouillon et un stock initial nul pour éviter une mise en vente accidentelle.
- [x] Les produits sélectionnés peuvent être publiés ou dépubliés en une seule action, protégée par l’authentification admin.
- [x] Un lien d’aperçu ouvre chaque fiche produit depuis l’administration.

## 15. SEO avancé des fiches produit
- [x] Chaque fiche produit génère une URL canonique basée sur `NEXT_PUBLIC_SITE_URL`.
- [x] Chaque fiche produit expose un JSON-LD Schema.org `Product` avec nom, description, SKU, marque Domi'Lock, galerie, prix en MAD, URL et disponibilité.
- [x] Le sitemap est dynamique et reprend les produits publiés depuis PostgreSQL avec leur date de modification, avec fallback catalogue si la base est indisponible.

## 16. Expérience mobile produit
- [x] Une barre sticky mobile affiche le nom, le prix et l’action Ajouter au panier sans remplacer le bouton desktop.
- [x] La galerie permet le balayage tactile gauche/droite, conserve les miniatures horizontales défilantes et respecte les contrôles clavier/zoom.
