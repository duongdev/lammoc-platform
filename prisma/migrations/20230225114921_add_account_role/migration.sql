-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('DEVELOPER', 'ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "roles" "AccountRole"[];
