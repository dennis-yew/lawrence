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
} from "../shared/schema";
import { eq } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export class PgStorage implements IStorage {
  private db;

  constructor(pool: Pool) {
    this.db = drizzle(pool);
  }

  async getUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getPosts(): Promise<Post[]> {
    return await this.db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      userId: posts.userId
    }).from(posts).orderBy(posts.createdAt);
  }

  async getPost(id: number): Promise<Post | undefined> {
    const result = await this.db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      userId: posts.userId
    }).from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    try {
      console.log('PgStorage.createPost - 输入数据:', JSON.stringify(post, null, 2));
      
      // 确保 imageUrl 字段正确处理
      const postData = {
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || null,
        userId: post.userId,
        createdAt: new Date(),
      };
      
      console.log('PgStorage.createPost - 处理后数据:', JSON.stringify(postData, null, 2));
      
      const result = await this.db.insert(posts).values(postData).returning();
      
      if (!result || result.length === 0) {
        throw new Error('创建文章失败');
      }
      
      console.log('PgStorage.createPost - 创建结果:', JSON.stringify(result[0], null, 2));
      
      return result[0];
    } catch (error) {
      console.error('数据库错误:', error);
      
      // 提供更详细的错误信息
      if (error instanceof Error) {
        console.error('错误详情:', error.message);
        if (error.stack) {
          console.error('错误堆栈:', error.stack);
        }
      }
      
      throw new Error('保存文章时发生错误: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  async getProjects(): Promise<Project[]> {
    return await this.db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async getTechStacks(): Promise<TechStack[]> {
    return await this.db.select().from(techStacks);
  }

  async createTechStack(insertTechStack: InsertTechStack): Promise<TechStack> {
    const result = await this.db.insert(techStacks).values(insertTechStack).returning();
    return result[0];
  }

  async getInterests(): Promise<Interest[]> {
    return await this.db.select().from(interests);
  }

  async createInterest(insertInterest: InsertInterest): Promise<Interest> {
    const result = await this.db.insert(interests).values(insertInterest).returning();
    return result[0];
  }

  async getActivities(): Promise<Activity[]> {
    return await this.db.select().from(activities);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const result = await this.db.insert(activities).values(insertActivity).returning();
    return result[0];
  }

  async getProfile(): Promise<Profile | undefined> {
    const result = await this.db.select().from(profiles).limit(1);
    return result[0];
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const result = await this.db.insert(profiles).values(insertProfile).returning();
    return result[0];
  }

  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile> {
    const result = await this.db.update(profiles)
      .set(profile)
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }
  
  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return await this.db.select().from(contacts).orderBy(contacts.createdAt);
  }
  
  async getContact(id: number): Promise<Contact | undefined> {
    const result = await this.db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const values = {
      ...insertContact,
      isRead: false,
      createdAt: new Date()
    };
    const result = await this.db.insert(contacts).values(values).returning();
    return result[0];
  }
  
  async markContactAsRead(id: number): Promise<Contact> {
    const result = await this.db.update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning();
    return result[0];
  }
  
  // Comment operations
  async getComments(): Promise<Comment[]> {
    return await this.db.select().from(comments).orderBy(comments.createdAt);
  }
  
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return await this.db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    const result = await this.db.select().from(comments).where(eq(comments.id, id)).limit(1);
    return result[0];
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const values = {
      ...insertComment,
      isApproved: false,
      createdAt: new Date()
    };
    const result = await this.db.insert(comments).values(values).returning();
    return result[0];
  }
  
  async approveComment(id: number): Promise<Comment> {
    const result = await this.db.update(comments)
      .set({ isApproved: true })
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }
}