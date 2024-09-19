/*
  Warnings:

  - You are about to drop the column `otderId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_otderId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "otderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
