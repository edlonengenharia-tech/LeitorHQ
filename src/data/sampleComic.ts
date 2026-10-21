import { ComicPage, Panel } from '../types';

// Generate sample comic pages with detailed SVG-based illustrations
const generateComicImage = (pageNumber: number, total: number): string => {
  const themes = [
    { // Page 0: Opening scene - city at night
      bg: '#0a0a1a',
      panels: [
        { colors: ['#1a1a3e', '#2d1b69', '#0f3460'], content: 'cityscape' },
        { colors: ['#e94560', '#16213e', '#1a1a2e'], content: 'character' },
        { colors: ['#0f3460', '#533483', '#1a1a2e'], content: 'dialogue' },
        { colors: ['#1a1a3e', '#e94560', '#0f3460'], content: 'action' },
      ]
    },
    { // Page 1: Action sequence
      bg: '#1a0a0a',
      panels: [
        { colors: ['#d63031', '#2d3436', '#0984e3'], content: 'explosion' },
        { colors: ['#0984e3', '#2d3436', '#d63031'], content: 'speedlines' },
        { colors: ['#6c5ce7', '#2d3436', '#fdcb6e'], content: 'impact' },
        { colors: ['#00b894', '#2d3436', '#e17055'], content: 'reaction' },
        { colors: ['#fdcb6e', '#2d3436', '#6c5ce7'], content: 'aftermath' },
      ]
    },
    { // Page 2: Mystery/detective
      bg: '#0d0d1a',
      panels: [
        { colors: ['#2d3436', '#636e72', '#dfe6e9'], content: 'evidence' },
        { colors: ['#0c0c1d', '#4ecdc4', '#2d3436'], content: 'closeup' },
        { colors: ['#2d3436', '#45b7d1', '#0c0c1d'], content: 'thought' },
        { colors: ['#4ecdc4', '#2d3436', '#0c0c1d'], content: 'reveal' },
      ]
    },
    { // Page 3: Sci-fi
      bg: '#0a0a2a',
      panels: [
        { colors: ['#00d2ff', '#0a0a2a', '#3a7bd5'], content: 'space' },
        { colors: ['#3a7bd5', '#0a0a2a', '#00d2ff'], content: 'technology' },
        { colors: ['#0a0a2a', '#00d2ff', '#1a1a4e'], content: 'alien' },
        { colors: ['#ff6b6b', '#0a0a2a', '#00d2ff'], content: 'confrontation' },
        { colors: ['#00d2ff', '#0a0a2a', '#ff6b6b'], content: 'escape' },
      ]
    },
    { // Page 4: Emotional scene
      bg: '#1a0a1a',
      panels: [
        { colors: ['#e43f5a', '#1b1b2f', '#162447'], content: 'memory' },
        { colors: ['#1f4068', '#1b1b2f', '#e43f5a'], content: 'emotion' },
        { colors: ['#1b1b2f', '#e43f5a', '#162447'], content: 'silence' },
        { colors: ['#162447', '#1b1b2f', '#e43f5a'], content: 'resolution' },
      ]
    },
    { // Page 5: Battle scene
      bg: '#0d1117',
      panels: [
        { colors: ['#f97316', '#0d1117', '#22c55e'], content: 'charge' },
        { colors: ['#22c55e', '#0d1117', '#3b82f6'], content: 'clash' },
        { colors: ['#3b82f6', '#0d1117', '#f97316'], content: 'power' },
        { colors: ['#ef4444', '#0d1117', '#f97316'], content: 'turning' },
        { colors: ['#8b5cf6', '#0d1117', '#22c55e'], content: 'victory' },
      ]
    },
    { // Page 6: Quiet moment
      bg: '#18181b',
      panels: [
        { colors: ['#f59e0b', '#18181b', '#10b981'], content: 'landscape' },
        { colors: ['#10b981', '#18181b', '#6366f1'], content: 'contemplation' },
        { colors: ['#18181b', '#f59e0b', '#10b981'], content: 'conversation' },
      ]
    },
    { // Page 7: Finale
      bg: '#0c0c0c',
      panels: [
        { colors: ['#ef4444', '#0c0c0c', '#f59e0b'], content: 'finale1' },
        { colors: ['#8b5cf6', '#0c0c0c', '#06b6d4'], content: 'finale2' },
        { colors: ['#0c0c0c', '#ef4444', '#f59e0b'], content: 'finale3' },
      ]
    },
  ];

  const theme = themes[pageNumber % themes.length];

  const panelSvgs = theme.panels.map((panelTheme, i) => {
    const layout = generatePanels(`page-${pageNumber}`);
    const panel = layout[i];
    if (!panel) return '';

    const px = panel.x * 800;
    const py = panel.y * 1200;
    const pw = panel.width * 800;
    const ph = panel.height * 1200;
    const [c1, c2, c3] = panelTheme.colors;

    let content = '';
    switch (panelTheme.content) {
      case 'cityscape':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c1}"/>
          ${Array.from({ length: 8 }, (_, j) => {
            const bx = px + j * pw * 0.13;
            const bw = pw * 0.1;
            const bh = ph * (0.3 + (j % 3) * 0.15);
            return `<rect x="${bx}" y="${py + ph - bh}" width="${bw}" height="${bh}" fill="${c2}" opacity="0.8"/>
              ${Array.from({ length: Math.floor(bh / 15) }, (_, k) => 
                `<rect x="${bx + 3}" y="${py + ph - bh + k * 15 + 5}" width="${bw - 6}" height="3" fill="${c3}" opacity="${0.3 + Math.random() * 0.5}"/>`
              ).join('')}`;
          }).join('')}
          <circle cx="${px + pw * 0.8}" cy="${py + ph * 0.15}" r="${pw * 0.05}" fill="#fffde7" opacity="0.8"/>
        `;
        break;
      case 'character':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}"/>
          <circle cx="${px + pw * 0.5}" cy="${py + ph * 0.3}" r="${Math.min(pw, ph) * 0.18}" fill="${c1}" opacity="0.9"/>
          <ellipse cx="${px + pw * 0.5}" cy="${py + ph * 0.35}" rx="${Math.min(pw, ph) * 0.05}" ry="${Math.min(pw, ph) * 0.03}" fill="${c3}"/>
          <rect x="${px + pw * 0.3}" y="${py + ph * 0.5}" width="${pw * 0.4}" height="${ph * 0.45}" rx="5" fill="${c1}" opacity="0.85"/>
          ${Array.from({ length: 5 }, (_, j) => 
            `<line x1="${px + pw * (0.2 + j * 0.15)}" y1="${py}" x2="${px + pw * (0.1 + j * 0.15)}" y2="${py + ph}" stroke="${c3}" stroke-width="1" opacity="0.2"/>`
          ).join('')}
        `;
        break;
      case 'dialogue':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c1}"/>
          <rect x="${px + pw * 0.1}" y="${py + ph * 0.1}" width="${pw * 0.6}" height="${ph * 0.2}" rx="10" fill="white" opacity="0.95"/>
          <polygon points="${px + pw * 0.3},${py + ph * 0.3} ${px + pw * 0.35},${py + ph * 0.45} ${px + pw * 0.4},${py + ph * 0.3}" fill="white" opacity="0.95"/>
          ${Array.from({ length: 3 }, (_, j) => 
            `<line x1="${px + pw * 0.15}" y1="${py + ph * (0.16 + j * 0.05)}" x2="${px + pw * (0.4 + j * 0.05)}" y2="${py + ph * (0.16 + j * 0.05)}" stroke="#333" stroke-width="2" opacity="0.6"/>`
          ).join('')}
          <circle cx="${px + pw * 0.7}" cy="${py + ph * 0.6}" r="${Math.min(pw, ph) * 0.15}" fill="${c2}" opacity="0.7"/>
        `;
        break;
      case 'action':
      case 'explosion':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}"/>
          <polygon points="${Array.from({ length: 16 }, (_, j) => {
            const angle = (j / 16) * Math.PI * 2;
            const r = j % 2 === 0 ? Math.min(pw, ph) * 0.4 : Math.min(pw, ph) * 0.15;
            return `${px + pw * 0.5 + Math.cos(angle) * r},${py + ph * 0.5 + Math.sin(angle) * r}`;
          }).join(' ')}" fill="${c1}" opacity="0.9"/>
          <circle cx="${px + pw * 0.5}" cy="${py + ph * 0.5}" r="${Math.min(pw, ph) * 0.1}" fill="${c3}" opacity="0.8"/>
          ${Array.from({ length: 12 }, (_, j) => {
            const angle = (j / 12) * Math.PI * 2;
            const cx = px + pw * 0.5;
            const cy = py + ph * 0.5;
            return `<line x1="${cx + Math.cos(angle) * Math.min(pw, ph) * 0.15}" y1="${cy + Math.sin(angle) * Math.min(pw, ph) * 0.15}" x2="${cx + Math.cos(angle) * Math.min(pw, ph) * 0.45}" y2="${cy + Math.sin(angle) * Math.min(pw, ph) * 0.45}" stroke="${c3}" stroke-width="3" opacity="0.6"/>`;
          }).join('')}
        `;
        break;
      case 'speedlines':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}"/>
          ${Array.from({ length: 30 }, (_, j) => {
            const y = py + (j / 30) * ph;
            const w = pw * (0.3 + Math.random() * 0.7);
            return `<line x1="${px + pw - w}" y1="${y}" x2="${px + pw}" y2="${y}" stroke="${c1}" stroke-width="${1 + Math.random() * 2}" opacity="${0.3 + Math.random() * 0.5}"/>`;
          }).join('')}
          <circle cx="${px + pw * 0.25}" cy="${py + ph * 0.5}" r="${Math.min(pw, ph) * 0.12}" fill="${c3}" opacity="0.8"/>
        `;
        break;
      case 'space':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}"/>
          ${Array.from({ length: 40 }, (_, j) => 
            `<circle cx="${px + Math.random() * pw}" cy="${py + Math.random() * ph}" r="${0.5 + Math.random() * 2}" fill="white" opacity="${0.3 + Math.random() * 0.7}"/>`
          ).join('')}
          <circle cx="${px + pw * 0.7}" cy="${py + ph * 0.4}" r="${Math.min(pw, ph) * 0.2}" fill="${c1}" opacity="0.6"/>
          <ellipse cx="${px + pw * 0.7}" cy="${py + ph * 0.4}" rx="${Math.min(pw, ph) * 0.35}" ry="${Math.min(pw, ph) * 0.05}" fill="${c3}" opacity="0.3" transform="rotate(-20 ${px + pw * 0.7} ${py + ph * 0.4})"/>
        `;
        break;
      case 'landscape':
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}"/>
          <rect x="${px}" y="${py + ph * 0.6}" width="${pw}" height="${ph * 0.4}" fill="${c1}" opacity="0.5"/>
          ${Array.from({ length: 5 }, (_, j) => {
            const mx = px + j * pw * 0.25;
            const mh = ph * (0.2 + Math.random() * 0.3);
            return `<polygon points="${mx},${py + ph * 0.6} ${mx + pw * 0.15},${py + ph * 0.6 - mh} ${mx + pw * 0.3},${py + ph * 0.6}" fill="${c3}" opacity="0.4"/>`;
          }).join('')}
          <circle cx="${px + pw * 0.8}" cy="${py + ph * 0.2}" r="${Math.min(pw, ph) * 0.08}" fill="${c1}" opacity="0.9"/>
        `;
        break;
      default:
        content = `
          <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c1}"/>
          <rect x="${px + pw * 0.1}" y="${py + ph * 0.1}" width="${pw * 0.8}" height="${ph * 0.8}" fill="${c2}" opacity="0.3" rx="5"/>
          <circle cx="${px + pw * 0.5}" cy="${py + ph * 0.5}" r="${Math.min(pw, ph) * 0.15}" fill="${c3}" opacity="0.5"/>
        `;
    }

    return `
      <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${c2}" rx="1" stroke="#111" stroke-width="3"/>
      ${content}
    `;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
    <rect width="800" height="1200" fill="${theme.bg}"/>
    ${panelSvgs}
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Panel layouts for different page types
const panelLayouts: Record<string, Panel[]> = {
  'page-0': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.25 },
    { x: 0.02, y: 0.29, width: 0.46, height: 0.35 },
    { x: 0.52, y: 0.29, width: 0.46, height: 0.35 },
    { x: 0.02, y: 0.66, width: 0.96, height: 0.32 },
  ],
  'page-1': [
    { x: 0.02, y: 0.02, width: 0.6, height: 0.45 },
    { x: 0.65, y: 0.02, width: 0.33, height: 0.22 },
    { x: 0.65, y: 0.26, width: 0.33, height: 0.21 },
    { x: 0.02, y: 0.49, width: 0.46, height: 0.49 },
    { x: 0.52, y: 0.49, width: 0.46, height: 0.49 },
  ],
  'page-2': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.3 },
    { x: 0.02, y: 0.34, width: 0.3, height: 0.64 },
    { x: 0.35, y: 0.34, width: 0.63, height: 0.3 },
    { x: 0.35, y: 0.66, width: 0.63, height: 0.32 },
  ],
  'page-3': [
    { x: 0.02, y: 0.02, width: 0.46, height: 0.3 },
    { x: 0.52, y: 0.02, width: 0.46, height: 0.3 },
    { x: 0.02, y: 0.34, width: 0.96, height: 0.3 },
    { x: 0.02, y: 0.66, width: 0.46, height: 0.32 },
    { x: 0.52, y: 0.66, width: 0.46, height: 0.32 },
  ],
  'page-4': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.45 },
    { x: 0.02, y: 0.49, width: 0.3, height: 0.49 },
    { x: 0.35, y: 0.49, width: 0.63, height: 0.24 },
    { x: 0.35, y: 0.75, width: 0.63, height: 0.23 },
  ],
  'page-5': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.2 },
    { x: 0.02, y: 0.24, width: 0.46, height: 0.36 },
    { x: 0.52, y: 0.24, width: 0.46, height: 0.36 },
    { x: 0.02, y: 0.62, width: 0.3, height: 0.36 },
    { x: 0.35, y: 0.62, width: 0.63, height: 0.36 },
  ],
  'page-6': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.45 },
    { x: 0.02, y: 0.49, width: 0.46, height: 0.49 },
    { x: 0.52, y: 0.49, width: 0.46, height: 0.49 },
  ],
  'page-7': [
    { x: 0.02, y: 0.02, width: 0.96, height: 0.3 },
    { x: 0.02, y: 0.34, width: 0.46, height: 0.32 },
    { x: 0.52, y: 0.34, width: 0.46, height: 0.64 },
  ],
};

export function generatePanels(pageId: string): Panel[] {
  return panelLayouts[pageId] || panelLayouts['page-0'];
}

// Generate 8 sample comic pages
export const sampleComic: ComicPage[] = Array.from({ length: 8 }, (_, i) => ({
  id: `page-${i}`,
  image: generateComicImage(i, 8),
  title: `Chapter 1 - Page ${i + 1}`,
}));
