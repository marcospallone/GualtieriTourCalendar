-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "driver" TEXT NOT NULL,
    "activity" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
