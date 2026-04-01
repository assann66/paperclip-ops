import type { Language, Post } from './store.js';
import { generateId, loadStore, saveStore } from './store.js';
import type { Topic } from './topics.js';

interface DraftTemplates {
  en: (topic: Topic) => string;
  ar: (topic: Topic) => string;
}

const templates: DraftTemplates = {
  en: (topic) => `${topic.title_en}

In today's rapidly evolving business landscape, ${topic.theme.toLowerCase()} isn't just a buzzword — it's a strategic imperative.

Here are three key takeaways for business leaders:

1. Start with a clear problem statement, not a technology solution
2. Invest in your team's capabilities alongside the technology
3. Measure outcomes, not just outputs

The organizations that thrive in the next decade will be those that embrace ${topic.theme.toLowerCase()} thoughtfully and strategically.

What's your experience with ${topic.theme.toLowerCase()}? I'd love to hear your thoughts in the comments.

#${topic.tags.join(' #')}`,

  ar: (topic) => `${topic.title_ar}

\u0641\u064a \u0639\u0627\u0644\u0645 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u062a\u063a\u064a\u0631 \u0628\u0627\u0633\u062a\u0645\u0631\u0627\u0631\u060c \u0644\u0645 \u064a\u0639\u062f \u0645\u0648\u0636\u0648\u0639 ${topic.theme.toLowerCase()} \u0645\u062c\u0631\u062f \u0643\u0644\u0645\u0629 \u0631\u0646\u0627\u0646\u0629 \u2014 \u0628\u0644 \u0647\u0648 \u0636\u0631\u0648\u0631\u0629 \u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0629.

\u0625\u0644\u064a\u0643\u0645 \u062b\u0644\u0627\u062b \u0646\u0642\u0627\u0637 \u0631\u0626\u064a\u0633\u064a\u0629 \u0644\u0642\u0627\u062f\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644:

\u0661. \u0627\u0628\u062f\u0623 \u0628\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0645\u0634\u0643\u0644\u0629 \u0628\u0648\u0636\u0648\u062d\u060c \u0648\u0644\u064a\u0633 \u0628\u0627\u0644\u062d\u0644 \u0627\u0644\u062a\u0642\u0646\u064a
\u0662. \u0627\u0633\u062a\u062b\u0645\u0631 \u0641\u064a \u0642\u062f\u0631\u0627\u062a \u0641\u0631\u064a\u0642\u0643 \u0628\u0627\u0644\u062a\u0648\u0627\u0632\u064a \u0645\u0639 \u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627
\u0663. \u0642\u0633 \u0627\u0644\u0646\u062a\u0627\u0626\u062c\u060c \u0648\u0644\u064a\u0633 \u0641\u0642\u0637 \u0627\u0644\u0645\u062e\u0631\u062c\u0627\u062a

\u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a \u0627\u0644\u062a\u064a \u0633\u062a\u0632\u062f\u0647\u0631 \u0641\u064a \u0627\u0644\u0639\u0642\u062f \u0627\u0644\u0642\u0627\u062f\u0645 \u0647\u064a \u0627\u0644\u062a\u064a \u062a\u062a\u0628\u0646\u0649 ${topic.theme.toLowerCase()} \u0628\u0634\u0643\u0644 \u0645\u062f\u0631\u0648\u0633 \u0648\u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a.

\u0645\u0627 \u062a\u062c\u0631\u0628\u062a\u0643\u0645 \u0645\u0639 ${topic.theme.toLowerCase()}\u061f \u0623\u062d\u0628 \u0623\u0646 \u0623\u0633\u0645\u0639 \u0622\u0631\u0627\u0621\u0643\u0645 \u0641\u064a \u0627\u0644\u062a\u0639\u0644\u064a\u0642\u0627\u062a.

#${topic.tags.join(' #')}`,
};

export function generateDraft(topic: Topic, language: Language): Post {
  const now = new Date().toISOString();
  const title = language === 'en' ? topic.title_en : topic.title_ar;
  const body = templates[language](topic);

  const post: Post = {
    id: generateId(),
    topic: topic.theme,
    title,
    body,
    language,
    status: 'draft',
    tags: topic.tags,
    createdAt: now,
    updatedAt: now,
  };

  const store = loadStore();
  store.posts.push(post);
  saveStore(store);

  return post;
}

export function generateBilingualDrafts(topic: Topic): { en: Post; ar: Post } {
  return {
    en: generateDraft(topic, 'en'),
    ar: generateDraft(topic, 'ar'),
  };
}
