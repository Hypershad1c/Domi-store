"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export function ProductBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [camera, setCamera] = useState("all");
  const [faceId, setFaceId] = useState("all");
  const [sort, setSort] = useState("featured");
  const categories = [...new Set(products.map((product) => product.category))];
  const filtered = useMemo(() => products
    .filter((product) => (!query || `${product.name} ${product.shortDesc}`.toLowerCase().includes(query.toLowerCase()))
      && (category === "all" || product.category === category)
      && (camera === "all" || String(product.hasCamera) === camera)
      && (faceId === "all" || String(product.faceId) === faceId))
    .sort((a, b) => sort === "price-up" ? a.price - b.price : sort === "price-down" ? b.price - a.price : Number(b.featured) - Number(a.featured)),
  [products, query, category, camera, faceId, sort]);

  const selectClass = "min-w-0 w-full rounded-xl border border-line bg-cloud px-3 py-3 text-sm outline-none focus:border-signal";

  return <div>
    <div className="mb-8 rounded-2xl border border-line bg-white p-3 shadow-card sm:p-4">
      <div className="grid grid-cols-2 gap-3 lg:flex lg:items-center">
        <label className="relative col-span-2 min-w-0 lg:flex-1">
          <span className="sr-only">Rechercher une serrure</span>
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une serrure..." className="w-full rounded-xl border border-line bg-cloud py-3 pl-10 pr-4 text-sm outline-none focus:border-signal" />
        </label>
        <div className="col-span-2 flex items-center gap-2 px-1 text-xs font-semibold text-slate-500 lg:hidden"><SlidersHorizontal size={15} />Filtres et tri</div>
        <select aria-label="Gamme" value={category} onChange={(event) => setCategory(event.target.value)} className={`${selectClass} col-span-2 lg:col-span-1`}><option value="all">Toutes les gammes</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filtrer par caméra" value={camera} onChange={(event) => setCamera(event.target.value)} className={selectClass}><option value="all">Caméra : toutes</option><option value="true">Avec caméra</option><option value="false">Sans caméra</option></select>
        <select aria-label="Filtrer par Face ID" value={faceId} onChange={(event) => setFaceId(event.target.value)} className={selectClass}><option value="all">Face ID : toutes</option><option value="true">Avec Face ID</option><option value="false">Sans Face ID</option></select>
        <select aria-label="Trier les produits" value={sort} onChange={(event) => setSort(event.target.value)} className={`${selectClass} col-span-2 sm:col-span-1`}><option value="featured">À découvrir</option><option value="price-up">Prix croissant</option><option value="price-down">Prix décroissant</option></select>
      </div>
    </div>
    <p className="mb-5 text-sm text-slate-500">{filtered.length} modèle{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="rounded-2xl border border-dashed border-line py-20 text-center text-slate-500">Aucun modèle ne correspond à votre recherche.</div>}
  </div>;
}
