"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@domistore.ma");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (response.ok) {
        window.location.href = "/admin";
        return;
      }
      const body = await response.json();
      setError(body.error || "Connexion impossible. Vérifiez vos identifiants.");
    } catch {
      setError("Le service est momentanément indisponible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="grid min-h-[calc(100vh-76px)] place-items-center bg-[#F5F7FB] px-5 py-12 sm:py-16">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-[#0B1736] p-7 text-white sm:p-10 lg:min-h-[560px]">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative"><div className="inline-flex rounded-2xl bg-white p-3"><img src="/domistore-logo.png" alt="Domi'Lock" className="h-9 w-28 object-contain" /></div><p className="mt-9 text-xs font-extrabold uppercase tracking-[.2em] text-blue-200">Espace administration</p><h1 className="mt-3 max-w-md text-3xl font-extrabold leading-tight sm:text-4xl">Votre boutique, simplement pilotée.</h1><p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/75">Gérez votre catalogue, vos commandes et l’accompagnement client depuis un seul espace.</p></div>
        <div className="relative mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300"><ShieldCheck size={20} /></span><div><p className="text-sm font-bold">Accès protégé</p><p className="mt-0.5 text-xs text-blue-100/65">Réservé à votre équipe domiStore</p></div></div>
      </section>
      <section className="flex items-center p-7 sm:p-10 lg:p-12">
        <form onSubmit={submit} className="mx-auto w-full max-w-md">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-signal"><LockKeyhole size={21} /></div>
          <p className="eyebrow mt-7">Bon retour</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">Connexion</h2><p className="mt-2 text-sm leading-6 text-slate-500">Connectez-vous pour gérer les activités de la boutique.</p>
          <label className="mt-7 block text-sm font-bold text-slate-700">Adresse email<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-[#FAFBFD] px-4 py-3.5 text-sm outline-none transition focus:border-signal focus:ring-4 focus:ring-blue-100" /></label>
          <label className="mt-4 block text-sm font-bold text-slate-700">Mot de passe<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-line bg-[#FAFBFD] px-4 py-3.5 text-sm outline-none transition focus:border-signal focus:ring-4 focus:ring-blue-100" /></label>
          {error && <p role="alert" className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{loading ? <Loader2 className="animate-spin" size={17} /> : <>Accéder au tableau de bord <ArrowRight size={17} /></>}</button>
          <p className="mt-5 text-center text-xs text-slate-400">En vous connectant, vous confirmez être autorisé à gérer cette boutique.</p>
        </form>
      </section>
    </div>
  </main>;
}
