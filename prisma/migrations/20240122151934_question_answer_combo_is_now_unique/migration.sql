/*
  Warnings:

  - A unique constraint covering the columns `[question,answer]` on the table `FAQ` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FAQ_question_key";

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_question_answer_key" ON "FAQ"("question", "answer");
