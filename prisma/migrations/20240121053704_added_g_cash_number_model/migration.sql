-- CreateTable
CREATE TABLE "GCashNumbers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "GCashNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GCashNumbers_name_key" ON "GCashNumbers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GCashNumbers_phoneNumber_key" ON "GCashNumbers"("phoneNumber");
