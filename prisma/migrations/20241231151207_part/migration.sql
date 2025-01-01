/*
  Warnings:

  - Added the required column `participantId` to the `chatrooms` table without a default value. This is not possible if the table is not empty.
  - Made the column `adminId` on table `chatrooms` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `chatrooms` ADD COLUMN `participantId` INTEGER NOT NULL,
    MODIFY `adminId` INTEGER NOT NULL DEFAULT 7;

-- AddForeignKey
ALTER TABLE `chatrooms` ADD CONSTRAINT `chatrooms_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
