import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const vehicleId = parseInt(id as string);
      if (isNaN(vehicleId)) {
        return res.status(400).json({ error: 'ID del veicolo non valido' });
      }
      const veicoloEliminato = await prisma.vehicle.delete({
        where: { id: vehicleId },
      });
      res.status(200).json(veicoloEliminato);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'eliminazione del veicolo' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}