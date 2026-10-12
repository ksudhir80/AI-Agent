import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

import { runAgent } from "./agent";

console.log(
  "API key loaded:",
  !!process.env.OPENAI_API_KEY
);

const app = express();

const PORT = 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());


// ------------------------------------
// Health Check
// ------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({
    message: "AI Agent API is running",
  });
});


// ------------------------------------
// AI Chat
// ------------------------------------

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    console.log(
      "User message:",
      message
    );

    const answer = await runAgent(
      openai,
      message
    );

    console.log(
      "Agent final answer:",
      answer
    );

    return res.json({
      response: answer,
    });

  } catch (error) {

    console.error(
      "Agent Error:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to process agent request",
    });
  }
});


// ------------------------------------
// Start Server
// ------------------------------------

app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});