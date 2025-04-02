import {
  users, type User, type InsertUser,
  posts, type Post, type InsertPost,
  projects, type Project, type InsertProject,
  techStacks, type TechStack, type InsertTechStack,
  interests, type Interest, type InsertInterest,
  activities, type Activity, type InsertActivity,
  profiles, type Profile, type InsertProfile,
  contacts, type Contact, type InsertContact,
  comments, type Comment, type InsertComment
} from "../shared/schema";

export interface IStorage {
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post operations
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Tech stack operations
  getTechStacks(): Promise<TechStack[]>;
  createTechStack(techStack: InsertTechStack): Promise<TechStack>;
  
  // Interest operations
  getInterests(): Promise<Interest[]>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  
  // Activity operations
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Profile operations
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile>;
  
  // Contact operations
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<Contact>;
  
  // Comment operations
  getComments(): Promise<Comment[]>;
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  getComment(id: number): Promise<Comment | undefined>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: number): Promise<Comment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private projects: Map<number, Project>;
  private techStacks: Map<number, TechStack>;
  private interests: Map<number, Interest>;
  private activities: Map<number, Activity>;
  private profiles: Map<number, Profile>;
  private contacts: Map<number, Contact>;
  private comments: Map<number, Comment>;
  
  private currentUserId: number;
  private currentPostId: number;
  private currentProjectId: number;
  private currentTechStackId: number;
  private currentInterestId: number;
  private currentActivityId: number;
  private currentProfileId: number;
  private currentContactId: number;
  private currentCommentId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.projects = new Map();
    this.techStacks = new Map();
    this.interests = new Map();
    this.activities = new Map();
    this.profiles = new Map();
    this.contacts = new Map();
    this.comments = new Map();
    
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentProjectId = 1;
    this.currentTechStackId = 1;
    this.currentInterestId = 1;
    this.currentActivityId = 1;
    this.currentProfileId = 1;
    this.currentContactId = 1;
    this.currentCommentId = 1;
    
    // Initialize default data in the background
    this.initializeDefaultData().catch(err => {
      console.error('Error initializing default data:', err);
    });
  }

  private async initializeDefaultData() {
    // Create default user
    const defaultUser: InsertUser = {
      username: 'admin',
      password: 'admin123'
    };
    
    const user = await this.createUser(defaultUser);
    
    // Create default profile
    await this.createProfile({
      name: 'Eltrac',
      alias: 'alias, nickname',
      avatar: '/avatar.jpg',
      github: 'hiegouhb.cn',
      website: 'website.com',
      personalityType: 'INFP-T',
      personalityTitle: 'Architect',
      userId: user.id
    });
    
    // Create tech stacks
    await this.createTechStack({ name: 'JavaScript', icon: 'fa-js', background: 'bg-yellow-500', userId: user.id });
    await this.createTechStack({ name: 'Next.js', icon: 'N', background: 'bg-black', userId: user.id });
    await this.createTechStack({ name: 'React', icon: 'fa-react', background: 'bg-blue-500', userId: user.id });
    await this.createTechStack({ name: 'Node.js', icon: 'fa-node-js', background: 'bg-green-600', userId: user.id });
    await this.createTechStack({ name: 'SQL', icon: 'fa-database', background: 'bg-gray-800', userId: user.id });
    await this.createTechStack({ name: 'TypeScript', icon: 'fa-code', background: 'bg-gray-700', userId: user.id });
    
    // Create interests
    await this.createInterest({ name: 'Music', description: 'Favorite genres', icon: 'fa-music', userId: user.id });
    await this.createInterest({ name: 'Reading', description: 'Book recommendations', icon: 'fa-book', userId: user.id });
    await this.createInterest({ name: 'Movies', description: 'Film reviews', icon: 'fa-film', userId: user.id });
    
    // Create projects
    await this.createProject({ 
      name: 'Extreme Death Project', 
      description: 'Project description goes here...',
      icon: 'fa-skull-crossbones',
      iconBackground: 'bg-gray-700',
      userId: user.id 
    });
    
    await this.createProject({ 
      name: 'Personal Website', 
      description: 'My personal portfolio and blog',
      icon: 'fa-code',
      iconBackground: 'bg-mint',
      userId: user.id 
    });
    
    await this.createProject({ 
      name: 'AI Project', 
      description: 'Machine learning experiments',
      icon: 'fa-robot',
      iconBackground: 'bg-purple-light',
      userId: user.id 
    });
    
    // Create posts
    const now = new Date();
    
    await this.createPost({
      title: 'Building Modern Web Applications',
      content: 'A comprehensive guide to creating responsive and performant web applications...',
      imageUrl: '/blog1.jpg',
      userId: user.id
    });
    
    await this.createPost({
      title: 'Learning TypeScript in 2023',
      content: 'Essential TypeScript features and best practices for JavaScript developers...',
      imageUrl: '/blog2.jpg',
      userId: user.id
    });
    
    await this.createPost({
      title: 'Exploring Design Systems',
      content: 'How design systems improve collaboration between designers and developers...',
      imageUrl: '/blog3.jpg',
      userId: user.id
    });
    
    // Create activities (for the last 6 months)
    for (let i = 0; i < 180; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Random count between 0 and 10
      const count = Math.floor(Math.random() * 11);
      
      await this.createActivity({
        date,
        count,
        userId: user.id
      });
    }
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
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
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Post operations
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.currentPostId++;
    const post: Post = { 
      ...insertPost, 
      id, 
      createdAt: new Date(),
      imageUrl: insertPost.imageUrl || null
    };
    this.posts.set(id, post);
    return post;
  }
  
  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }
  
  // Tech stack operations
  async getTechStacks(): Promise<TechStack[]> {
    return Array.from(this.techStacks.values());
  }
  
  async createTechStack(insertTechStack: InsertTechStack): Promise<TechStack> {
    const id = this.currentTechStackId++;
    const techStack: TechStack = { ...insertTechStack, id };
    this.techStacks.set(id, techStack);
    return techStack;
  }
  
  // Interest operations
  async getInterests(): Promise<Interest[]> {
    return Array.from(this.interests.values());
  }
  
  async createInterest(insertInterest: InsertInterest): Promise<Interest> {
    const id = this.currentInterestId++;
    const interest: Interest = { ...insertInterest, id };
    this.interests.set(id, interest);
    return interest;
  }
  
  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { 
      ...insertActivity, 
      id,
      date: insertActivity.date || new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Profile operations
  async getProfile(): Promise<Profile | undefined> {
    if (this.profiles.size > 0) {
      return Array.from(this.profiles.values())[0];
    }
    return undefined;
  }
  
  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.currentProfileId++;
    const profile: Profile = { 
      ...insertProfile, 
      id,
      alias: insertProfile.alias || null,
      avatar: insertProfile.avatar || null,
      github: insertProfile.github || null,
      website: insertProfile.website || null,
      personalityType: insertProfile.personalityType || null,
      personalityTitle: insertProfile.personalityTitle || null
    };
    this.profiles.set(id, profile);
    return profile;
  }
  
  async updateProfile(id: number, profile: Partial<InsertProfile>): Promise<Profile> {
    const existingProfile = this.profiles.get(id);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile = { ...existingProfile, ...profile };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
      isRead: false
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async markContactAsRead(id: number): Promise<Contact> {
    const existingContact = this.contacts.get(id);
    if (!existingContact) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = { ...existingContact, isRead: true };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
  
  // Comment operations
  async getComments(): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getComment(id: number): Promise<Comment | undefined> {
    return this.comments.get(id);
  }
  
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
      isApproved: false
    };
    this.comments.set(id, comment);
    return comment;
  }
  
  async approveComment(id: number): Promise<Comment> {
    const existingComment = this.comments.get(id);
    if (!existingComment) {
      throw new Error('Comment not found');
    }
    
    const updatedComment = { ...existingComment, isApproved: true };
    this.comments.set(id, updatedComment);
    return updatedComment;
  }
}

