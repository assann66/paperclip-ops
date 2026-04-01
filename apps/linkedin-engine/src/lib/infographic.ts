import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InfographicSection {
  number: number;
  color: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  body: string;
}

export interface InfographicWarning {
  background: string;
  lines: string[];
}

export interface InfographicSpec {
  title: {
    ar: string;
    en: string;
  };
  headerColor: string;
  sections: InfographicSection[];
  warning?: InfographicWarning;
  footer: {
    text: string;
    background: string;
  };
  flowDiagram?: { boxes: { label: string; color: string }[] };
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

const NAMED_COLORS: Record<string, string> = {
  green: '#27AE60',
  blue: '#2980B9',
  yellow: '#F1C40F',
  orange: '#E67E22',
  red: '#E74C3C',
  purple: '#8E44AD',
  darkblue: '#1B365D',
};

function resolveColor(c: string): string {
  if (c.startsWith('#')) return c;
  return NAMED_COLORS[c.toLowerCase()] ?? c;
}

// ---------------------------------------------------------------------------
// Icon mapping — simple SVG icon shapes keyed by name
// ---------------------------------------------------------------------------

const ICON_SVG: Record<string, string> = {
  microphone: `<circle cx="12" cy="8" r="4" fill="white"/><rect x="10" y="12" width="4" height="5" rx="1" fill="white"/><path d="M7 14 C7 18, 17 18, 17 14" stroke="white" stroke-width="1.5" fill="none"/>`,
  target: `<circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="5" stroke="white" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="1.5" fill="white"/>`,
  checkmark: `<polyline points="5,13 10,18 19,6" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  chart: `<rect x="4" y="14" width="3" height="6" fill="white"/><rect x="9" y="10" width="3" height="10" fill="white"/><rect x="14" y="6" width="3" height="14" fill="white"/>`,
  gear: `<circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.5" fill="none"/><circle cx="12" cy="3" r="1.5" fill="white"/><circle cx="12" cy="21" r="1.5" fill="white"/><circle cx="3" cy="12" r="1.5" fill="white"/><circle cx="21" cy="12" r="1.5" fill="white"/>`,
  cabinet: `<rect x="5" y="3" width="14" height="18" rx="2" stroke="white" stroke-width="1.5" fill="none"/><line x1="5" y1="12" x2="19" y2="12" stroke="white" stroke-width="1.5"/><circle cx="12" cy="7.5" r="1" fill="white"/><circle cx="12" cy="16.5" r="1" fill="white"/>`,
  tasks: `<rect x="4" y="3" width="16" height="18" rx="2" stroke="white" stroke-width="1.5" fill="none"/><line x1="8" y1="8" x2="16" y2="8" stroke="white" stroke-width="1.5"/><line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="1.5"/><line x1="8" y1="16" x2="13" y2="16" stroke="white" stroke-width="1.5"/>`,
  plug: `<rect x="8" y="3" width="8" height="8" rx="1" stroke="white" stroke-width="1.5" fill="none"/><line x1="10" y1="3" x2="10" y2="0" stroke="white" stroke-width="1.5"/><line x1="14" y1="3" x2="14" y2="0" stroke="white" stroke-width="1.5"/><line x1="12" y1="11" x2="12" y2="18" stroke="white" stroke-width="2"/>`,
  robot: `<rect x="5" y="5" width="14" height="12" rx="3" stroke="white" stroke-width="1.5" fill="none"/><circle cx="9" cy="10" r="1.5" fill="white"/><circle cx="15" cy="10" r="1.5" fill="white"/><line x1="9" y1="14" x2="15" y2="14" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="5" x2="12" y2="2" stroke="white" stroke-width="1.5"/><circle cx="12" cy="1" r="1" fill="white"/>`,
  numbers: `<text x="12" y="16" text-anchor="middle" fill="white" font-size="14" font-weight="bold">#</text>`,
  rocket: `<path d="M12 2 C12 2 6 8 6 14 C6 18 12 22 12 22 C12 22 18 18 18 14 C18 8 12 2 12 2Z" stroke="white" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="2" fill="white"/>`,
};

function getIconSvg(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  return ICON_SVG[key] ?? ICON_SVG['target']!;
}

// ---------------------------------------------------------------------------
// SVG escape
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// SVG builder
// ---------------------------------------------------------------------------

const WIDTH = 1080;
const HEIGHT = 1350;

export function buildSvg(spec: InfographicSpec): string {
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">`,
  );

