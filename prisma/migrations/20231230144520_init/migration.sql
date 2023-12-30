-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACCEPTED', 'PENDING', 'DENIED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Reservations" (
    "id" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "eventDuration" INTEGER NOT NULL,
    "message" TEXT,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "categoryID" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "imgHref" TEXT,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "courseID" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "minimumPerHead" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubSets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "setID" INTEGER NOT NULL,
    "courseID" INTEGER NOT NULL,
    "selectionQuantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SubSets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" VARCHAR(13) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" SERIAL NOT NULL,
    "accountID" INTEGER NOT NULL,
    "darkMode" BOOLEAN NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "MaintainanceDates" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "adminSettingsID" INTEGER NOT NULL,

    CONSTRAINT "MaintainanceDates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherServices" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" INTEGER,
    "unitName" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OtherServices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DishSubSets" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ReservationsDishes" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dish_name_key" ON "Dish"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Set_name_key" ON "Set"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubSets_name_setID_key" ON "SubSets"("name", "setID");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_phoneNumber_key" ON "Account"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_accountID_key" ON "UserPreference"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "MaintainanceDates_adminSettingsID_date_key" ON "MaintainanceDates"("adminSettingsID", "date");

-- CreateIndex
CREATE UNIQUE INDEX "_DishSubSets_AB_unique" ON "_DishSubSets"("A", "B");

-- CreateIndex
CREATE INDEX "_DishSubSets_B_index" ON "_DishSubSets"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ReservationsDishes_AB_unique" ON "_ReservationsDishes"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservationsDishes_B_index" ON "_ReservationsDishes"("B");

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSets" ADD CONSTRAINT "SubSets_setID_fkey" FOREIGN KEY ("setID") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubSets" ADD CONSTRAINT "SubSets_courseID_fkey" FOREIGN KEY ("courseID") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_accountID_fkey" FOREIGN KEY ("accountID") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintainanceDates" ADD CONSTRAINT "MaintainanceDates_adminSettingsID_fkey" FOREIGN KEY ("adminSettingsID") REFERENCES "AdminSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishSubSets" ADD CONSTRAINT "_DishSubSets_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DishSubSets" ADD CONSTRAINT "_DishSubSets_B_fkey" FOREIGN KEY ("B") REFERENCES "SubSets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservationsDishes" ADD CONSTRAINT "_ReservationsDishes_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservationsDishes" ADD CONSTRAINT "_ReservationsDishes_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
