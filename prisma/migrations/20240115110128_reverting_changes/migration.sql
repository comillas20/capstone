/*
  Warnings:

  - You are about to drop the column `code` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `codeTimeStamp` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "code",
DROP COLUMN "codeTimeStamp";
