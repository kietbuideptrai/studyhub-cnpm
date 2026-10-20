import { loadConfig } from "./config.js";
import { createPrisma } from "./db.js";
import { seedDatabase } from "./seedData.js";

const prisma = createPrisma(loadConfig().databaseUrl);
try {
  const r = await seedDatabase(prisma);
  console.info(`Seed xong: ${r.languages} ngon ngu, ${r.spots} diem tham quan`);
} finally {
  await prisma.$disconnect();
}
