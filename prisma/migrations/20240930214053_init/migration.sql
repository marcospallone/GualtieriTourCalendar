/*
  Warnings:

  - You are about to drop the column `vehicle` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `vehicleName` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "vehicle",
ADD COLUMN     "vehicleName" TEXT NOT NULL;
