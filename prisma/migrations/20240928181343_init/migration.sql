-- CreateTable
CREATE TABLE "Viaggio" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "destinazione" TEXT NOT NULL,
    "veicoloId" INTEGER NOT NULL,

    CONSTRAINT "Viaggio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veicolo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Veicolo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Viaggio" ADD CONSTRAINT "Viaggio_veicoloId_fkey" FOREIGN KEY ("veicoloId") REFERENCES "Veicolo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