  // Background
  parts.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="#FFFFFF"/>`);

  // Font style
  parts.push(`<style>
    text { font-family: 'Noto Sans Arabic', 'IBM Plex Sans Arabic', 'Cairo', 'Arial', sans-serif; }
    .en-text { font-family: 'Arial', 'Helvetica', 'Noto Sans', sans-serif; }
  </style>`);

  let y = 0;

  // ---- Header ----
  const headerH = 200;
  const hdrColor = resolveColor(spec.headerColor || 'darkblue');
  parts.push(`<rect x="0" y="${y}" width="${WIDTH}" height="${headerH}" fill="${hdrColor}"/>`);

  // English keyword — top right area
  parts.push(
    `<text x="${WIDTH - 60}" y="${y + 60}" text-anchor="end" class="en-text" fill="rgba(255,255,255,0.5)" font-size="32" font-weight="700" letter-spacing="4">${esc(spec.title.en)}</text>`,
  );

  // Arabic title — centered
  parts.push(
    `<text x="${WIDTH / 2}" y="${y + 130}" text-anchor="middle" fill="white" font-size="52" font-weight="700" direction="rtl">${esc(spec.title.ar)}</text>`,
  );

  // Decorative line
  parts.push(
    `<rect x="${WIDTH / 2 - 60}" y="${y + 155}" width="120" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>`,
  );

  y += headerH;

  // ---- Flow diagram (optional) ----
  if (spec.flowDiagram && spec.flowDiagram.boxes.length > 0) {
    const diagramH = 120;
    parts.push(`<rect x="0" y="${y}" width="${WIDTH}" height="${diagramH}" fill="#F8F9FA"/>`);

    const boxes = spec.flowDiagram.boxes;
    const boxW = 180;
    const gap = 40;
    const totalW = boxes.length * boxW + (boxes.length - 1) * gap;
    let bx = (WIDTH - totalW) / 2;
    const by = y + 25;

    boxes.forEach((box, i) => {
      const bc = resolveColor(box.color);
      parts.push(
        `<rect x="${bx}" y="${by}" width="${boxW}" height="${diagramH - 50}" rx="12" fill="${bc}"/>`,
      );
      parts.push(
        `<text x="${bx + boxW / 2}" y="${by + (diagramH - 50) / 2 + 6}" text-anchor="middle" fill="white" font-size="18" font-weight="600" direction="rtl">${esc(box.label)}</text>`,
      );

      if (i < boxes.length - 1) {
        const arrowX = bx + boxW + 5;
        const arrowY = by + (diagramH - 50) / 2;
        parts.push(
          `<polygon points="${arrowX},${arrowY - 8} ${arrowX + 30},${arrowY} ${arrowX},${arrowY + 8}" fill="#BDC3C7"/>`,
        );
      }

      bx += boxW + gap;
    });

    y += diagramH;
  }

  // ---- Sections ----
  const sectionCount = spec.sections.length;
  const warningH = spec.warning ? 140 : 0;
  const footerH = 120;
  const availableH = HEIGHT - y - warningH - footerH;
  const sectionH = Math.floor(availableH / sectionCount);
  const sectionGap = 6;

  spec.sections.forEach((sec) => {
    const secColor = resolveColor(sec.color);

    // Section background — white with colored right strip (RTL layout)
    parts.push(`<rect x="0" y="${y}" width="${WIDTH}" height="${sectionH - sectionGap}" fill="#FAFBFC"/>`);
    parts.push(`<rect x="${WIDTH - 10}" y="${y}" width="10" height="${sectionH - sectionGap}" fill="${secColor}"/>`);

    const cy = y + (sectionH - sectionGap) / 2;

    // Number circle — right side for RTL
    const numCx = WIDTH - 80;
    parts.push(`<circle cx="${numCx}" cy="${cy}" r="34" fill="${secColor}"/>`);
    parts.push(
      `<text x="${numCx}" y="${cy + 12}" text-anchor="middle" fill="white" font-size="36" font-weight="800">${sec.number}</text>`,
    );

    // Icon circle — left side
    const iconCx = 80;
    parts.push(`<circle cx="${iconCx}" cy="${cy}" r="30" fill="${secColor}" opacity="0.15"/>`);
    parts.push(
      `<g transform="translate(${iconCx - 12}, ${cy - 12})">${getIconSvg(sec.icon).replace(/white/g, secColor)}</g>`,
    );

    // English keyword — left side
    parts.push(
      `<text x="130" y="${cy - 20}" class="en-text" fill="${secColor}" font-size="20" font-weight="700" letter-spacing="2">${esc(sec.titleEn)}</text>`,
    );

    // Arabic title — RTL, anchored at right margin (start = right edge for RTL)
    const textRight = WIDTH - 140;
    parts.push(
      `<text x="${textRight}" y="${cy - 12}" text-anchor="start" fill="#2C3E50" font-size="28" font-weight="700" direction="rtl">${esc(sec.titleAr)}</text>`,
    );

    // Body text — RTL
    parts.push(
      `<text x="${textRight}" y="${cy + 18}" text-anchor="start" fill="#5D6D7E" font-size="20" direction="rtl">${esc(sec.body)}</text>`,
    );

    y += sectionH;
  });

  // ---- Warning section ----
  if (spec.warning) {
    const wBg = resolveColor(spec.warning.background);
    parts.push(`<rect x="40" y="${y}" width="${WIDTH - 80}" height="${warningH - 20}" rx="16" fill="${wBg}" opacity="0.15"/>`);
    parts.push(`<rect x="40" y="${y}" width="8" height="${warningH - 20}" rx="4" fill="${wBg}"/>`);

    // Warning icon — right side for RTL
    parts.push(
      `<text x="${WIDTH - 80}" y="${y + 35}" text-anchor="end" fill="${wBg}" font-size="28">⚠</text>`,
    );

    spec.warning.lines.forEach((line, i) => {
      parts.push(
        `<text x="${WIDTH - 80}" y="${y + 38 + i * 32}" text-anchor="start" fill="#2C3E50" font-size="22" font-weight="500" direction="rtl">${esc(line)} •</text>`,
      );
    });

    y += warningH;
  }

  // ---- Footer ----
  const ftBg = resolveColor(spec.footer.background || 'darkblue');
  parts.push(`<rect x="0" y="${HEIGHT - footerH}" width="${WIDTH}" height="${footerH}" fill="${ftBg}"/>`);
  parts.push(
    `<text x="${WIDTH / 2}" y="${HEIGHT - footerH + 50}" text-anchor="middle" fill="white" font-size="22" font-weight="500" direction="rtl">${esc(spec.footer.text)}</text>`,
  );

  // LinkedIn icon placeholder — bottom left
  parts.push(
    `<rect x="40" y="${HEIGHT - footerH + 25}" width="44" height="44" rx="8" fill="rgba(255,255,255,0.2)"/>`,
  );
  parts.push(
    `<text x="62" y="${HEIGHT - footerH + 56}" text-anchor="middle" fill="white" font-size="24" font-weight="700">in</text>`,
  );

  parts.push('</svg>');

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// PNG renderer (via sharp)
// ---------------------------------------------------------------------------

function ensureFontConfig(): void {
  if (process.env['FONTCONFIG_PATH']) return;

  const fcDir = join(process.env['HOME'] || '/tmp', '.cache', 'linkedin-engine', 'fontconfig');
  const fcConf = join(fcDir, 'fonts.conf');
  const fontDir = join(process.env['HOME'] || '/tmp', '.local', 'share', 'fonts');

  if (!existsSync(fcConf) && existsSync(fontDir)) {
    mkdirSync(fcDir, { recursive: true });
    const cacheDir = join(fcDir, 'cache');
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(
      fcConf,
      `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <dir>${fontDir}</dir>
  <cachedir>${cacheDir}</cachedir>
  <alias><family>sans-serif</family><prefer>
    <family>Noto Sans Arabic</family><family>Noto Sans</family>
  </prefer></alias>
</fontconfig>`,
    );
    process.env['FONTCONFIG_PATH'] = fcDir;
  }
}

export async function renderPng(
  spec: InfographicSpec,
  outputPath: string,
): Promise<string> {
  ensureFontConfig();

  const sharp = (await import('sharp')).default;

  const svg = buildSvg(spec);
  const svgBuffer = Buffer.from(svg);

  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  await sharp(svgBuffer).resize(WIDTH, HEIGHT).png().toFile(outputPath);

  return outputPath;
}

// ---------------------------------------------------------------------------
// JSON spec loader
// ---------------------------------------------------------------------------

export function parseSpecFile(filePath: string): InfographicSpec {
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as InfographicSpec;
}
