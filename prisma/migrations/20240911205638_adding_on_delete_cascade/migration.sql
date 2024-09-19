/*
  Warnings:

  - You are about to alter the column `image` on the `ProductImages` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "ProductImages" DROP CONSTRAINT "ProductImages_productId_fkey";

-- AlterTable
ALTER TABLE "ProductImages" ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
