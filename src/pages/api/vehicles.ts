import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const trips = await prisma.vehicle.findMany({
        include: {

        },
      });
      res.status(200).json(trips);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore nel recupero dei viaggi' });
    }
  } else if (req.method === 'POST') {
    const { name, trips } = req.body;
    try {
      const trip = await prisma.vehicle.create({
        data: {
          name,
          trips
        },
      });
      res.status(201).json(trip);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Errore nella creazione del viaggiox' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
