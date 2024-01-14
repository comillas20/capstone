/*
  Warnings:

  - You are about to drop the column `selectionQuantity` on the `SubSets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "selectionQuantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SubSets" DROP COLUMN "selectionQuantity";

-- CreateTable
CREATE TABLE "Itemlist" (
    "id" TEXT NOT NULL,
    "setid" INTEGER NOT NULL,
    "reserveid" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Itemlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueList" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "MaxCapacity" INTEGER NOT NULL,

    CONSTRAINT "VenueList_pkey" PRIMARY KEY ("id")
);
