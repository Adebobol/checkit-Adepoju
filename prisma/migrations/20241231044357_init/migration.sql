-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_ownerId_fkey`;

-- DropIndex
DROP INDEX `orders_ownerId_fkey` ON `orders`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
