import cors from "cors";
import express from "express";
import { runAgent } from "./agent/agent.js";

export const createServer = async () => {
  const app = express();

  app.use(cors(), express.json());

  app.post("/chat", async (req, res) => {
    const { question } = req.body;

    const response = await runAgent(question);

    return res.json({
      response,
    });
  });

  return app;
};
