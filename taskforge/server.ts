import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to prevent server crashes on startup if GEMINI_API_KEY is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined or is empty in settings.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// AI Endpoint: Generate Substeps, Time Estimate, and suggested slot for a task
app.post("/api/generate-substeps", async (req, res) => {
  const { title, category, deadline, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Task title is required." });
  }

  try {
    const prompt = `Given a task details:
Title: "${title}"
Category: "${category || "general"}"
Deadline: "${deadline || "no explicit deadline"}"
Description: "${description || "no description provided"}"

Analyze this task as a high-performance productivity consultant. Proactively break it down into 3 to 5 clear, sequential, and highly actionable sub-steps. Estimate the total minutes required to perform this task in one session, suggest a precise optimal time slot (e.g., 'Tomorrow at 10:00 AM' or 'Friday at 2:00 PM'), and write a professional 'actionPlanDraft' (for example: a email follow-up draft, list of questions to ask, or a research outline to speed up execution). If no draft is helpful or applicable, write a short execution guide.

Provide your analysis strictly in JSON format matching the schema requested.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            substeps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 to 5 highly actionable, sequential sub-steps."
            },
            estimatedMinutes: {
              type: Type.INTEGER,
              description: "Total estimated minutes required for the task."
            },
            suggestedTimeSlot: {
              type: Type.STRING,
              description: "A specific recommended day and time slot to tackle this."
            },
            actionPlanDraft: {
              type: Type.STRING,
              description: "An email draft, template, checklist, or template message to kickstart execution."
            }
          },
          required: ["substeps", "estimatedMinutes", "suggestedTimeSlot", "actionPlanDraft"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating substeps:", error);
    res.status(500).json({
      error: "Failed to generate substeps.",
      details: error.message || String(error)
    });
  }
});

// AI Endpoint: Proactive, personalized context-aware productivity recommendations
app.post("/api/generate-recommendations", async (req, res) => {
  const { tasks, goals, currentTime } = req.body;

  try {
    const prompt = `You are a proactive, context-aware AI productivity engineer. Your job is to prevent missed deadlines and maintain habit momentum.
Analyze the user's details:
Current Time context: ${currentTime}
Tasks List: ${JSON.stringify(tasks || [])}
Goals/Habits List: ${JSON.stringify(goals || [])}

Proactively generate exactly 3 highly personalized, context-aware productivity recommendations or alerts. Consider:
1. Impending or overdue deadlines.
2. Bill payments, meeting prep, or commitment milestones that need proactive starting (drafting work, etc.).
3. Low momentum habits (streaks that are about to drop or daily goals not logged yet).
4. Sane advice about rest or work distribution.

For each, provide:
- 'title': direct and interesting (max 5 words, e.g. "Prep Meeting Notes", "Shield Habit Streak", "Imminent Bill Deadline").
- 'message': clear explanation of what they should do now and how to unblock it (1-2 sentences, friendly and action-oriented).
- 'type': 'alert' (high urgency, <24h), 'insight' (efficiency habit streaks/history), or 'tip' (general planning/advice).
- 'actionableId': the specific Task or Goal 'id' if this recom is about a specific item, or omit if general.
- 'actionLabel': direct CTA text (e.g. "Start Drafting", "Log Habit", "Fix Schedule").

Provide your analysis strictly in JSON format matching the schema requested.`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  message: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Must be alert, insight, or tip" },
                  actionableId: { type: Type.STRING },
                  actionLabel: { type: Type.STRING }
                },
                required: ["title", "message", "type", "actionLabel"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      error: "Failed to generate recommendations.",
      details: error.message || String(error)
    });
  }
});

// AI Endpoint: Chat coaching conversation with productivity context
app.post("/api/chat", async (req, res) => {
  const { message, chatHistory, tasks, goals } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const contextPrompt = `You are a warm, active, and encouraging digital AI Productivity Companion and Executive Assistant.
Your task is to proactively help the user organize their day, complete tasks, form habits, and draft materials.

User's current contextual data:
- Tasks: ${JSON.stringify(tasks || [])}
- Goals & Habits: ${JSON.stringify(goals || [])}

Review this data when answering. If the user asks a question, requests a script or email draft, wants a priority outline, or needs an schedule review, reply directly with actionable steps. Be concise.

Return your response in a structural JSON containing 'text' (Markdown response) and 'suggestions' (an array of 2-3 clickable quick response suggestions or action items for the user, e.g., ["Break down Work draft", "Draft Email follow-up", "Re-prioritize high priority tasks"]).`;

    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Generate response using gemini-3.5-flash
    const response = await getGeminiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: contextPrompt }] },
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Structured markdown format response." },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 short actions the user could click next."
            }
          },
          required: ["text", "suggestions"]
        }
      }
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in chat:", error);
    res.status(500).json({
      error: "Failed to process chat.",
      details: error.message || String(error)
    });
  }
});

// Handle serving Frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
