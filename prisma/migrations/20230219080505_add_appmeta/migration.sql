-- CreateTable
CREATE TABLE "AppMeta" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AppMeta_pkey" PRIMARY KEY ("id")
);
