import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

export type PostStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published';
export type Language = 'en' | 'ar';

export interface Post {
  id: string;
  topic: string;
  title: string;
  body: string;
  language: Language;
  status: PostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  posts: Post[];
}

const DATA_DIR = join(process.cwd(), '.linkedin-engine');
const STORE_PATH = join(DATA_DIR, 'posts.json');

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadStore(): Store {
  ensureDir();
  if (!existsSync(STORE_PATH)) {
    return { posts: [] };
  }
  return JSON.parse(readFileSync(STORE_PATH, 'utf-8')) as Store;
}

export function saveStore(store: Store): void {
  ensureDir();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
