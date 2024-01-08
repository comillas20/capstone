/*
  Warnings:

  - The primary key for the `MaintainanceDates` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MaintainanceDates" DROP CONSTRAINT "MaintainanceDates_pkey",
ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "MaintainanceDates_pkey" PRIMARY KEY ("date");
