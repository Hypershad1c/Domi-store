CREATE TABLE "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "adminId" TEXT,
  "adminEmail" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "entityName" TEXT,
  "success" BOOLEAN NOT NULL,
  "message" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "device" TEXT,
  "method" TEXT,
  "path" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
CREATE INDEX "AdminAuditLog_success_createdAt_idx" ON "AdminAuditLog"("success", "createdAt");
CREATE INDEX "AdminAuditLog_entityType_createdAt_idx" ON "AdminAuditLog"("entityType", "createdAt");
