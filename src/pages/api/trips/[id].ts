import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.headers.cookie || '';

  if (!cookies.includes('auth=true')) {
    return res.status(401).json({ error: 'Non autorizzato' });
  }
  
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const tripId = parseInt(id as string);
      if (isNaN(tripId)) {
        return res.status(400).json({ error: "ID del viaggio non valido" });
      }

      const { date, tripTitle, vehicleName, driverName } = req.body;

      const updatedTrip = await prisma.trip.update({
        where: { id: tripId },
        data: {
          date,
          tripTitle,
          vehicleName,
          driverName,
        },
      });

      res.status(200).json(updatedTrip);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore durante la modifica del viaggio" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "DELETE") {
    try {
      const tripId = parseInt(id as string);
      if (isNaN(tripId)) {
        return res.status(400).json({ error: "ID del viaggio non valido" });
      }

      const deletedTrip = await prisma.trip.delete({
        where: { id: tripId },
      });

      res.status(200).json(deletedTrip);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Errore durante l'eliminazione del viaggio" });
    } finally {
        await prisma.$disconnect();
      }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}
