-- CreateTable
CREATE TABLE "AdditionalFees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "reservationID" TEXT NOT NULL,

    CONSTRAINT "AdditionalFees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdditionalFees" ADD CONSTRAINT "AdditionalFees_reservationID_fkey" FOREIGN KEY ("reservationID") REFERENCES "Reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
