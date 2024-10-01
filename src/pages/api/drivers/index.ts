import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const drivers = await prisma.driver.findMany({
        // include: {
        //   vehicle: true
        // },
      });
      res.status(200).json(drivers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore nel recupero dei viaggi' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    try {
      const driver = await prisma.driver.create({
        data: {
          name
        },
      });
      res.status(201).json(driver);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Errore nella creazione del viaggiox' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
