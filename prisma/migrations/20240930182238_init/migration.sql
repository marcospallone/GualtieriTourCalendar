/*
  Warnings:

  - You are about to drop the column `vehicleId` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `vehicle` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "vehicleId",
ADD COLUMN     "vehicle" TEXT NOT NULL;
