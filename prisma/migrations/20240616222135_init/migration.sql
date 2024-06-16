/*
  Warnings:

  - Added the required column `medicId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` ADD COLUMN `medicId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_medicId_fkey` FOREIGN KEY (`medicId`) REFERENCES `Medic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
