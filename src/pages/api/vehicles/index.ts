import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const vehicles = await prisma.vehicle.findMany({
        // include: {},
      });
      res.status(200).json(vehicles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel recupero dei veicoli" });
    }
  } else if (req.method === "POST") {
    const { name, trips } = req.body;
    try {
      const vehicle = await prisma.vehicle.create({
        data: {
          name,
        },
      });
      res.status(201).json(vehicle);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Errore nella creazione del veicolo" });
    }
  } else {
    res.status(405).json({ error: "Metodo non consentito" });
  }
}
