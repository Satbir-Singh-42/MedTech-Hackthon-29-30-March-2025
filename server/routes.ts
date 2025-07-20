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
const chatMessages = new Map();

// Initialize demo data for demo user
function initializeDemoData() {
  const demoUserId = 1; // Demo user ID
  const demoMoodEntries = [
    {
      id: "demo-1",
      mood: "good",
      notes: "Had a productive morning with meditation",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      userId: demoUserId
    },
    {
      id: "demo-2", 
      mood: "great",
      notes: "Feeling energized after a walk in nature",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      userId: demoUserId
    },
    {
      id: "demo-3",
      mood: "okay",
      notes: "Busy day at work, but managed stress well",
      timestamp: new Date(), // Today
      userId: demoUserId
    }
  ];
  
  const demoChatMessages = [
    {
      id: "chat-demo-1",
      message: "Hello! I'm feeling a bit stressed about an upcoming presentation.",
      sender: "user",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      userId: demoUserId
    },
    {
      id: "chat-demo-2",
      message: "I understand that presentations can feel overwhelming. Let's work through this together. Would you like to try a quick breathing exercise to help calm your nerves, or would you prefer to talk through your concerns about the presentation?",
      sender: "ai",
      sentiment: "stress",
      suggestions: ["Try breathing exercise", "Discuss concerns"],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 30000), // 1 hour ago + 30 seconds
      userId: demoUserId
    },
    {
      id: "chat-demo-3",
      message: "The breathing exercise sounds helpful. Can you guide me through one?",
      sender: "user",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 60000), // 1 hour ago + 1 minute
      userId: demoUserId
    }
  ];
  
  moodEntries.set(demoUserId, demoMoodEntries);
  chatMessages.set(demoUserId, demoChatMessages);
}

// Initialize demo data on startup
initializeDemoData();

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

  // Get chat messages for the user
  app.get("/api/chat/messages", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const userId = req.user!.id;
    const userMessages = chatMessages.get(userId) || [];
    
    res.json(userMessages);
  });

  // Simulated AI response endpoint
  app.post("/api/chat", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const messageSchema = z.object({
      message: z.string()
    });

    try {
      const { message } = messageSchema.parse(req.body);
      const userId = req.user!.id;
      
      // Store user message
      const userMessage = {
        id: `user-${Date.now()}`,
        message,
        sender: "user",
        timestamp: new Date(),
        userId
      };
      
      if (!chatMessages.has(userId)) {
        chatMessages.set(userId, []);
      }
      chatMessages.get(userId).push(userMessage);
      
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

      // Store AI response
      const aiMessage = {
        id: `ai-${Date.now()}`,
        message: response.text,
        sender: "ai",
        sentiment: response.sentiment,
        suggestions: response.suggestions,
        timestamp: new Date(),
        userId
      };
      
      chatMessages.get(userId).push(aiMessage);

      res.json(aiMessage);
    } catch (error) {
      res.status(400).json({ message: "Invalid message format" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
