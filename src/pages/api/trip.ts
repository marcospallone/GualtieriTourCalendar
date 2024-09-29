import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { data, destinazione, veicoloId } = req.body;
    try {
      const viaggio = await prisma.viaggio.create({
        data: {
          data: new Date(data),
          destinazione,
          veicoloId
        },
      });
      res.status(201).json(viaggio);
    } catch (error) {
      res.status(500).json({ error: 'Errore nella creazione del viaggio' });
    }
  } else {
    res.status(405).json({ error: 'Metodo non consentito' });
  }
}
