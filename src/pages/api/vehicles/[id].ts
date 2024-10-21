import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const cookies = req.headers.cookie || '';

  if (!cookies.includes('auth=true')) {
    return res.status(401).json({ error: 'Non autorizzato' });
  }
  
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const vehicleId = parseInt(id as string);
      if (isNaN(vehicleId)) {
        return res.status(400).json({ error: 'ID del veicolo non valido' });
      }
      const deletedVehicle = await prisma.vehicle.delete({
        where: { id: vehicleId },
      });
      res.status(200).json(deletedVehicle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore durante l\'eliminazione del veicolo' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}