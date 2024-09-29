/*
  Warnings:

  - You are about to drop the `Veicolo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Viaggio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Viaggio" DROP CONSTRAINT "Viaggio_veicoloId_fkey";

-- DropTable
DROP TABLE "Veicolo";

-- DropTable
DROP TABLE "Viaggio";

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
