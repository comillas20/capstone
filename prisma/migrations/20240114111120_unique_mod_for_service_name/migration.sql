/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OtherServices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtherServices_name_key" ON "OtherServices"("name");
