/*
  Warnings:

  - Added the required column `userId` to the `Coupoun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupoun" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Coupoun" ADD CONSTRAINT "Coupoun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
