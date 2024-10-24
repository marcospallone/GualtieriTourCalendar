import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const cookies = req.headers.cookie || '';

  if (!cookies.includes('auth=true')) {
    return res.status(401).json({ error: 'Non autorizzato' });
  }
  
  if (req.method === "GET") {
    try {
      const drivers = await prisma.driver.findMany({});
      res.status(200).json(drivers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel recupero dei viaggi" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "POST") {
    const { name } = req.body;
    try {
      const driver = await prisma.driver.create({
        data: {
          name,
        },
      });
      res.status(201).json(driver);
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
