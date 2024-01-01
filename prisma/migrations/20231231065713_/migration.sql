/*
  Warnings:

  - Added the required column `dataType` to the `SystemSettings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('date', 'number', 'string');

-- AlterTable
ALTER TABLE "SystemSettings" ADD COLUMN     "dataType" "DataType" NOT NULL;
