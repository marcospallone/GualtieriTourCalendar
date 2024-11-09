import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = req.headers.cookie || "";

  if (!cookies.includes("auth=true")) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const serviceId = parseInt(id as string);
      if (isNaN(serviceId)) {
        return res.status(400).json({ error: "ID del servizio non valido" });
      }

      const { date, driver, activity } = req.body;

      const updatedService = await prisma.service.update({
        where: { id: serviceId },
        data: {
          date,
          driver,
          activity,
        },
      });

      res.status(200).json(updatedService);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Errore durante la modifica del servizio" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "DELETE") {
    try {
      const serviceId = parseInt(id as string);
      if (isNaN(serviceId)) {
        return res.status(400).json({ error: "ID del servizio non valido" });
      }

      const deletedService = await prisma.service.delete({
        where: { id: serviceId },
      });

      res.status(200).json(deletedService);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Errore durante l'eliminazione del servizio" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}
