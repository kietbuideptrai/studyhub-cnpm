import cors from "cors";
import express from "express";
import { artifactsRouter } from "./routes/artifacts.routes";
import { healthRouter } from "./routes/health.routes";
import { languagesRouter } from "./routes/languages.routes";
import { corsOptions } from "./middleware/cors";
import { errorHandler } from "./middleware/errors";
import { notFoundHandler } from "./middleware/not-found";

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/artifacts", artifactsRouter);
app.use("/api/languages", languagesRouter);
app.use("/api/health", healthRouter);
app.use(notFoundHandler);
app.use(errorHandler);
