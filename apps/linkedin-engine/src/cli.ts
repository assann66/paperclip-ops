#!/usr/bin/env node

import { Command } from 'commander';
import { suggestTopics, listAllTopics } from './lib/topics.js';
import { generateDraft, generateBilingualDrafts } from './lib/drafts.js';
import { transitionPost, listPosts, getPost } from './lib/workflow.js';
import type { Language, PostStatus } from './lib/store.js';

const program = new Command();

program
  .name('linkedin-engine')
  .description('LinkedIn content engine — topic generation, drafting, and review workflow')
  .version('0.1.0');

// --- Topics ---

program
  .command('topics')
  .description('Suggest random topics for LinkedIn posts')
  .option('-c, --count <n>', 'number of topics to suggest', '3')
  .option('-a, --all', 'list all available topics')
  .action((opts) => {
    const topics = opts.all ? listAllTopics() : suggestTopics(parseInt(opts.count));
    console.log('\n📋 Topic Suggestions\n');
    topics.forEach((t, i) => {
      console.log(`  ${i + 1}. [${t.theme}]`);
      console.log(`     EN: ${t.title_en}`);
      console.log(`     AR: ${t.title_ar}`);
      console.log(`     Tags: ${t.tags.join(', ')}\n`);
    });
  });

// --- Draft ---

program
  .command('draft')
  .description('Generate a draft post from a topic')
  .argument('<topic-index>', "topic index (1-based, from 'topics --all' list)")
  .option('-l, --lang <language>', 'language: en or ar', 'en')
  .option('-b, --bilingual', 'generate both EN and AR drafts')
  .action((indexStr, opts) => {
    const allTopics = listAllTopics();
    const index = parseInt(indexStr) - 1;

    if (index < 0 || index >= allTopics.length) {
      console.error(`Invalid topic index. Use 1-${allTopics.length}.`);
      process.exit(1);
    }

    const topic = allTopics[index];

    if (opts.bilingual) {
      const { en, ar } = generateBilingualDrafts(topic);
      console.log('\n✅ Bilingual drafts created\n');
      console.log(`  EN: [${en.id}] ${en.title}`);
      console.log(`  AR: [${ar.id}] ${ar.title}\n`);
    } else {
      const lang = opts.lang as Language;
      const post = generateDraft(topic, lang);
      console.log(`\n✅ Draft created [${post.id}]\n`);
      console.log(`  Title: ${post.title}`);
      console.log(`  Language: ${post.language}`);
      console.log(`  Status: ${post.status}\n`);
    }
  });

// --- List ---

program
  .command('list')
  .description('List all posts')
  .option(
    '-s, --status <status>',
    'filter by status (draft|in_review|approved|scheduled|published)',
  )
  .option('-l, --lang <language>', 'filter by language (en|ar)')
  .action((opts) => {
    const posts = listPosts({
      status: opts.status as PostStatus | undefined,
      language: opts.lang,
    });

    if (posts.length === 0) {
      console.log('\nNo posts found.\n');
      return;
    }

    console.log(`\n📝 Posts (${posts.length})\n`);
    posts.forEach((p) => {
      const statusIcon =
        p.status === 'draft'
          ? '📄'
          : p.status === 'in_review'
            ? '👀'
            : p.status === 'approved'
              ? '✅'
              : p.status === 'scheduled'
                ? '📅'
                : '🚀';
      console.log(`  ${statusIcon} [${p.id}] ${p.title}`);
      console.log(
        `     ${p.language.toUpperCase()} | ${p.status} | ${p.topic} | ${new Date(p.updatedAt).toLocaleDateString()}\n`,
      );
    });
  });

// --- Show ---

program
  .command('show')
  .description('Show full post content')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = getPost(postId);
    if (!post) {
      console.error(`Post not found: ${postId}`);
      process.exit(1);
    }

    console.log(`\n--- ${post.title} ---`);
    console.log(`ID: ${post.id} | Status: ${post.status} | Lang: ${post.language}`);
    console.log(`Topic: ${post.topic} | Tags: ${post.tags.join(', ')}`);
    console.log(`Created: ${post.createdAt} | Updated: ${post.updatedAt}`);
    console.log(`\n${post.body}\n`);
  });

// --- Review workflow ---

program
  .command('review')
  .description('Submit a draft for review')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = transitionPost(postId, 'in_review');
    console.log(`\n👀 Post [${post.id}] submitted for review\n`);
  });

program
  .command('approve')
  .description('Approve a post that is in review')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = transitionPost(postId, 'approved');
    console.log(`\n✅ Post [${post.id}] approved\n`);
  });

program
  .command('schedule')
  .description('Schedule an approved post')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = transitionPost(postId, 'scheduled');
    console.log(`\n📅 Post [${post.id}] scheduled\n`);
  });

program
  .command('publish')
  .description('Mark a scheduled post as published')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = transitionPost(postId, 'published');
    console.log(`\n🚀 Post [${post.id}] published\n`);
  });

program
  .command('reject')
  .description('Send a post back to draft (from in_review or approved)')
  .argument('<post-id>', 'post ID')
  .action((postId) => {
    const post = getPost(postId);
    if (!post) {
      console.error(`Post not found: ${postId}`);
      process.exit(1);
    }
    if (post.status === 'in_review') {
      const updated = transitionPost(postId, 'draft');
      console.log(`\n📄 Post [${updated.id}] sent back to draft\n`);
    } else if (post.status === 'approved') {
      const updated = transitionPost(postId, 'in_review');
      console.log(`\n👀 Post [${updated.id}] sent back to review\n`);
    } else {
      console.error(`Cannot reject a post in "${post.status}" status.`);
      process.exit(1);
    }
  });

program.parse();