// Use PgStorage if DATABASE_URL is set, otherwise fallback to MemStorage
import { PgStorage } from "./pgStorage";

// Force use of PgStorage for this application
const storage = new PgStorage();

// Initialize default data
async function initializeData() {
  try {
    // Check if we already have a user
    const existingUsers = await storage.getUsers();
    if (existingUsers && existingUsers.length > 0) {
      console.log('Database already has data, skipping initialization');
      return;
    }
    
    console.log('Initializing database with default data...');
    
    // Create default user
    const defaultUser = await storage.createUser({
      username: 'admin',
      password: 'admin123'
    });
    
    // Create default profile
    await storage.createProfile({
      name: 'Eltrac',
      alias: 'alias, nickname',
      avatar: '/avatar.jpg',
      github: 'hiegouhb.cn',
      website: 'website.com',
      personalityType: 'INFP-T',
      personalityTitle: 'Architect',
      userId: defaultUser.id
    });
    
    // Create tech stacks
    await storage.createTechStack({ name: 'JavaScript', icon: 'fa-js', background: 'bg-yellow-500', userId: defaultUser.id });
    await storage.createTechStack({ name: 'Next.js', icon: 'N', background: 'bg-black', userId: defaultUser.id });
    await storage.createTechStack({ name: 'React', icon: 'fa-react', background: 'bg-blue-500', userId: defaultUser.id });
    await storage.createTechStack({ name: 'Node.js', icon: 'fa-node-js', background: 'bg-green-600', userId: defaultUser.id });
    await storage.createTechStack({ name: 'SQL', icon: 'fa-database', background: 'bg-gray-800', userId: defaultUser.id });
    await storage.createTechStack({ name: 'TypeScript', icon: 'fa-code', background: 'bg-gray-700', userId: defaultUser.id });
    
    // Create interests
    await storage.createInterest({ name: 'Music', description: 'Favorite genres', icon: 'fa-music', userId: defaultUser.id });
    await storage.createInterest({ name: 'Reading', description: 'Book recommendations', icon: 'fa-book', userId: defaultUser.id });
    await storage.createInterest({ name: 'Movies', description: 'Film reviews', icon: 'fa-film', userId: defaultUser.id });
    
    // Create projects
    await storage.createProject({ 
      name: 'Extreme Death Project', 
      description: 'Project description goes here...',
      icon: 'fa-skull-crossbones',
      iconBackground: 'bg-gray-700',
      userId: defaultUser.id 
    });
    
    await storage.createProject({ 
      name: 'Personal Website', 
      description: 'My personal portfolio and blog',
      icon: 'fa-code',
      iconBackground: 'bg-mint',
      userId: defaultUser.id 
    });
    
    await storage.createProject({ 
      name: 'AI Project', 
      description: 'Machine learning experiments',
      icon: 'fa-robot',
      iconBackground: 'bg-purple-light',
      userId: defaultUser.id 
    });
    
    // Create posts
    await storage.createPost({
      title: 'Building Modern Web Applications',
      content: 'A comprehensive guide to creating responsive and performant web applications...',
      imageUrl: '/blog1.jpg',
      userId: defaultUser.id
    });
    
    await storage.createPost({
      title: 'Learning TypeScript in 2023',
      content: 'Essential TypeScript features and best practices for JavaScript developers...',
      imageUrl: '/blog2.jpg',
      userId: defaultUser.id
    });
    
    await storage.createPost({
      title: 'Exploring Design Systems',
      content: 'How design systems improve collaboration between designers and developers...',
      imageUrl: '/blog3.jpg',
      userId: defaultUser.id
    });
    
    // Create activities (for the last 6 months)
    const today = new Date();
    for (let i = 0; i < 180; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random count between 0 and 10
      const count = Math.floor(Math.random() * 11);
      
      await storage.createActivity({
        date,
        count,
        userId: defaultUser.id
      });
    }
    
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize data in the background
initializeData().catch(err => {
  console.error('Failed to initialize data:', err);
});

export { storage };
