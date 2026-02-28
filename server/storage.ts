import {
  users,
  moodEntries,
  chatMessages,
  journalEntries,
  emergencyContacts,
  type User,
  type InsertUser,
  type UpdateProfile,
  type MoodEntry,
  type InsertMoodEntry,
  type ChatMessage,
  type InsertChatMessage,
  type JournalEntry,
  type InsertJournalEntry,
  type EmergencyContact,
  type InsertEmergencyContact,
} from "@shared/schema";
import { initializeDatabase } from "./db";
import { hashPassword } from "./password";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateProfile(id: number, data: UpdateProfile): Promise<User | undefined>;

  // Emergency contacts
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(c: InsertEmergencyContact): Promise<EmergencyContact>;
  deleteEmergencyContact(id: number, userId: number): Promise<boolean>;

  // Mood entries
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;

  // Chat messages
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(msg: InsertChatMessage): Promise<ChatMessage>;

  // Journal entries
  getJournalEntries(userId: number): Promise<JournalEntry[]>;
  getJournalEntry(
    id: number,
    userId: number,
  ): Promise<JournalEntry | undefined>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(
    id: number,
    userId: number,
    data: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">>,
  ): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: number, userId: number): Promise<boolean>;
}

// ── In-memory implementation ──────────────────────────────────────────

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private moodStore: Map<number, MoodEntry[]> = new Map();
  private chatStore: Map<number, ChatMessage[]> = new Map();
  private journalStore: Map<number, JournalEntry[]> = new Map();
  private contactStore: Map<number, EmergencyContact[]> = new Map();
  private currentUserId = 1;
  private currentMoodId = 1;
  private currentChatId = 1;
  private currentJournalId = 1;
  private currentContactId = 1;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.initializeDemoUser();
  }

  private async initializeDemoUser() {
    const hashed = await hashPassword("demo123");
    const demoUser: User = {
      id: this.currentUserId++,
      username: "demo",
      password: hashed,
      firstName: "Demo",
      lastName: "User",
      email: "demo@sereneai.com",
      phone: null,
      bio: null,
      accountType: "free",
      avatarUrl: null,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);

    // Seed demo mood entries
    const now = Date.now();
    this.moodStore.set(demoUser.id, [
      {
        id: this.currentMoodId++,
        userId: demoUser.id,
        mood: "good",
        notes: "Had a productive morning with meditation",
        timestamp: new Date(now - 2 * 86400000),
      },
      {
        id: this.currentMoodId++,
        userId: demoUser.id,
        mood: "great",
        notes: "Feeling energized after a walk in nature",
        timestamp: new Date(now - 86400000),
      },
      {
        id: this.currentMoodId++,
        userId: demoUser.id,
        mood: "okay",
        notes: "Busy day at work, but managed stress well",
        timestamp: new Date(),
      },
    ]);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    await this.ready;
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ready;
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await this.ready;
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      email: insertUser.email || null,
      phone: null,
      bio: null,
      accountType: "free",
      avatarUrl: null,
    };
    this.users.set(id, user);
    return user;
  }

  // Profile update
  async updateProfile(
    id: number,
    data: UpdateProfile,
  ): Promise<User | undefined> {
    await this.ready;
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  // Emergency contacts
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    await this.ready;
    return this.contactStore.get(userId) || [];
  }

  async createEmergencyContact(
    c: InsertEmergencyContact,
  ): Promise<EmergencyContact> {
    await this.ready;
    const contact: EmergencyContact = {
      id: this.currentContactId++,
      userId: c.userId,
      name: c.name,
      relationship: c.relationship ?? null,
      phone: c.phone ?? null,
      email: c.email ?? null,
      createdAt: new Date(),
    };
    if (!this.contactStore.has(c.userId)) this.contactStore.set(c.userId, []);
    this.contactStore.get(c.userId)!.push(contact);
    return contact;
  }

  async deleteEmergencyContact(id: number, userId: number): Promise<boolean> {
    await this.ready;
    const contacts = this.contactStore.get(userId);
    if (!contacts) return false;
    const idx = contacts.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    contacts.splice(idx, 1);
    return true;
  }

  // Mood entries
  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    await this.ready;
    return (this.moodStore.get(userId) || []).sort(
      (a, b) =>
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime(),
    );
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    await this.ready;
    const moodEntry: MoodEntry = {
      id: this.currentMoodId++,
      userId: entry.userId,
      mood: entry.mood,
      notes: entry.notes ?? null,
      timestamp: new Date(),
    };
    if (!this.moodStore.has(entry.userId)) this.moodStore.set(entry.userId, []);
    this.moodStore.get(entry.userId)!.push(moodEntry);
    return moodEntry;
  }

  // Chat messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    await this.ready;
    return (this.chatStore.get(userId) || []).sort(
      (a, b) =>
        new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime(),
    );
  }

  async createChatMessage(msg: InsertChatMessage): Promise<ChatMessage> {
    await this.ready;
    const chatMsg: ChatMessage = {
      id: this.currentChatId++,
      userId: msg.userId,
      sender: msg.sender,
      message: msg.message,
      sentiment: msg.sentiment ?? null,
      suggestions: msg.suggestions ?? null,
      timestamp: new Date(),
    };
    if (!this.chatStore.has(msg.userId)) this.chatStore.set(msg.userId, []);
    this.chatStore.get(msg.userId)!.push(chatMsg);
    return chatMsg;
  }

  // Journal entries
  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    await this.ready;
    return (this.journalStore.get(userId) || []).sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    );
  }

  async getJournalEntry(
    id: number,
    userId: number,
  ): Promise<JournalEntry | undefined> {
    await this.ready;
    return (this.journalStore.get(userId) || []).find((e) => e.id === id);
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    await this.ready;
    const journalEntry: JournalEntry = {
      id: this.currentJournalId++,
      userId: entry.userId,
      title: entry.title,
      content: entry.content,
      mood: entry.mood ?? null,
      tags: entry.tags ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (!this.journalStore.has(entry.userId))
      this.journalStore.set(entry.userId, []);
    this.journalStore.get(entry.userId)!.push(journalEntry);
    return journalEntry;
  }

  async updateJournalEntry(
    id: number,
    userId: number,
    data: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">>,
  ): Promise<JournalEntry | undefined> {
    await this.ready;
    const entries = this.journalStore.get(userId);
    if (!entries) return undefined;
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    entries[idx] = { ...entries[idx], ...data, updatedAt: new Date() };
    return entries[idx];
  }

  async deleteJournalEntry(id: number, userId: number): Promise<boolean> {
    await this.ready;
    const entries = this.journalStore.get(userId);
    if (!entries) return false;
    const idx = entries.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    entries.splice(idx, 1);
    return true;
  }
}

