-- DropForeignKey
ALTER TABLE `messages` DROP FOREIGN KEY `messages_chatRoomId_fkey`;

-- DropIndex
DROP INDEX `messages_chatRoomId_fkey` ON `messages`;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `chatrooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
