import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const seedProducts = [
  { name: "Domy X5", slug: "domy-x5", category: "Essentiel", price: 1660, shortDesc: "Cinq modes d'ouverture, l'essentiel intelligent pour chaque logement.", description: "Une serrure intuitive et fiable pour moderniser votre porte. Empreinte, code, carte, clé mécanique ou application : vous choisissez votre accès.", features: ["Empreinte digitale", "Code secret tactile", "Carte IC / RFID", "Clé mécanique de secours", "Application Tuya", "Jusqu'à 12 mois d'autonomie", "Livraison et installation gratuites"], stock: 12, featured: true, hasCamera: false, faceId: false, image: "/products/domy-x5-main.png" },
  { name: "Domy X5 Slim", slug: "domy-x5-slim", category: "Nouveauté", price: 1699, shortDesc: "Une silhouette fine, quatre accès sécurisés et l'application Tuya.", description: "Le nouveau Domy X5 Slim associe un design discret à des accès pratiques au quotidien : empreinte, code secret, carte RFID, clé mécanique et pilotage Tuya.", features: ["Empreinte digitale", "Code secret", "Carte IC / RFID", "Clé mécanique de secours", "Application Tuya", "Autonomie jusqu'à 12 mois", "Livraison et installation gratuites", "Garantie 5 ans"], stock: 10, featured: true, hasCamera: false, faceId: false, image: "/products/domy-x5-slim.jpg" },
  { name: "Domy M1 Pro", slug: "domy-m1-pro", category: "Caméra & vidéophonie", price: 2599, shortDesc: "Voyez qui est devant la porte, même quand vous n'êtes pas chez vous.", description: "La serrure connectée pensée pour la location saisonnière et les familles : sonnette, vidéo HD, codes temporaires et gestion à distance avec Tuya Smart.", features: ["Caméra HD 720p + vidéophonie", "Empreinte jusqu'à 200", "Jusqu'à 150 codes PIN", "Carte MF1 jusqu'à 200", "Tuya Smart, Wi-Fi & Bluetooth", "Codes temporaires self check-in", "Résistante à l'eau IP55", "Environ 18 mois avec 4 piles AA"], stock: 8, featured: true, hasCamera: true, faceId: false, image: "/products/domy-m1-pro-main.png" },
  { name: "Domy M24", slug: "domy-m24", category: "Premium Face ID", price: 3199, shortDesc: "Reconnaissance faciale, écran 5 pouces et finition premium.", description: "Le haut de gamme Domi'Lock pour les projets de standing. Un accès sans contact, une vision claire et un pilotage complet depuis WisHome.", features: ["Reconnaissance faciale 30–80 cm", "Caméra HD 1080p", "Écran 5 pouces & sonnette", "Empreinte 200 / code 150 / carte 200", "Wi-Fi, application WisHome & rapports", "Batterie rechargeable USB 5V", "Portes de 35 à 120 mm", "Alliage de zinc noir, −30 à 60 °C"], stock: 5, featured: true, hasCamera: true, faceId: true, image: "/products/domy-m24-main.png" }
];
function categorySlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
async function main() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash("change-me-now", 12);
  const adminEmail = process.env.ADMIN_EMAIL || "admin@domistore.ma";
  await prisma.adminUser.upsert({ where: { email: adminEmail }, update: {}, create: { email: adminEmail, passwordHash } });
  for (const item of seedProducts) {
    const { category: categoryName, image, ...productData } = item;
    const category = await prisma.category.upsert({ where: { slug: categorySlug(categoryName) }, update: { name: categoryName }, create: { name: categoryName, slug: categorySlug(categoryName) } });
    const product = await prisma.product.upsert({ where: { slug: item.slug }, update: { ...productData, categoryId: category.id, features: productData.features }, create: { ...productData, categoryId: category.id, features: productData.features } });
    const primaryImage = await prisma.productImage.findFirst({ where: { productId: product.id, isPrimary: true }, select: { id: true } });
    if (!primaryImage) await prisma.productImage.create({ data: { id: `${product.id}-primary`, productId: product.id, url: image, alt: item.name, isPrimary: true, sortOrder: 0 } });
  }
}
main().finally(() => prisma.$disconnect());
