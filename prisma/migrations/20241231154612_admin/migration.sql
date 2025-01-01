-- AlterTable
ALTER TABLE `chatrooms` ALTER COLUMN `adminId` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `chatrooms` ADD CONSTRAINT `chatrooms_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
