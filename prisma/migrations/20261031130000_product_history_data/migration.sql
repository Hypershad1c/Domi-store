ALTER TABLE "AdminAuditLog"
  ADD COLUMN "previousData" JSONB,
  ADD COLUMN "newData" JSONB;
