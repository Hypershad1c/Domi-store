
## 7. Commande intégrée et export Excel
- [x] La commande depuis une fiche produit passe par le panier et le formulaire intégré ; le bouton « Commander via WhatsApp » est supprimé.
- [x] Le formulaire intégré demande nom, téléphone, ville, adresse et remarque, enregistre la commande dans PostgreSQL et affiche une référence après succès.
- [x] L’administration affiche les commandes et permet de les confirmer avec le statut `Confirmée`, puis de les passer à `Expédiée`, `Livrée` ou `Annulée`.
- [x] Le bouton « Télécharger Excel » génère `domistore-commandes.xlsx` avec les informations client, produits, total, statut et remarques.
- [x] Si `BLOB_READ_WRITE_TOKEN` est configuré, le classeur Excel privé est resynchronisé automatiquement après chaque nouvelle commande ou changement de statut.
