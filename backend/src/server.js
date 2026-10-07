import cors from "cors";
import express from "express";
import { runAgent } from "./agent/agent.js";

export const createServer = async () => {
  const app = express();

  app.use(cors(), express.json());

  app.post("/chat", async (req, res) => {
    const { question, conversationId } = req.body;

    if (!question || !conversationId) {
      res.status(400).json({
        message: "All fields must required!!!",
      });

      return;
    }

    const response = await runAgent(question, conversationId);

    return res.json({
      messages: response,
    });
  });

  return app;
};
