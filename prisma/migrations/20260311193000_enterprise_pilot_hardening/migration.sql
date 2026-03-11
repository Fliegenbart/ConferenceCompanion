ALTER TABLE "User"
ADD COLUMN "entraObjectId" TEXT,
ADD COLUMN "entraTenantId" TEXT,
ADD COLUMN "lastEntraSyncAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "User_entraObjectId_key" ON "User"("entraObjectId");
