import { ArtStyle, CameraPreset } from '../types';
import { AssetCategory } from '../types/assets';
import { rendererRegistry, renderPendingRenderer, RenderContext } from './rendererRegistry';

export interface SvgAssetOptions {
  title: string;
  category: AssetCategory;
  style: ArtStyle;
  seed: number;
  tags?: string[];
  palette?: string[];
  lighting?: string;
  poseMotion?: string;
  expressionEmotion?: string;
  phoneme?: string;
  cameraPreset?: CameraPreset;
  propName?: string;
  waveform?: number[];
  subcategory?: string;
  family?: string;
  archetype?: string;
  rendererKey?: string;
  orientation?: 'front' | '3/4 left' | '3/4 right' | 'profile left' | 'profile right' | 'back';
  pose?: string;
  accessory?: string;
}

// Seeded deterministic pseudo-random generator
function createRng(seed: number) {
  let s = (Math.abs(seed) * 1664525 + 1013904223) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function generateLibraryAssetSvg(options: SvgAssetOptions): string {
  const {
    title,
    category,
    style,
    seed,
    palette = [],
    lighting = 'Cinematic Volumetric',
    poseMotion = '',
    expressionEmotion = '',
    phoneme = '',
    waveform = [],
    subcategory = '',
    family = '',
    archetype = '',
    rendererKey = '',
    orientation = 'front',
    pose = '',
    accessory = ''
  } = options;

  const s = Math.abs(seed) % 10000;

  // Curated color themes per style
  const styleColorThemes: Record<ArtStyle, { bg1: string; bg2: string; acc1: string; acc2: string; glow: string; tint: string }> = {
    anime: { bg1: '#0d1322', bg2: '#231f47', acc1: '#f43f5e', acc2: '#38bdf8', glow: '#fb7185', tint: '#818cf8' },
    cyberpunk: { bg1: '#05060b', bg2: '#160c28', acc1: '#06b6d4', acc2: '#ec4899', glow: '#a855f7', tint: '#22d3ee' },
    '3D': { bg1: '#0a1128', bg2: '#1c2541', acc1: '#f59e0b', acc2: '#10b981', glow: '#fbbf24', tint: '#38bdf8' },
    cartoon: { bg1: '#1f1338', bg2: '#4c1d95', acc1: '#fbbf24', acc2: '#4ade80', glow: '#f43f5e', tint: '#a78bfa' },
    realistic: { bg1: '#141416', bg2: '#242429', acc1: '#f97316', acc2: '#94a3b8', glow: '#fdba74', tint: '#cbd5e1' },
    comic: { bg1: '#181514', bg2: '#26201e', acc1: '#ef4444', acc2: '#facc15', glow: '#f87171', tint: '#ffffff' },
    'oil-painting': { bg1: '#1f150e', bg2: '#3b2413', acc1: '#d97706', acc2: '#65a30d', glow: '#fcd34d', tint: '#e2b36b' }
  };

  const sc = styleColorThemes[style] || styleColorThemes.anime;
  const p1 = palette[0] || sc.acc1;
  const p2 = palette[1] || sc.acc2;
  const p3 = palette[2] || sc.glow;
  const p4 = sc.tint;

  // Render context for authoritative registry
  const ctx: RenderContext = {
    title,
    category,
    family,
    rendererKey: rendererKey || archetype || family.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    style,
    seed,
    tags: options.tags || [],
    palette,
    lighting,
    orientation,
    pose,
    accessory,
    p1,
    p2,
    p3,
    p4,
    sc,
    s,
    phoneme,
    waveform,
    cameraPreset: options.cameraPreset
  };

  let innerSvg = '';
  let archetypeLabel = (rendererKey || archetype || family || category).toUpperCase().replace(/-/g, ' ');

  // =========================================================================
  // AUTHORITATIVE REGISTRY DISPATCH (Requirement 7 & 8)
  // =========================================================================
  if (category === 'characters' || category === 'backgrounds' || category === 'props' || category === 'styles') {
    const catRegistry = rendererRegistry[category];
    const targetKey = ctx.rendererKey.toLowerCase();
    
    // Look up in authoritative registry
    let rendererFn = catRegistry ? (catRegistry[targetKey] || catRegistry[archetype.toLowerCase()]) : undefined;
    
    // Look for strict hyphenated token match or exact alias (Never silently render unrelated objects)
    if (!rendererFn && catRegistry) {
      const tokens = targetKey.split(/[-_ ]+/).filter(t => t.length >= 3);
      for (const t of tokens) {
        if (catRegistry[t]) {
          rendererFn = catRegistry[t];
          break;
        }
      }
    }

    if (rendererFn) {
      innerSvg = rendererFn(ctx);
    } else {
      // Requirement 8: Never silently show generic output. Show "Prototype Renderer Pending"
      innerSvg = renderPendingRenderer(ctx);
    }
  }

  // =========================================================================
  // 3. POSES: Kinetic Rigging & Keyframe Anatomy
  // =========================================================================
  else if (category === 'poses') {
    archetypeLabel = poseMotion ? poseMotion.toUpperCase() : 'MOTION RIG';
    const isCombat = /slash|kick|combat|sword|jump/i.test(`${title} ${poseMotion}`);
    
    innerSvg = `
      <g transform="translate(240, 135)">
        <!-- Dynamic Action Lines -->
        <path d="M -160 50 Q -60 -40 140 -80" stroke="${p2}" stroke-width="2.5" fill="none" opacity="0.7" stroke-dasharray="12 6" />
        <path d="M -140 80 Q -40 -10 160 -50" stroke="${p1}" stroke-width="1.5" fill="none" opacity="0.5" />
        
        <!-- Center Character Kinetic Silhouette -->
        <circle cx="0" cy="-45" r="16" fill="#0f172a" stroke="${p1}" stroke-width="2" />
        <line x1="0" y1="-29" x2="${isCombat ? 20 : 0}" y2="25" stroke="${p1}" stroke-width="4.5" stroke-linecap="round" />
        <!-- Limbs -->
        <line x1="0" y1="-15" x2="${isCombat ? 55 : 35}" y2="${isCombat ? -35 : 10}" stroke="${p2}" stroke-width="3.5" stroke-linecap="round" />
        <line x1="0" y1="-15" x2="-35" y2="15" stroke="${p2}" stroke-width="3.5" stroke-linecap="round" />
        <!-- Legs -->
        <line x1="${isCombat ? 20 : 0}" y1="25" x2="${isCombat ? 60 : 25}" y2="75" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
        <line x1="${isCombat ? 20 : 0}" y1="25" x2="-40" y2="65" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
        
        <!-- Energy Arc -->
        <circle cx="${isCombat ? 55 : 35}" cy="${isCombat ? -35 : 10}" r="8" fill="${p2}" opacity="0.8" />
      </g>
    `;
  }

  // =========================================================================
  // 4. EXPRESSIONS: Facial Visemes & Lip-Sync Phonemes
  // =========================================================================
  else if (category === 'expressions') {
    archetypeLabel = phoneme ? `VISEME / ${phoneme}` : 'EXPRESSION';
    const isShocked = /shock|surprise|gasp|wide/i.test(`${title} ${expressionEmotion}`);
    const isAngry = /angry|rage|fury|fierce/i.test(`${title} ${expressionEmotion}`);

    innerSvg = `
      <g transform="translate(240, 135)">
        <!-- Face Oval Contour -->
        <ellipse cx="0" cy="0" rx="60" ry="75" fill="#1b1d28" stroke="${p1}" stroke-width="2" />
        
        <!-- Eyebrows -->
        <line x1="-35" y1="${isAngry ? -30 : -45}" x2="-10" y2="${isAngry ? -40 : -42}" stroke="${p2}" stroke-width="3" stroke-linecap="round" />
        <line x1="10" y1="${isAngry ? -40 : -42}" x2="35" y2="${isAngry ? -30 : -45}" stroke="${p2}" stroke-width="3" stroke-linecap="round" />
        
        <!-- Eyes -->
        <ellipse cx="-22" cy="-25" rx="${isShocked ? 8 : 6}" ry="${isShocked ? 12 : 7}" fill="#ffffff" />
        <ellipse cx="22" cy="-25" rx="${isShocked ? 8 : 6}" ry="${isShocked ? 12 : 7}" fill="#ffffff" />
        <circle cx="-22" cy="-25" r="3.5" fill="${p1}" />
        <circle cx="22" cy="-25" r="3.5" fill="${p1}" />
        
        <!-- Phoneme Viseme Mouth -->
        ${phoneme === 'AA' ? `
          <ellipse cx="0" cy="22" rx="14" ry="18" fill="#e11d48" stroke="${p2}" stroke-width="2" />
          <path d="M -10 14 Q 0 18 10 14" stroke="#ffffff" stroke-width="3" fill="none" />
        ` : phoneme === 'OO' ? `
          <circle cx="0" cy="22" r="10" fill="#e11d48" stroke="${p2}" stroke-width="2" />
        ` : phoneme === 'EE' ? `
          <rect x="-18" y="18" width="36" height="8" rx="3" fill="#e11d48" stroke="${p2}" stroke-width="2" />
          <line x1="-16" y1="22" x2="16" y2="22" stroke="#ffffff" stroke-width="2" />
        ` : `
          <path d="M -16 20 Q 0 32 16 20" stroke="${p2}" stroke-width="3" fill="none" stroke-linecap="round" />
        `}
      </g>
    `;
  }

  // =========================================================================
  // 5. AUDIO: Waveform & Spectrum Visualizer (Requirement 17)
  // =========================================================================
  else if (category === 'audio') {
    archetypeLabel = 'PROTOTYPE AUDIO ASSET';
    const pts = waveform && waveform.length > 0 ? waveform : [0.3, 0.6, 0.9, 0.7, 0.4, 0.8, 0.95, 0.5, 0.3, 0.7, 0.85, 0.4];
    const barWidth = 360 / pts.length;

    const bars = pts.map((pt, idx) => {
      const h = Math.max(14, pt * 140);
      const x = 60 + idx * barWidth;
      const y = 135 - h / 2;
      return `<rect x="${x}" y="${y}" width="${barWidth - 4}" height="${h}" rx="3" fill="${idx % 2 === 0 ? p1 : p2}" opacity="0.9" />`;
    }).join('');

    innerSvg = `
      <line x1="50" y1="65" x2="430" y2="65" stroke="${p1}" stroke-width="0.5" opacity="0.3" />
      <line x1="50" y1="135" x2="430" y2="135" stroke="${p2}" stroke-width="1" opacity="0.4" />
      <line x1="50" y1="205" x2="430" y2="205" stroke="${p1}" stroke-width="0.5" opacity="0.3" />
      ${bars}
      <!-- Audio Player Center Icon -->
      <circle cx="240" cy="135" r="28" fill="#0d0e16" stroke="${p1}" stroke-width="2.5" />
      <polygon points="234,124 234,146 252,135" fill="${p2}" />
      <!-- Watermark text -->
      <text x="240" y="215" fill="#94a3b8" font-size="10" font-family="monospace" text-anchor="middle">
        PROTOTYPE AUDIO PREVIEW
      </text>
    `;
  }

  // =========================================================================
  // MASTER SVG FRAMEWORK (Standardized High-Resolution Vector Display)
  // =========================================================================
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%">
      <defs>
        <linearGradient id="cghBgGrad_${s}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${sc.bg1}" />
          <stop offset="60%" stop-color="${sc.bg2}" />
          <stop offset="100%" stop-color="#06070a" />
        </linearGradient>
        <pattern id="cghGrid_${s}" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="${p2}" stroke-width="0.5" opacity="0.06" />
        </pattern>
      </defs>

      <!-- Background with subtle texture grid -->
      <rect width="480" height="270" fill="url(#cghBgGrad_${s})" />
      <rect width="480" height="270" fill="url(#cghGrid_${s})" />

      <!-- Inner Procedural Silhouette Layer -->
      ${innerSvg}

      <!-- Safe Area Frame -->
      <rect x="14" y="14" width="452" height="242" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.12" />

      <!-- Top Overlay Badges: CGH Engine Identification -->
      <rect x="18" y="18" width="130" height="22" rx="4" fill="#090a10" opacity="0.88" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.15" />
      <text x="26" y="33" fill="${p2}" font-size="10" font-family="monospace" font-weight="bold">
        CGH ASSET #${s}
      </text>

      <rect x="302" y="18" width="160" height="22" rx="4" fill="#090a10" opacity="0.88" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.15" />
      <text x="382" y="33" fill="${p1}" font-size="10" font-family="monospace" font-weight="semibold" text-anchor="middle">
        ${archetypeLabel.slice(0, 20)}
      </text>

      <!-- Bottom Card Title & Metadata Bar -->
      <rect x="0" y="234" width="480" height="36" fill="#08090f" opacity="0.94" />
      <line x1="0" y1="234" x2="480" y2="234" stroke="${p1}" stroke-width="1" opacity="0.4" />
      <text x="18" y="256" fill="#f8fafc" font-size="11" font-family="system-ui, -apple-system, sans-serif" font-weight="600">
        ${title.length > 42 ? title.slice(0, 42) + '...' : title}
      </text>
      <text x="462" y="256" fill="${p2}" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">
        ${category.toUpperCase()}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
