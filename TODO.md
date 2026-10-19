
## 8. Identité, catalogue et robustesse production
- [x] Le logo fourni par Google Drive est intégré dans l'en-tête et configuré comme logo durable du projet.
- [x] Le nouveau produit Domy X5 Slim à 1 699 DH est disponible dans le catalogue, le seed PostgreSQL, la fiche dynamique et le comparatif.
- [x] WhatsApp est retiré de tout le site public : bouton flottant, page contact, livraison, conditions de vente et options de commande.
- [x] Des animations de révélation, flottement et survol sont ajoutées avec respect de `prefers-reduced-motion`.
- [x] Les commandes utilisent une clé d'idempotence, une vérification de stock transactionnelle et un journal `OrderAudit`.
- [x] Les erreurs de changement de statut sont visibles dans l'admin, avec restauration de l'ancien statut en cas d'échec.
- [x] La connexion admin est limitée après cinq tentatives invalides sur une fenêtre de quinze minutes et nettoie les sessions expirées.
- [x] Les commandes admin disposent d'une recherche et d'un filtre par statut ; les notifications Resend sont disponibles lorsqu'elles sont configurées.
