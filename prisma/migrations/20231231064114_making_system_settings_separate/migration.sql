/*
  Warnings:

  - You are about to drop the column `adminSettingsID` on the `MaintainanceDates` table. All the data in the column will be lost.
  - You are about to drop the `AdminSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MaintainanceDates" DROP CONSTRAINT "MaintainanceDates_adminSettingsID_fkey";

-- DropIndex
DROP INDEX "MaintainanceDates_adminSettingsID_date_key";

-- AlterTable
ALTER TABLE "MaintainanceDates" DROP COLUMN "adminSettingsID";

-- DropTable
DROP TABLE "AdminSettings";

-- CreateTable
CREATE TABLE "SystemSettings" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);
