-- CreateEnum
CREATE TYPE "public"."CreditTxnType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "creditBalance" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "public"."CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."CreditTxnType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
