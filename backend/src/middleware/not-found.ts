import type { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ message: "Không tìm thấy endpoint" });
};
