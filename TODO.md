
## 9. Service après-vente
- [x] Une page publique `/service-apres-vente` permet au client de demander un diagnostic ou une intervention avec nom, téléphone, ville, référence de commande, modèle, description et créneau souhaité.
- [x] Les demandes sont validées côté serveur et enregistrées durablement dans PostgreSQL avec les statuts Nouvelle, En cours, Résolue et Clôturée.
- [x] L’administration `/admin/sav` liste les demandes et permet de modifier leur statut.
- [x] Le SAV est accessible depuis la navigation publique, la page Contact et la navigation admin.

## 10. Seed catalogue et administration
- [x] Le seed PostgreSQL contient Domy X5, Domy X5 Slim, Domy M1 Pro et Domy M24 avec prix, caractéristiques, stock, catégories et images principales.
- [x] Le script `build` exécute automatiquement les migrations puis `pnpm run db:seed`, afin que les quatre produits soient créés ou mis à jour lors du déploiement.
- [x] La route admin `/api/admin/products` charge ces produits depuis PostgreSQL et `/admin/produits` les affiche avec leur catégorie, prix, stock et image.
