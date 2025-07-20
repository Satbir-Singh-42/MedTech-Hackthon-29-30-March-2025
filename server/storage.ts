import { users, type User, type InsertUser } from "@shared/schema";
import { initializeDatabase } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.initializeDemoUser();
  }

  private async initializeDemoUser() {
    // Create demo user for easy access
    const demoUser: User = {
      id: this.currentId++,
      username: "demo",
      password: "demo123", // In real app, this should be hashed
      firstName: "Demo",
      lastName: "User",
      email: "demo@sereneai.com",
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      email: insertUser.email || null
    };
    this.users.set(id, user);
    return user;
  }
}

export class DatabaseStorage implements IStorage {
  private db: NonNullable<ReturnType<typeof initializeDatabase>>;

  constructor(database: NonNullable<ReturnType<typeof initializeDatabase>>) {
    this.db = database;
    this.initializeDemoUser();
  }

  private async initializeDemoUser() {
    try {
      // Check if demo user already exists
      const existingDemo = await this.getUserByUsername("demo");
      if (!existingDemo) {
        // Create demo user if it doesn't exist
        await this.db.insert(users).values({
          username: "demo",
          password: "demo123", // In real app, this should be hashed
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

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
}

// Initialize storage based on database availability
function createStorage(): IStorage {
  const database = initializeDatabase();
  
  if (database) {
    console.log("Using PostgreSQL database storage");
    return new DatabaseStorage(database);
  } else {
    console.log("Using memory storage");
    return new MemStorage();
  }
}

export const storage = createStorage();
