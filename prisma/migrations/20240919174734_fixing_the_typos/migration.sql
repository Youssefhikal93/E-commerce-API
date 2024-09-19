/*
  Warnings:

  - You are about to drop the column `coupounCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Coupoun` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Coupoun" DROP CONSTRAINT "Coupoun_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_coupounCode_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "coupounCode",
ADD COLUMN     "couponCode" TEXT;

-- DropTable
DROP TABLE "Coupoun";

-- CreateTable
CREATE TABLE "Coupon" (
    "code" TEXT NOT NULL,
    "discountPrice" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL DEFAULT 'PERCENT',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponCode_fkey" FOREIGN KEY ("couponCode") REFERENCES "Coupon"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
