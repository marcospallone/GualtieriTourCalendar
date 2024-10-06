import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const trips = await prisma.trip.findMany({
        // include: {
        //   vehicle: true
        // },
      });
      res.status(200).json(trips);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel recupero dei viaggi" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    const { date, tripTitle, vehicleName, driverName } = req.body;
    try {
      const trip = await prisma.trip.create({
        data: {
          date: new Date(date),
          tripTitle,
          vehicleName,
          driverName,
        },
      });
      res.status(201).json(trip);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Errore nella creazione del viaggiox" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Metodo non consentito" });
  }
}
