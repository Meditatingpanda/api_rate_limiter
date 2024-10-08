/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RateLimit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNumber" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "minuteCount" INTEGER NOT NULL DEFAULT 0,
    "dailyCount" INTEGER NOT NULL DEFAULT 0,
    "lastMinuteReset" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDailyReset" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RateViolation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phoneNumber" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RateLimit_phoneNumber_ipAddress_key" ON "RateLimit"("phoneNumber", "ipAddress");
