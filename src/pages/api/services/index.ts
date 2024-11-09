import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const cookies = req.headers.cookie || "";

  if (!cookies.includes("auth=true")) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  if (req.method === "GET") {
    try {
      const services = await prisma.service.findMany({});
      res.status(200).json(services);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    const { date, driver, activity } = req.body;
    try {
      const newService = await prisma.service.create({
        data: {
          date: new Date(date),
          driver,
          activity,
        },
      });
      res.status(201).json(newService);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Errore nella creazione del servizio" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Metodo non consentito" });
  }
}
