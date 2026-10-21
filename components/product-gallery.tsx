"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const safeImages = images.length ? images : ["/product-lock.svg"];
  const current = Math.min(active, safeImages.length - 1);
  const previous = () => setActive((value) => (value - 1 + safeImages.length) % safeImages.length);
  const next = () => setActive((value) => (value + 1) % safeImages.length);

  function onTouchStart(event: React.TouchEvent) {
    setTouchStart(event.changedTouches[0]?.clientX ?? null);
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStart === null || safeImages.length < 2) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(distance) > 45) distance < 0 ? next() : previous();
    setTouchStart(null);
  }

  useEffect(() => {
    if (!zoom) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setZoom(false);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, safeImages.length]);

  return <>
    <div className="min-w-0 max-w-full rounded-[2rem] border border-line bg-cloud p-3 sm:p-4">
      <div className="group relative overflow-hidden rounded-[1.5rem] bg-white" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <img key={safeImages[current]} src={safeImages[current]} alt={`${name} — image ${current + 1}`} className="h-[min(100vw,360px)] w-full max-w-full cursor-zoom-in select-none object-cover transition duration-500 group-hover:scale-[1.02] animate-gallery-image sm:h-[420px] lg:h-[560px]" draggable={false} onClick={() => setZoom(true)} />
        <button type="button" aria-label="Agrandir l'image" onClick={() => setZoom(true)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-card transition duration-200 hover:scale-105 hover:bg-signal hover:text-white active:scale-90"><Maximize2 size={17} /></button>
        {safeImages.length > 1 && <>
          <button type="button" aria-label="Image précédente" onClick={previous} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition duration-200 hover:scale-105 hover:bg-signal hover:text-white active:scale-90"><ChevronLeft size={20} /></button>
          <button type="button" aria-label="Image suivante" onClick={next} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-card transition duration-200 hover:scale-105 hover:bg-signal hover:text-white active:scale-90"><ChevronRight size={20} /></button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-white">{current + 1} / {safeImages.length}</span>
        </>}
      </div>
      {safeImages.length > 1 && <div className="mt-3 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-5">{safeImages.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => setActive(index)} aria-label={`Afficher l'image ${index + 1}`} aria-current={current === index} className={`w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition duration-200 hover:-translate-y-0.5 active:scale-95 sm:w-auto ${current === index ? "border-signal" : "border-transparent"}`}><img src={image} alt={`${name} miniature ${index + 1}`} className="h-20 w-full object-cover sm:h-24" /></button>)}</div>}
      <p className="mt-2 text-center text-[11px] font-semibold text-slate-400 sm:hidden">Balayez pour voir les autres images</p>
    </div>
    {zoom && <div role="dialog" aria-modal="true" aria-label={`Zoom — ${name}`} className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 sm:p-10 animate-zoom-backdrop" onClick={() => setZoom(false)}>
      <button type="button" aria-label="Fermer le zoom" onClick={() => setZoom(false)} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-card transition hover:scale-105 active:scale-90"><X size={21} /></button>
      <img key={safeImages[current]} src={safeImages[current]} alt={`${name} — zoom`} className="max-h-[90vh] max-w-[94vw] rounded-2xl object-contain animate-zoom-image" onClick={(event) => event.stopPropagation()} />
      {safeImages.length > 1 && <>
        <button type="button" aria-label="Image précédente" onClick={(event) => { event.stopPropagation(); previous(); }} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition hover:scale-105 active:scale-90"><ChevronLeft size={21} /></button>
        <button type="button" aria-label="Image suivante" onClick={(event) => { event.stopPropagation(); next(); }} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition hover:scale-105 active:scale-90"><ChevronRight size={21} /></button>
      </>}
    </div>}
  </>;
}
