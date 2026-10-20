import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createPrisma } from "./db.js";

const config = loadConfig();
const prisma = createPrisma(config.databaseUrl);
const app = createApp(prisma, config);

const server = app.listen(config.port, "0.0.0.0", () => {
  console.info(`API chay tai http://localhost:${config.port}  (docs: /docs)`);
});

const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
