/*
  Warnings:

  - A unique constraint covering the columns `[question]` on the table `FAQ` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FAQ_question_key" ON "FAQ"("question");
