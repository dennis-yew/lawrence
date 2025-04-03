import { type Post as SchemaPost } from '@shared/schema';

export interface ApiPost {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  userId: number;
}

export interface ApiActivity {
  id: number;
  date: string;
  count: number;
  userId: number;
}