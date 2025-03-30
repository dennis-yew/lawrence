import { db } from "./db";
import { IStorage } from "./storage";
import { 
  type User, type InsertUser,
  type Post, type InsertPost,
  type Project, type InsertProject,
  type TechStack, type InsertTechStack,
  type Interest, type InsertInterest,
  type Activity, type InsertActivity,
  type Profile, type InsertProfile,
  type Contact, type InsertContact,
  type Comment, type InsertComment,
  users, posts, projects, techStacks, interests, activities, profiles, contacts, comments
} from "@shared/schema";
import { eq } from "drizzle-orm";

export class PgStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.createdAt);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(insertPost).returning();
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async getTechStacks(): Promise<TechStack[]> {
    return await db.select().from(techStacks);
  }

  async createTechStack(insertTechStack: InsertTechStack): Promise<TechStack> {
    const result = await db.insert(techStacks).values(insertTechStack).returning();
    return result[0];
  }

  async getInterests(): Promise<Interest[]> {
    return await db.select().from(interests);
  }

  async createInterest(insertInterest: InsertInterest): Promise<Interest> {
    const result = await db.insert(interests).values(insertInterest).returning();
    return result[0];
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(insertActivity).returning();
    return result[0];
  }

  async getProfile(): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).limit(1);
    return result[0];
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(insertProfile).returning();
    return result[0];
  }

  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile> {
    const result = await db.update(profiles)
      .set(profile)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }
  
  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }
  
  async getContact(id: number): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const values = {
      ...insertContact,
      isRead: false,
      createdAt: new Date()
    };
    const result = await db.insert(contacts).values(values).returning();
    return result[0];
  }
  
  async markContactAsRead(id: number): Promise<Contact> {
    const result = await db.update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning();
    return result[0];
  }
  
  // Comment operations
  async getComments(): Promise<Comment[]> {
    return await db.select().from(comments).orderBy(comments.createdAt);
  }
  
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return await db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    const result = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    return result[0];
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const values = {
      ...insertComment,
      isApproved: false,
      createdAt: new Date()
    };
    const result = await db.insert(comments).values(values).returning();
    return result[0];
  }
  
  async approveComment(id: number): Promise<Comment> {
    const result = await db.update(comments)
      .set({ isApproved: true })
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }
}