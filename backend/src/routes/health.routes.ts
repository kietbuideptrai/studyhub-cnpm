import { Router } from "express";
import { getHealthStatus } from "../services/health.service";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.json(getHealthStatus());
});
