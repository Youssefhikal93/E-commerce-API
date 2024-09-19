-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'VALUE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "coupounCode" TEXT;

-- CreateTable
CREATE TABLE "Coupoun" (
    "code" TEXT NOT NULL,
    "discountPrice" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT',

    CONSTRAINT "Coupoun_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_coupounCode_fkey" FOREIGN KEY ("coupounCode") REFERENCES "Coupoun"("code") ON DELETE SET NULL ON UPDATE CASCADE;
