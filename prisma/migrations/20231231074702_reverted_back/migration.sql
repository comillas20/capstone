/*
  Warnings:

  - You are about to drop the `SystemSettings` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[adminSettingsID,question]` on the table `FAQ` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adminSettingsID,date]` on the table `MaintainanceDates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminSettingsID` to the `FAQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminSettingsID` to the `MaintainanceDates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "adminSettingsID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "MaintainanceDates" ADD COLUMN     "adminSettingsID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "SystemSettings";

-- DropEnum
DROP TYPE "DataType";

-- CreateTable
CREATE TABLE "AdminSettings" (
    "id" SERIAL NOT NULL,
    "openingTime" TIMESTAMP(3) NOT NULL,
    "closingTime" TIMESTAMP(3) NOT NULL,
    "minimumCustomerReservationHours" INTEGER NOT NULL,
    "maximumCustomerReservationHours" INTEGER NOT NULL,
    "defaultMinimumPerHead" INTEGER NOT NULL,
    "reservationCostPerHour" INTEGER NOT NULL,

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_adminSettingsID_question_key" ON "FAQ"("adminSettingsID", "question");

-- CreateIndex
CREATE UNIQUE INDEX "MaintainanceDates_adminSettingsID_date_key" ON "MaintainanceDates"("adminSettingsID", "date");

-- AddForeignKey
ALTER TABLE "MaintainanceDates" ADD CONSTRAINT "MaintainanceDates_adminSettingsID_fkey" FOREIGN KEY ("adminSettingsID") REFERENCES "AdminSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_adminSettingsID_fkey" FOREIGN KEY ("adminSettingsID") REFERENCES "AdminSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
