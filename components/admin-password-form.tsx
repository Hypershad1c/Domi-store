"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";

type AdminOption = { id: string; email: string };

export function AdminPasswordForm({ users, currentAdminId }: { users: AdminOption[]; currentAdminId: string }) {
  const [targetUserId, setTargetUserId] = useState(currentAdminId);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const changingOwnPassword = targetUserId === currentAdminId;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, currentPassword: changingOwnPassword ? currentPassword : undefined, newPassword, confirmPassword }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) { setError(body.error || "Impossible de modifier le mot de passe."); return; }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(body.message || "Mot de passe modifié.");
    } catch {
      setError("Service indisponible. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={submit} className="max-w-2xl rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
    <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-signal"><KeyRound size={20} /></span><div><h2 className="font-extrabold text-ink">Modifier un mot de passe</h2><p className="mt-1 text-sm leading-6 text-slate-500">Les autres sessions du compte sélectionné seront déconnectées.</p></div></div>
    <label className="mt-6 block text-sm font-semibold text-ink">Compte administrateur<select value={targetUserId} onChange={(e) => { setTargetUserId(e.target.value); setCurrentPassword(""); setError(""); setSuccess(""); }} className="mt-1.5 w-full rounded-lg border border-line bg-cloud px-3 py-2.5 outline-none focus:border-signal">{users.map((user) => <option key={user.id} value={user.id}>{user.email}{user.id === currentAdminId ? " (votre compte)" : ""}</option>)}</select></label>
    {changingOwnPassword && <label className="mt-4 block text-sm font-semibold text-ink">Mot de passe actuel<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-cloud px-3 py-2.5 outline-none focus:border-signal" /></label>}
    {!changingOwnPassword && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-slate-600">Vous réinitialisez le mot de passe de ce compte. Son mot de passe actuel n’est pas requis.</p>}
    <label className="mt-4 block text-sm font-semibold text-ink">Nouveau mot de passe<input required minLength={12} type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-cloud px-3 py-2.5 outline-none focus:border-signal" /><span className="mt-1 block text-xs font-normal text-slate-400">12 caractères minimum.</span></label>
    <label className="mt-4 block text-sm font-semibold text-ink">Confirmer le nouveau mot de passe<input required minLength={12} type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-line bg-cloud px-3 py-2.5 outline-none focus:border-signal" /></label>
    {error && <p role="alert" className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
    {success && <p role="status" className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={16} />{success}</p>}
    <button disabled={saving} className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-signal px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}Enregistrer le nouveau mot de passe</button>
  </form>;
}
