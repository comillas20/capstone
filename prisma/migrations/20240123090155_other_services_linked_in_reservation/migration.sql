-- CreateTable
CREATE TABLE "_OtherServicesToReservations" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OtherServicesToReservations_AB_unique" ON "_OtherServicesToReservations"("A", "B");

-- CreateIndex
CREATE INDEX "_OtherServicesToReservations_B_index" ON "_OtherServicesToReservations"("B");

-- AddForeignKey
ALTER TABLE "_OtherServicesToReservations" ADD CONSTRAINT "_OtherServicesToReservations_A_fkey" FOREIGN KEY ("A") REFERENCES "OtherServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherServicesToReservations" ADD CONSTRAINT "_OtherServicesToReservations_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
