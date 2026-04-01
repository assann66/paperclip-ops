export interface Topic {
  theme: string;
  title_en: string;
  title_ar: string;
  tags: string[];
}

const TOPIC_POOL: Topic[] = [
  {
    theme: "AI Strategy",
    title_en: "Why Every CEO Needs an AI Strategy in 2026",
    title_ar: "\u0644\u0645\u0627\u0630\u0627 \u064a\u062d\u062a\u0627\u062c \u0643\u0644 \u0631\u0626\u064a\u0633 \u062a\u0646\u0641\u064a\u0630\u064a \u0625\u0644\u0649 \u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0629 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0641\u064a 2026",
    tags: ["AI", "Strategy", "Leadership"],
  },
  {
    theme: "Digital Transformation",
    title_en: "The Hidden Cost of Delaying Digital Transformation",
    title_ar: "\u0627\u0644\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u062e\u0641\u064a\u0629 \u0644\u062a\u0623\u062e\u064a\u0631 \u0627\u0644\u062a\u062d\u0648\u0644 \u0627\u0644\u0631\u0642\u0645\u064a",
    tags: ["Transformation", "Business", "Technology"],
  },
  {
    theme: "AI Integration",
    title_en: "5 Signs Your Business Is Ready for AI Integration",
    title_ar: "5 \u0639\u0644\u0627\u0645\u0627\u062a \u062a\u062f\u0644 \u0639\u0644\u0649 \u0623\u0646 \u0639\u0645\u0644\u0643 \u062c\u0627\u0647\u0632 \u0644\u062f\u0645\u062c \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
    tags: ["AI", "Integration", "Business"],
  },
  {
    theme: "Leadership",
    title_en: "Leading Through Technological Disruption: A Framework",
    title_ar: "\u0627\u0644\u0642\u064a\u0627\u062f\u0629 \u0641\u064a \u0639\u0635\u0631 \u0627\u0644\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a: \u0625\u0637\u0627\u0631 \u0639\u0645\u0644",
    tags: ["Leadership", "Innovation", "Framework"],
  },
  {
    theme: "ROI of AI",
    title_en: "Measuring AI ROI: Beyond the Hype",
    title_ar: "\u0642\u064a\u0627\u0633 \u0639\u0627\u0626\u062f \u0627\u0644\u0627\u0633\u062a\u062b\u0645\u0627\u0631 \u0641\u064a \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a: \u0645\u0627 \u0648\u0631\u0627\u0621 \u0627\u0644\u0636\u062c\u0629",
    tags: ["AI", "ROI", "Business"],
  },
  {
    theme: "Talent & AI",
    title_en: "Building AI-Ready Teams: Hiring vs. Upskilling",
    title_ar: "\u0628\u0646\u0627\u0621 \u0641\u0631\u0642 \u062c\u0627\u0647\u0632\u0629 \u0644\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a: \u0627\u0644\u062a\u0648\u0638\u064a\u0641 \u0623\u0645 \u0627\u0644\u062a\u0637\u0648\u064a\u0631",
    tags: ["AI", "Talent", "HR", "Leadership"],
  },
  {
    theme: "AI Ethics",
    title_en: "Responsible AI: What Business Leaders Must Know",
    title_ar: "\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0627\u0644\u0645\u0633\u0624\u0648\u0644: \u0645\u0627 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0639\u0631\u0641\u0647 \u0642\u0627\u062f\u0629 \u0627\u0644\u0623\u0639\u0645\u0627\u0644",
    tags: ["AI", "Ethics", "Governance"],
  },
  {
    theme: "Automation",
    title_en: "Smart Automation: Start Small, Scale Fast",
    title_ar: "\u0627\u0644\u0623\u062a\u0645\u062a\u0629 \u0627\u0644\u0630\u0643\u064a\u0629: \u0627\u0628\u062f\u0623 \u0635\u063a\u064a\u0631\u0627\u064b\u060c \u062a\u0648\u0633\u0639 \u0628\u0633\u0631\u0639\u0629",
    tags: ["Automation", "Efficiency", "Operations"],
  },
  {
    theme: "Data Strategy",
    title_en: "Your Data Is Your Moat: Building a Data-Driven Culture",
    title_ar: "\u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0647\u064a \u062d\u0635\u0646\u0643: \u0628\u0646\u0627\u0621 \u062b\u0642\u0627\u0641\u0629 \u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",
    tags: ["Data", "Strategy", "Culture"],
  },
  {
    theme: "AI Consulting",
    title_en: "When to Hire an AI Consultant (And When Not To)",
    title_ar: "\u0645\u062a\u0649 \u062a\u0633\u062a\u0639\u064a\u0646 \u0628\u0645\u0633\u062a\u0634\u0627\u0631 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a (\u0648\u0645\u062a\u0649 \u0644\u0627))",
    tags: ["AI", "Consulting", "Decision-Making"],
  },
];

export function suggestTopics(count: number = 3): Topic[] {
  const shuffled = [...TOPIC_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, TOPIC_POOL.length));
}

export function listAllTopics(): Topic[] {
  return TOPIC_POOL;
}
