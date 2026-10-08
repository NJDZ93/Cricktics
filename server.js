import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "node:process";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing from .env");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { playerA, playerB, question } = req.body;

    if (!playerA || !playerB || !question) {
      return res.status(400).json({
        error: "Player information and question are required.",
      });
    }

    const prompt = `
You are Cricktics AI, a cricket analytics assistant.

Analyze these two players using ONLY the statistics provided.

PLAYER A:
Name: ${playerA.name}
Role: ${playerA.role}
Matches: ${playerA.matches}
Runs: ${playerA.runs}
Average: ${playerA.average}
Strike Rate: ${playerA.strikeRate}
100s: ${playerA.hundreds}
50s: ${playerA.fifties}

PLAYER B:
Name: ${playerB.name}
Role: ${playerB.role}
Matches: ${playerB.matches}
Runs: ${playerB.runs}
Average: ${playerB.average}
Strike Rate: ${playerB.strikeRate}
100s: ${playerB.hundreds}
50s: ${playerB.fifties}

QUESTION:
${question}

Give a concise cricket analysis.

Rules:
- Compare only the supplied numbers.
- Explain your reasoning.
- Do not invent statistics.
- If the data is insufficient, say so.
- Keep the answer around 100-150 words.
`;

    // Try different Gemini models instead of repeatedly
    // hitting the same overloaded model.
    const models = [
      "gemini-3.7-flash",
      "gemini-3.8-flash",
    ];

    let response = null;

    for (const model of models) {
      try {
        console.log(`🤖 Trying Gemini model: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        console.log(`✅ Gemini response received from ${model}`);

        break;
      } catch (error) {
        console.error(
          `⚠️ ${model} failed:`,
          error.message
        );

        if (error.status !== 503 && error.status !== 429) {
          throw error;
        }

        console.log(
          `➡️ Trying the next available model...`
        );
      }
    }

    if (!response) {
      return res.status(503).json({
        error:
          "Gemini is temporarily unavailable. Please try again shortly.",
      });
    }

    res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error("❌ Gemini error:", error);

    res.status(500).json({
      error:
        "Unable to generate AI analysis. Please try again.",
    });
  }
});

app.listen(3001, () => {
  console.log(
    "🤖 Cricktics AI server running on http://localhost:3001"
  );
});