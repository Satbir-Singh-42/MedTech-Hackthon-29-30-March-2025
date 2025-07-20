import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

// Mock data for meditation and professionals
const moods = [
  { id: "great", emoji: "😄", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "down", emoji: "😔", label: "Down" },
  { id: "stressed", emoji: "😰", label: "Stressed" },
];

const moodEntries = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get moods
  app.get("/api/moods", (req, res) => {
    res.json(moods);
  });

  // Record mood entry
  app.post("/api/mood-entries", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const userId = req.user!.id;
    const schema = z.object({
      mood: z.string(),
      notes: z.string().optional(),
    });

    try {
      const { mood, notes } = schema.parse(req.body);
      const entry = {
        id: Date.now().toString(),
        mood,
        notes,
        timestamp: new Date(),
        userId
      };

      // Store the mood entry for the user
      if (!moodEntries.has(userId)) {
        moodEntries.set(userId, []);
      }
      moodEntries.get(userId).push(entry);

      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get mood entries for the user
  app.get("/api/mood-entries", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const userId = req.user!.id;
    const userEntries = moodEntries.get(userId) || [];
    
    res.json(userEntries);
  });

  // Simulated AI response endpoint
  app.post("/api/chat", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const messageSchema = z.object({
      message: z.string()
    });

    try {
      const { message } = messageSchema.parse(req.body);
      
      // Simple message response matching
      let response;
      if (message.toLowerCase().includes("stress") || message.toLowerCase().includes("anxious")) {
        response = {
          text: "I'm sorry to hear you're feeling stressed. Would you like to try a quick breathing exercise to help you relax?",
          sentiment: "stress",
          suggestions: ["Try breathing exercise", "Show meditation"]
        };
      } else if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("down")) {
        response = {
          text: "I understand feeling down can be difficult. Would you like to talk more about what's bothering you, or perhaps try a mood-lifting meditation?",
          sentiment: "sadness",
          suggestions: ["Talk more", "Mood-lifting meditation"]
        };
      } else if (message.toLowerCase().includes("happy") || message.toLowerCase().includes("good")) {
        response = {
          text: "I'm glad to hear you're feeling good! It's wonderful to experience positive emotions. Would you like to build on this feeling with a gratitude meditation?",
          sentiment: "happiness",
          suggestions: ["Gratitude meditation", "Journal this feeling"]
        };
      } else {
        response = {
          text: "Thank you for sharing. How else can I support you today?",
          sentiment: "neutral",
          suggestions: ["Explore meditations", "Track your mood"]
        };
      }

      res.json({
        id: Date.now(),
        message: response.text,
        sentiment: response.sentiment,
        suggestions: response.suggestions,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid message format" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
