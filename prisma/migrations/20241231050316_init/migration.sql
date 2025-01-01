-- DropForeignKey
ALTER TABLE `chatrooms` DROP FOREIGN KEY `chatrooms_orderId_fkey`;

-- AddForeignKey
ALTER TABLE `chatrooms` ADD CONSTRAINT `chatrooms_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
