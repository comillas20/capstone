/*
  Warnings:

  - You are about to drop the column `adminSettingsID` on the `FAQ` table. All the data in the column will be lost.
  - The primary key for the `MaintainanceDates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminSettingsID` on the `MaintainanceDates` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `MaintainanceDates` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_adminSettingsID_fkey";

-- DropForeignKey
ALTER TABLE "MaintainanceDates" DROP CONSTRAINT "MaintainanceDates_adminSettingsID_fkey";

-- DropIndex
DROP INDEX "FAQ_adminSettingsID_question_key";

-- DropIndex
DROP INDEX "MaintainanceDates_adminSettingsID_date_key";

-- AlterTable
ALTER TABLE "FAQ" DROP COLUMN "adminSettingsID";

-- AlterTable
ALTER TABLE "MaintainanceDates" DROP CONSTRAINT "MaintainanceDates_pkey",
DROP COLUMN "adminSettingsID",
DROP COLUMN "id",
ADD COLUMN     "description" TEXT,
ADD CONSTRAINT "MaintainanceDates_pkey" PRIMARY KEY ("date");
