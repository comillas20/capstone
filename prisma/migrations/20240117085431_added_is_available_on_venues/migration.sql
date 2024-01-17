/*
  Warnings:

  - Added the required column `isAvailable` to the `Venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Venues" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL;
