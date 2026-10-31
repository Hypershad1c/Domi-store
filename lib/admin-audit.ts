import type { AdminUser } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditAdmin = Pick<AdminUser, "id" | "email"> | null;
type AuditEvent = {
  request: Request;
  admin: AuditAdmin;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  success: boolean;
  message?: string | null;
};

type AuditedAction = Omit<AuditEvent, "success" | "message"> & {
  run: () => Promise<Response>;
};

function getDevice(userAgent: string) {
  if (!userAgent) return "Inconnu";
  const kind = /ipad|tablet/i.test(userAgent) ? "Tablette" : /mobile|iphone|android/i.test(userAgent) ? "Mobile" : "Ordinateur";
  const os = /windows/i.test(userAgent) ? "Windows" : /iphone|ipad|ios/i.test(userAgent) ? "iOS" : /android/i.test(userAgent) ? "Android" : /mac os|macintosh/i.test(userAgent) ? "macOS" : /linux/i.test(userAgent) ? "Linux" : "OS inconnu";
  const browser = /edg\//i.test(userAgent) ? "Edge" : /firefox\//i.test(userAgent) ? "Firefox" : /chrome\//i.test(userAgent) ? "Chrome" : /safari\//i.test(userAgent) ? "Safari" : "Navigateur inconnu";
  return `${kind} · ${os} · ${browser}`;
}

export async function writeAdminAudit(event: AuditEvent) {
  const userAgent = event.request.headers.get("user-agent")?.slice(0, 2000) || null;
  const forwardedFor = event.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipAddress = forwardedFor || event.request.headers.get("x-real-ip") || event.request.headers.get("cf-connecting-ip") || null;
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: event.admin?.id,
        adminEmail: event.admin?.email,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        entityName: event.entityName,
        success: event.success,
        message: event.message?.slice(0, 2000),
        ipAddress: ipAddress?.slice(0, 128),
        userAgent,
        device: getDevice(userAgent || ""),
        method: event.request.method,
        path: new URL(event.request.url).pathname,
      },
    });
  } catch (error) {
    console.error("Unable to write admin audit log", error);
  }
}

export async function runAuditedAdminAction({ run, ...event }: AuditedAction) {
  const requestData = await event.request.clone().json().catch(() => null) as { name?: unknown } | null;
  let response: Response;
  try {
    response = await run();
  } catch (error) {
    await writeAdminAudit({ ...event, entityName: event.entityName || (typeof requestData?.name === "string" ? requestData.name : null), success: false, message: error instanceof Error ? error.message : "Erreur inconnue." });
    throw error;
  }

  const body = await response.clone().json().catch(() => null) as { id?: unknown; name?: unknown; error?: unknown } | null;
  const success = response.ok;
  const bodyMessage = typeof body?.error === "string" ? body.error : null;
  const status = typeof (body as { status?: unknown } | null)?.status === "string" ? ` · Statut : ${(body as { status: string }).status}` : "";
  const message = bodyMessage || (success ? `Opération réussie.${status}` : `Échec de l’opération (${response.status}).`);
  await writeAdminAudit({
    ...event,
    entityId: (typeof body?.id === "string" ? body.id : null) || event.entityId,
    entityName: (typeof body?.name === "string" ? body.name : null) || event.entityName || (typeof requestData?.name === "string" ? requestData.name : null),
    success,
    message,
  });
  return response;
}
