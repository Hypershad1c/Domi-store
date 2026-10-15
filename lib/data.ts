export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  compareAt?: number;
  shortDesc: string;
  description: string;
  features: string[];
  stock: number;
  published: boolean;
  featured: boolean;
  hasCamera: boolean;
  faceId: boolean;
  images: string[];
};

export const products: Product[] = [
  {
    id: "domy-x5",
    name: "Domy X5",
    slug: "domy-x5",
    category: "Essentiel",
    categorySlug: "essentiel",
    price: 1660,
    shortDesc: "Cinq modes d'ouverture, l'essentiel intelligent pour chaque logement.",
    description: "Une serrure intuitive et fiable pour moderniser votre porte sans changer vos habitudes. Empreinte, code, carte, clé mécanique ou application : vous choisissez votre accès.",
    features: ["Empreinte digitale", "Code secret tactile", "Carte IC / RFID", "Clé mécanique de secours", "Application Tuya", "Jusqu'à 12 mois d'autonomie", "Livraison et installation gratuites"],
    stock: 12,
    published: true,
    featured: true,
    hasCamera: false,
    faceId: false,
    images: ["/product-lock.svg"]
  },
  {
    id: "domy-m1-pro",
    name: "Domy M1 Pro",
    slug: "domy-m1-pro",
    category: "Caméra & vidéophonie",
    categorySlug: "camera-videophonie",
    price: 2599,
    shortDesc: "Voyez qui est devant la porte, même quand vous n'êtes pas chez vous.",
    description: "La serrure connectée pensée pour la location saisonnière et les familles : sonnette, vidéo HD, codes temporaires et gestion à distance avec Tuya Smart.",
    features: ["Caméra HD 720p + vidéophonie", "Empreinte jusqu'à 200", "Jusqu'à 150 codes PIN", "Carte MF1 jusqu'à 200", "Tuya Smart, Wi-Fi & Bluetooth", "Codes temporaires self check-in", "Résistante à l'eau IP55", "Environ 18 mois avec 4 piles AA"],
    stock: 8,
    published: true,
    featured: true,
    hasCamera: true,
    faceId: false,
    images: ["/product-lock.svg"]
  },
  {
    id: "domy-m24",
    name: "Domy M24",
    slug: "domy-m24",
    category: "Premium Face ID",
    categorySlug: "premium-face-id",
    price: 3199,
    shortDesc: "Reconnaissance faciale, écran 5 pouces et finition premium.",
    description: "Le haut de gamme Domi'Lock pour les projets de standing. Un accès sans contact, une vision claire et un pilotage complet depuis WisHome.",
    features: ["Reconnaissance faciale 30–80 cm", "Caméra HD 1080p", "Écran 5 pouces & sonnette", "Empreinte 200 / code 150 / carte 200", "Wi-Fi, application WisHome & rapports", "Batterie rechargeable USB 5V", "Portes de 35 à 120 mm", "Alliage de zinc noir, −30 à 60 °C"],
    stock: 5,
    published: true,
    featured: true,
    hasCamera: true,
    faceId: true,
    images: ["/product-lock.svg"]
  }
];

export const comparisonRows = [
  ["Prix", "1 660 DH", "2 599 DH", "3 199 DH"],
  ["Niveau", "Essentiel", "Connecté", "Premium"],
  ["Empreinte", "Oui", "Oui · 200", "Oui · 200"],
  ["Code", "Oui", "Oui · 150", "Oui · 150"],
  ["Carte", "IC / RFID", "MF1 · 200", "IC · 200"],
  ["Clé mécanique", "Oui", "Oui", "Oui"],
  ["Application", "Tuya", "Tuya Smart", "WisHome"],
  ["Caméra", "—", "720p", "1080p"],
  ["Reconnaissance faciale", "—", "—", "Oui"],
  ["Alimentation", "4 piles · 12 mois", "4 piles AA · 18 mois", "Batterie USB 5V"]
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
