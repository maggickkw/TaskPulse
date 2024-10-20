/*
  Warnings:

  - You are about to drop the column `fileURl` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `fileURL` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_teamId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "fileURl",
ADD COLUMN     "fileURL" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
