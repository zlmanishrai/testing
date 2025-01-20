/*
  Warnings:

  - The primary key for the `BioHighlight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bioId` on the `BioHighlight` table. All the data in the column will be lost.
  - Added the required column `userId` to the `BioHighlight` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BioHighlight" DROP CONSTRAINT "BioHighlight_bioId_fkey";

-- AlterTable
ALTER TABLE "BioHighlight" DROP CONSTRAINT "BioHighlight_pkey",
DROP COLUMN "bioId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "BioHighlight_pkey" PRIMARY KEY ("userId", "highlightId");

-- AddForeignKey
ALTER TABLE "BioHighlight" ADD CONSTRAINT "BioHighlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
