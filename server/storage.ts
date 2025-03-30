import {
  users, type User, type InsertUser,
  posts, type Post, type InsertPost,
  projects, type Project, type InsertProject,
  techStacks, type TechStack, type InsertTechStack,
  interests, type Interest, type InsertInterest,
  activities, type Activity, type InsertActivity,
  profiles, type Profile, type InsertProfile
} from "@shared/schema";

export interface IStorage {
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private projects: Map<number, Project>;
  private techStacks: Map<number, TechStack>;
  private interests: Map<number, Interest>;
  private activities: Map<number, Activity>;
  private profiles: Map<number, Profile>;
  
  private currentUserId: number;
  private currentPostId: number;
  private currentProjectId: number;
  private currentTechStackId: number;
  private currentInterestId: number;
  private currentActivityId: number;
  private currentProfileId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.projects = new Map();
    this.techStacks = new Map();
    this.interests = new Map();
    this.activities = new Map();
    this.profiles = new Map();
    
    this.currentUserId = 1;
    this.currentPostId = 1;
    this.currentProjectId = 1;
    this.currentTechStackId = 1;
    this.currentInterestId = 1;
    this.currentActivityId = 1;
    this.currentProfileId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: InsertUser = {
      username: 'admin',
      password: 'admin123'
    };
    
    const user = this.createUser(defaultUser);
    
    // Create default profile
    this.createProfile({
      name: 'Eltrac',
      alias: 'alias, nickname',
      avatar: '/avatar.jpg',
      github: 'hiegouhb.cn',
      website: 'website.com',
      personalityType: 'INFP-T',
      personalityTitle: 'Mediator',
      userId: user.id
    });
    
    // Create tech stacks
    this.createTechStack({ name: 'JavaScript', icon: 'fa-js', background: 'bg-yellow-500', userId: user.id });
    this.createTechStack({ name: 'Next.js', icon: 'N', background: 'bg-black', userId: user.id });
    this.createTechStack({ name: 'React', icon: 'fa-react', background: 'bg-blue-500', userId: user.id });
    this.createTechStack({ name: 'Node.js', icon: 'fa-node-js', background: 'bg-green-600', userId: user.id });
    this.createTechStack({ name: 'SQL', icon: 'fa-database', background: 'bg-gray-800', userId: user.id });
    this.createTechStack({ name: 'TypeScript', icon: 'fa-code', background: 'bg-gray-700', userId: user.id });
    
    // Create interests
    this.createInterest({ name: 'Music', description: 'Favorite genres', icon: 'fa-music', userId: user.id });
    this.createInterest({ name: 'Reading', description: 'Book recommendations', icon: 'fa-book', userId: user.id });
    this.createInterest({ name: 'Movies', description: 'Film reviews', icon: 'fa-film', userId: user.id });
    
    // Create projects
    this.createProject({ 
      name: 'Extreme Death Project', 
      description: 'Project description goes here...',
      icon: 'fa-skull-crossbones',
      iconBackground: 'bg-gray-700',
      userId: user.id 
    });
    
    this.createProject({ 
      name: 'Personal Website', 
      description: 'My personal portfolio and blog',
      icon: 'fa-code',
      iconBackground: 'bg-mint',
      userId: user.id 
    });
    
    this.createProject({ 
      name: 'AI Project', 
      description: 'Machine learning experiments',
      icon: 'fa-robot',
      iconBackground: 'bg-purple-light',
      userId: user.id 
    });
    
    // Create posts
    const now = new Date();
    
    this.createPost({
      title: 'Building Modern Web Applications',
      content: 'A comprehensive guide to creating responsive and performant web applications...',
      imageUrl: '/blog1.jpg',
      userId: user.id
    });
    
    this.createPost({
      title: 'Learning TypeScript in 2023',
      content: 'Essential TypeScript features and best practices for JavaScript developers...',
      imageUrl: '/blog2.jpg',
      userId: user.id
    });
    
    this.createPost({
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
      
      this.createActivity({
        date,
        count,
        userId: user.id
      });
    }
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
      createdAt: insertPost.createdAt || new Date() 
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
    const activity: Activity = { ...insertActivity, id };
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
    const profile: Profile = { ...insertProfile, id };
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
}

export const storage = new MemStorage();
