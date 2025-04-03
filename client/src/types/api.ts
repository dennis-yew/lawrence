import { type Post as SchemaPost } from '@shared/schema';

export interface ApiPost extends Omit<SchemaPost, 'createdAt'> {
  createdAt: string;
}