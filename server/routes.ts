import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { updateProfileSchema } from "@shared/schema";

// ── Static reference data ─────────────────────────────────────────────

const moods = [
  { id: "great", emoji: "😄", label: "Great" },
  { id: "good", emoji: "🙂", label: "Good" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "down", emoji: "😔", label: "Down" },
  { id: "stressed", emoji: "😰", label: "Stressed" },
];

// ── AI chat helpers ───────────────────────────────────────────────────

interface AiResponse {
  text: string;
  sentiment: string;
  suggestions: string[];
}

const keywordRules: { keywords: string[]; response: AiResponse }[] = [
  {
    keywords: [
      "stress",
      "anxious",
      "anxiety",
      "overwhelm",
      "panic",
      "nervous",
      "tense",
      "worried",
    ],
    response: {
      text: "I hear that you're feeling stressed or anxious. That's a very common experience, and it's okay to feel this way. Would you like to try a guided breathing exercise, or would you prefer to talk through what's causing these feelings?",
      sentiment: "stress",
      suggestions: [
        "Try breathing exercise",
        "Guided meditation",
        "Talk more about it",
      ],
    },
  },
  {
    keywords: [
      "sad",
      "down",
      "depress",
      "lonely",
      "hopeless",
      "crying",
      "grief",
      "loss",
    ],
    response: {
      text: "I'm sorry you're going through a tough time. It takes courage to open up about feeling down. Remember, it's okay to not be okay. Would you like some suggestions to help lift your mood, or do you just need someone to listen?",
      sentiment: "sadness",
      suggestions: [
        "Mood-lifting meditation",
        "Journal your feelings",
        "Talk more",
      ],
    },
  },
  {
    keywords: [
      "happy",
      "good",
      "great",
      "amazing",
      "wonderful",
      "grateful",
      "excited",
      "joy",
    ],
    response: {
      text: "That's wonderful to hear! Positive emotions are worth savouring. Would you like to do a gratitude meditation to deepen this feeling, or maybe journal about what made you feel this way?",
      sentiment: "happiness",
      suggestions: [
        "Gratitude meditation",
        "Journal this feeling",
        "Share more",
      ],
    },
  },
  {
    keywords: ["sleep", "insomnia", "tired", "exhausted", "fatigue", "rest"],
    response: {
      text: "Sleep is so important for mental well-being. Poor sleep can amplify negative emotions. Would you like to try a sleep meditation, or shall we discuss some sleep hygiene tips?",
      sentiment: "sleep",
      suggestions: [
        "Sleep meditation",
        "Sleep hygiene tips",
        "Relaxation exercise",
      ],
    },
  },
  {
    keywords: [
      "angry",
      "frustrated",
      "irritated",
      "annoyed",
      "rage",
      "furious",
    ],
    response: {
      text: "Anger is a natural emotion, and acknowledging it is the first step. Let's work through it. Would you like to try a calming exercise, or would you like to vent about what's bothering you?",
      sentiment: "anger",
      suggestions: ["Calming exercise", "Talk it out", "Body scan meditation"],
    },
  },
  {
    keywords: [
      "focus",
      "concentrate",
      "distract",
      "productive",
      "procrastinat",
    ],
    response: {
      text: "Staying focused can be challenging. Mindfulness techniques can really help sharpen concentration. Would you like to try a focus meditation, or discuss strategies for managing distractions?",
      sentiment: "focus",
      suggestions: [
        "Focus meditation",
        "Productivity tips",
        "Pomodoro technique",
      ],
    },
  },
];

function generateAiResponse(message: string): AiResponse {
  const lower = message.toLowerCase();
  for (const rule of keywordRules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }
  return {
    text: "Thank you for sharing. I'm here to support you however I can. Would you like to explore meditation, track your mood, or just keep chatting?",
    sentiment: "neutral",
    suggestions: ["Explore meditations", "Track your mood", "Keep chatting"],
  };
}

// ── Routes ────────────────────────────────────────────────────────────

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // ── Moods reference ──────────────────────────────────────────────
  app.get("/api/moods", (_req, res) => res.json(moods));

  // ── Mood entries ─────────────────────────────────────────────────

  app.get("/api/mood-entries", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getMoodEntries(req.user!.id);
    res.json(entries);
  });

  app.post("/api/mood-entries", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({ mood: z.string(), notes: z.string().optional() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid request data" });

    const entry = await storage.createMoodEntry({
      userId: req.user!.id,
      mood: parsed.data.mood,
      notes: parsed.data.notes,
    });
    res.status(201).json(entry);
  });

  // ── Chat ─────────────────────────────────────────────────────────

  app.get("/api/chat/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const messages = await storage.getChatMessages(req.user!.id);
    res.json(messages);
  });

  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({ message: z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid message format" });

    const userId = req.user!.id;

    // Persist user message
    await storage.createChatMessage({
      userId,
      sender: "user",
      message: parsed.data.message,
    });

    // Generate & persist AI response
    const ai = generateAiResponse(parsed.data.message);
    const aiMessage = await storage.createChatMessage({
      userId,
      sender: "ai",
      message: ai.text,
      sentiment: ai.sentiment,
      suggestions: ai.suggestions,
    });

    res.json(aiMessage);
  });

  // ── Journal entries ──────────────────────────────────────────────

  app.get("/api/journal", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const entries = await storage.getJournalEntries(req.user!.id);
    res.json(entries);
  });

  app.post("/api/journal", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      mood: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid request data" });

    const entry = await storage.createJournalEntry({
      userId: req.user!.id,
      title: parsed.data.title,
      content: parsed.data.content,
      mood: parsed.data.mood,
      tags: parsed.data.tags,
    });
    res.status(201).json(entry);
  });

  app.put("/api/journal/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const schema = z.object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      mood: z.string().optional(),
      tags: z.array(z.string()).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid request data" });

    const updated = await storage.updateJournalEntry(
      id,
      req.user!.id,
      parsed.data,
    );
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.json(updated);
  });

  app.delete("/api/journal/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const deleted = await storage.deleteJournalEntry(id, req.user!.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.sendStatus(204);
  });

  // ── Profile ──────────────────────────────────────────────────────

  app.patch("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid profile data" });

    const updated = await storage.updateProfile(req.user!.id, parsed.data);
    if (!updated) return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = updated;
    res.json(safeUser);
  });

  // ── Emergency contacts ───────────────────────────────────────────

  app.get("/api/emergency-contacts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const contacts = await storage.getEmergencyContacts(req.user!.id);
    res.json(contacts);
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({
      name: z.string().min(1),
      relationship: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Invalid contact data" });

    const contact = await storage.createEmergencyContact({
      userId: req.user!.id,
      ...parsed.data,
    });
    res.status(201).json(contact);
  });

  app.delete("/api/emergency-contacts/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const deleted = await storage.deleteEmergencyContact(id, req.user!.id);
    if (!deleted) return res.status(404).json({ message: "Contact not found" });
    res.sendStatus(204);
  });

  // ── SOS / Send SMS (stub – no Twilio) ────────────────────────────

  app.post("/api/send-sms", async (req, res) => {
    const { number } = req.body;
    if (!number || typeof number !== "string") {
      return res.status(400).json({ message: "Phone number is required" });
    }
    // In production, integrate Twilio / SNS here.
    // For the hackathon demo we just acknowledge the request.
    console.log(`[SOS] SMS requested to ${number}`);
    res.json({
      success: true,
      message: "SOS alert recorded. In production an SMS would be sent.",
    });
  });

  // ── HTTP server ──────────────────────────────────────────────────

  const httpServer = createServer(app);
  return httpServer;
}
