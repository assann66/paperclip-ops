import type { Post, PostStatus } from "./store.js";
import { loadStore, saveStore } from "./store.js";

const VALID_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  draft: ["in_review"],
  in_review: ["draft", "approved"],
  approved: ["scheduled", "in_review"],
  scheduled: ["published", "approved"],
  published: [],
};

export function transitionPost(postId: string, newStatus: PostStatus): Post {
  const store = loadStore();
  const post = store.posts.find((p) => p.id === postId);

  if (!post) {
    throw new Error(`Post not found: ${postId}`);
  }

  const allowed = VALID_TRANSITIONS[post.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Cannot transition from "${post.status}" to "${newStatus}". Allowed: ${allowed.join(", ") || "none"}`
    );
  }

  post.status = newStatus;
  post.updatedAt = new Date().toISOString();
  saveStore(store);
  return post;
}

export function listPosts(filter?: { status?: PostStatus; language?: string }): Post[] {
  const store = loadStore();
  let posts = store.posts;

  if (filter?.status) {
    posts = posts.filter((p) => p.status === filter.status);
  }
  if (filter?.language) {
    posts = posts.filter((p) => p.language === filter.language);
  }

  return posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getPost(postId: string): Post | undefined {
  const store = loadStore();
  return store.posts.find((p) => p.id === postId);
}