// ── Database implementation ───────────────────────────────────────────

export class DatabaseStorage implements IStorage {
  private db: NonNullable<ReturnType<typeof initializeDatabase>>;
  private ready: Promise<void>;

  constructor(database: NonNullable<ReturnType<typeof initializeDatabase>>) {
    this.db = database;
    this.ready = this.initializeDemoUser();
  }

  private async initializeDemoUser() {
    try {
      const existing = await this.getUserByUsername("demo");
      if (!existing) {
        const hashed = await hashPassword("demo123");
        await this.db.insert(users).values({
          username: "demo",
          password: hashed,
          firstName: "Demo",
          lastName: "User",
          email: "demo@sereneai.com",
        });
        console.log("Demo user created in database");
      }
    } catch (error) {
      console.error("Error initializing demo user:", error);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    await this.ready;
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateProfile(
    id: number,
    data: UpdateProfile,
  ): Promise<User | undefined> {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Emergency contacts
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return this.db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId))
      .orderBy(desc(emergencyContacts.createdAt));
  }

  async createEmergencyContact(
    c: InsertEmergencyContact,
  ): Promise<EmergencyContact> {
    const [row] = await this.db.insert(emergencyContacts).values(c).returning();
    return row;
  }

  async deleteEmergencyContact(id: number, userId: number): Promise<boolean> {
    const result = await this.db
      .delete(emergencyContacts)
      .where(
        and(eq(emergencyContacts.id, id), eq(emergencyContacts.userId, userId)),
      )
      .returning();
    return result.length > 0;
  }

  // Mood entries
  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return this.db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.timestamp));
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [row] = await this.db.insert(moodEntries).values(entry).returning();
    return row;
  }

  // Chat messages
  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(msg: InsertChatMessage): Promise<ChatMessage> {
    const [row] = await this.db.insert(chatMessages).values(msg).returning();
    return row;
  }

  // Journal entries
  async getJournalEntries(userId: number): Promise<JournalEntry[]> {
    return this.db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getJournalEntry(
    id: number,
    userId: number,
  ): Promise<JournalEntry | undefined> {
    const [row] = await this.db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
    return row || undefined;
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [row] = await this.db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return row;
  }

  async updateJournalEntry(
    id: number,
    userId: number,
    data: Partial<Pick<JournalEntry, "title" | "content" | "mood" | "tags">>,
  ): Promise<JournalEntry | undefined> {
    const [row] = await this.db
      .update(journalEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
      .returning();
    return row || undefined;
  }

  async deleteJournalEntry(id: number, userId: number): Promise<boolean> {
    const result = await this.db
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
      .returning();
    return result.length > 0;
  }
}

// ── Factory ───────────────────────────────────────────────────────────

function createStorage(): IStorage {
  const database = initializeDatabase();
  if (database) {
    console.log("Using PostgreSQL database storage");
    return new DatabaseStorage(database);
  }
  console.log("Using in-memory storage (set DATABASE_URL for persistence)");
  return new MemStorage();
}

export const storage = createStorage();
