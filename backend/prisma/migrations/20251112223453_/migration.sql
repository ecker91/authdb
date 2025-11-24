/*
  Warnings:

  - You are about to drop the column `ano` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `cambio` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `marca` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `motor` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `produto` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `produto` table. All the data in the column will be lost.
  - Added the required column `estampa` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamanho` to the `produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tecido` to the `produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` DROP COLUMN `ano`,
    DROP COLUMN `cambio`,
    DROP COLUMN `marca`,
    DROP COLUMN `motor`,
    DROP COLUMN `preco`,
    DROP COLUMN `status`,
    ADD COLUMN `estampa` VARCHAR(191) NOT NULL,
    ADD COLUMN `tamanho` VARCHAR(191) NOT NULL,
    ADD COLUMN `tecido` VARCHAR(191) NOT NULL;
