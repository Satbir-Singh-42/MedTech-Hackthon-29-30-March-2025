var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  chatMessages: () => chatMessages,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertMoodEntrySchema: () => insertMoodEntrySchema,
  insertUserSchema: () => insertUserSchema,
  moodEntries: () => moodEntries,
  users: () => users
});
import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true
});
var moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: text("mood").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  mood: true,
  notes: true
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sender: text("sender").notNull(),
  // "user" or "ai"
  message: text("message").notNull(),
  sentiment: text("sentiment"),
  suggestions: json("suggestions"),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  sender: true,
  message: true,
  sentiment: true,
  suggestions: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var db = null;
var pool = null;
function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found - using memory storage");
    return null;
  }
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema: schema_exports });
    console.log("PostgreSQL database connected successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    console.log("Falling back to memory storage");
    return null;
  }
}

// server/storage.ts
import { eq } from "drizzle-orm";
var MemStorage = class {
  users;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.currentId = 1;
    this.initializeDemoUser();
  }
  async initializeDemoUser() {
    const demoUser = {
      id: this.currentId++,
      username: "demo",
      password: "demo123",
      // In real app, this should be hashed
      firstName: "Demo",
      lastName: "User",
      email: "demo@sereneai.com",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(demoUser.id, demoUser);
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = {
      ...insertUser,
      id,
      createdAt: /* @__PURE__ */ new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      email: insertUser.email || null
    };
    this.users.set(id, user);
    return user;
  }
};
var DatabaseStorage = class {
  db;
  constructor(database) {
    this.db = database;
    this.initializeDemoUser();
  }
  async initializeDemoUser() {
    try {
      const existingDemo = await this.getUserByUsername("demo");
      if (!existingDemo) {
        await this.db.insert(users).values({
          username: "demo",
          password: "demo123",
          // In real app, this should be hashed
          firstName: "Demo",
          lastName: "User",
          email: "demo@sereneai.com"
        });
        console.log("Demo user created in database");
      }
    } catch (error) {
      console.error("Error initializing demo user:", error);
    }
  }
  async getUser(id) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }
};
function createStorage() {
  const database = initializeDatabase();
  if (database) {
    console.log("Using PostgreSQL database storage");
    return new DatabaseStorage(database);
  } else {
    console.log("Using memory storage");
    return new MemStorage();
  }
}
var storage = createStorage();

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "sereneai-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false);
        }
        if (username === "demo" && password === "demo123") {
          return done(null, user);
        }
        if (!await comparePasswords(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/auth/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });
  app2.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// server/routes.ts
import { z } from "zod";
var moods = [
  { id: "great", emoji: "\u{1F604}", label: "Great" },
  { id: "good", emoji: "\u{1F642}", label: "Good" },
  { id: "okay", emoji: "\u{1F610}", label: "Okay" },
  { id: "down", emoji: "\u{1F614}", label: "Down" },
  { id: "stressed", emoji: "\u{1F630}", label: "Stressed" }
];
var moodEntries2 = /* @__PURE__ */ new Map();
var chatMessages2 = /* @__PURE__ */ new Map();
function initializeDemoData() {
  const demoUserId = 1;
  const demoMoodEntries = [
    {
      id: "demo-1",
      mood: "good",
      notes: "Had a productive morning with meditation",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3),
      // 2 days ago
      userId: demoUserId
    },
    {
      id: "demo-2",
      mood: "great",
      notes: "Feeling energized after a walk in nature",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3),
      // 1 day ago
      userId: demoUserId
    },
    {
      id: "demo-3",
      mood: "okay",
      notes: "Busy day at work, but managed stress well",
      timestamp: /* @__PURE__ */ new Date(),
      // Today
      userId: demoUserId
    }
  ];
  const demoChatMessages = [
    {
      id: "chat-demo-1",
      message: "Hello! I'm feeling a bit stressed about an upcoming presentation.",
      sender: "user",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3),
      // 1 hour ago
      userId: demoUserId
    },
    {
      id: "chat-demo-2",
      message: "I understand that presentations can feel overwhelming. Let's work through this together. Would you like to try a quick breathing exercise to help calm your nerves, or would you prefer to talk through your concerns about the presentation?",
      sender: "ai",
      sentiment: "stress",
      suggestions: ["Try breathing exercise", "Discuss concerns"],
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3 + 3e4),
      // 1 hour ago + 30 seconds
      userId: demoUserId
    },
    {
      id: "chat-demo-3",
      message: "The breathing exercise sounds helpful. Can you guide me through one?",
      sender: "user",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1e3 + 6e4),
      // 1 hour ago + 1 minute
      userId: demoUserId
    }
  ];
  moodEntries2.set(demoUserId, demoMoodEntries);
  chatMessages2.set(demoUserId, demoChatMessages);
}
initializeDemoData();
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/moods", (req, res) => {
    res.json(moods);
  });
  app2.post("/api/mood-entries", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    const schema = z.object({
      mood: z.string(),
      notes: z.string().optional()
    });
    try {
      const { mood, notes } = schema.parse(req.body);
      const entry = {
        id: Date.now().toString(),
        mood,
        notes,
        timestamp: /* @__PURE__ */ new Date(),
        userId
      };
      if (!moodEntries2.has(userId)) {
        moodEntries2.set(userId, []);
      }
      moodEntries2.get(userId).push(entry);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.get("/api/mood-entries", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    const userEntries = moodEntries2.get(userId) || [];
    res.json(userEntries);
  });
  app2.get("/api/chat/messages", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    const userMessages = chatMessages2.get(userId) || [];
    res.json(userMessages);
  });
  app2.post("/api/chat", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const messageSchema = z.object({
      message: z.string()
    });
    try {
      const { message } = messageSchema.parse(req.body);
      const userId = req.user.id;
      const userMessage = {
        id: `user-${Date.now()}`,
        message,
        sender: "user",
        timestamp: /* @__PURE__ */ new Date(),
        userId
      };
      if (!chatMessages2.has(userId)) {
        chatMessages2.set(userId, []);
      }
      chatMessages2.get(userId).push(userMessage);
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
      const aiMessage = {
        id: `ai-${Date.now()}`,
        message: response.text,
        sender: "ai",
        sentiment: response.sentiment,
        suggestions: response.suggestions,
        timestamp: /* @__PURE__ */ new Date(),
        userId
      };
      chatMessages2.get(userId).push(aiMessage);
      res.json(aiMessage);
    } catch (error) {
      res.status(400).json({ message: "Invalid message format" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
})();
