-- CreateEnum
CREATE TYPE "SettingValueTypes" AS ENUM ('int', 'float', 'string', 'date');

-- CreateTable
CREATE TABLE "SystemSettings" (
    "name" TEXT NOT NULL,
    "type" "SettingValueTypes" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("name")
);
