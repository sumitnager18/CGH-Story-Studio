/**
 * SVG-based rich storyboard & character visual asset generator for CGH Story Studio
 */
import { ArtStyle } from '../types';

interface ArtGenParams {
  title: string;
  prompt: string;
  style: ArtStyle;
  seed: number;
  characterNames?: string[];
  cameraPreset?: string;
  palette?: string[];
}

export function generateSceneArtwork(params: ArtGenParams): string {
  const { title, prompt, style, seed, characterNames = [], cameraPreset, palette = [] } = params;

  // Style-specific palettes and moods
  const styleConfigs: Record<ArtStyle, { bg1: string; bg2: string; accent: string; secondary: string; mood: string; glow: string }> = {
    anime: {
      bg1: '#1e1b4b',
      bg2: '#4338ca',
      accent: '#f43f5e',
      secondary: '#38bdf8',
      mood: 'Anime Shonen Sky / Twilight Glow',
      glow: '#fb7185'
    },
    cyberpunk: {
      bg1: '#090a0f',
      bg2: '#18122B',
      accent: '#06b6d4',
      secondary: '#ec4899',
      mood: 'Neo-Tokyo Neon Rain & Holograms',
      glow: '#3b82f6'
    },
    '3D': {
      bg1: '#0f172a',
      bg2: '#1e293b',
      accent: '#eab308',
      secondary: '#10b981',
      mood: 'Subsurface Scattering 3D Cinema',
      glow: '#f59e0b'
    },
    cartoon: {
      bg1: '#3b0764',
      bg2: '#6b21a8',
      accent: '#fbbf24',
      secondary: '#4ade80',
      mood: 'Vibrant Stylized Animation',
      glow: '#f43f5e'
    },
    realistic: {
      bg1: '#18181b',
      bg2: '#27272a',
      accent: '#f97316',
      secondary: '#94a3b8',
      mood: 'Anamorphic 35mm Film Grain',
      glow: '#fdba74'
    },
    comic: {
      bg1: '#1c1917',
      bg2: '#292524',
      accent: '#ef4444',
      secondary: '#facc15',
      mood: 'Halftone Ink & Dynamic Crosshatch',
      glow: '#f87171'
    },
    'oil-painting': {
      bg1: '#261b11',
      bg2: '#452b14',
      accent: '#d97706',
      secondary: '#65a30d',
      mood: 'Textured Classical Impasto',
      glow: '#fcd34d'
    }
  };

  const cfg = styleConfigs[style] || styleConfigs.anime;
  const primaryColor = palette[0] || cfg.accent;
  const secondaryColor = palette[1] || cfg.secondary;

  // Derive geometric layers from seed
  const s = seed % 1000;
  const sunX = 200 + (s % 400);
  const sunY = 120 + ((s * 3) % 160);
  const mountainPoints = `0,420 ${180 + (s % 80)},${260 + (s % 60)} ${400 + (s % 100)},${310 - (s % 50)} ${650 + (s % 120)},${240 + (s % 70)} 960,420 960,540 0,540`;
  const skylineBars = Array.from({ length: 12 }).map((_, i) => {
    const height = 100 + ((s * (i + 3) * 17) % 220);
    const width = 45 + ((s * (i + 7)) % 35);
    const x = i * 75 + 10;
    const y = 500 - height;
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#0b0b12" opacity="0.85" rx="2" />
            <rect x="${x + 6}" y="${y + 15}" width="${Math.max(4, width - 12)}" height="2" fill="${cfg.secondary}" opacity="0.6" />
            <circle cx="${x + width / 2}" cy="${y + 6}" r="1.5" fill="${cfg.accent}" />`;
  }).join('');

  // Character silhouettes
  let charactersSvg = '';
  if (characterNames.length > 0) {
    characterNames.forEach((name, idx) => {
      const cx = 360 + idx * 200;
      charactersSvg += `
        <g transform="translate(${cx}, 310)">
          <!-- Character aura -->
          <circle cx="0" cy="-60" r="45" fill="${primaryColor}" opacity="0.18" filter="blur(12px)" />
          <!-- Head -->
          <circle cx="0" cy="-70" r="18" fill="#1e1e24" stroke="${primaryColor}" stroke-width="2" />
          <!-- Hair/headwear silhouette -->
          <path d="M -16 -76 C -18 -92 18 -92 16 -76 C 14 -70 8 -65 0 -65 C -8 -65 -14 -70 -16 -76 Z" fill="${secondaryColor}" opacity="0.9" />
          <!-- Torso -->
          <path d="M -22 -48 L 22 -48 L 18 20 L -18 20 Z" fill="#18181f" stroke="${primaryColor}" stroke-width="1.5" />
          <!-- Legs -->
          <line x1="-10" y1="20" x2="-12" y2="90" stroke="#121217" stroke-width="10" stroke-linecap="round" />
          <line x1="10" y1="20" x2="12" y2="90" stroke="#121217" stroke-width="10" stroke-linecap="round" />
          <!-- Character Tag badge -->
          <rect x="-45" y="100" width="90" height="20" rx="4" fill="#0f0f14" stroke="${primaryColor}" stroke-width="1" />
          <text x="0" y="114" fill="#e2e8f0" font-size="10" font-family="system-ui, sans-serif" font-weight="600" text-anchor="middle">${name}</text>
        </g>
      `;
    });
  } else {
    // Default lone focal figure
    charactersSvg = `
      <g transform="translate(480, 320)">
        <circle cx="0" cy="-55" r="35" fill="${cfg.glow}" opacity="0.15" />
        <circle cx="0" cy="-65" r="16" fill="#1e1e24" stroke="${cfg.accent}" stroke-width="2" />
        <path d="M -20 -45 L 20 -45 L 16 25 L -16 25 Z" fill="#16161d" stroke="${cfg.secondary}" stroke-width="1.5" />
        <line x1="-8" y1="25" x2="-10" y2="85" stroke="#121217" stroke-width="9" stroke-linecap="round" />
        <line x1="8" y1="25" x2="10" y2="85" stroke="#121217" stroke-width="9" stroke-linecap="round" />
      </g>
    `;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="100%" height="100%">
      <defs>
        <linearGradient id="skyGrad_${seed}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${cfg.bg1}" />
          <stop offset="60%" stop-color="${cfg.bg2}" />
          <stop offset="100%" stop-color="#09090d" />
        </linearGradient>
        <radialGradient id="sunGlow_${seed}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${cfg.glow}" stop-opacity="0.8" />
          <stop offset="50%" stop-color="${cfg.accent}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="${cfg.bg1}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="groundGrad_${seed}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#181822" />
          <stop offset="100%" stop-color="#08080b" />
        </linearGradient>
        <pattern id="grid_${seed}" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${cfg.secondary}" stroke-width="0.75" opacity="0.08" />
        </pattern>
      </defs>

      <!-- Sky Backdrop -->
      <rect width="960" height="540" fill="url(#skyGrad_${seed})" />

      <!-- Celestial Body / Light Key -->
      <circle cx="${sunX}" cy="${sunY}" r="110" fill="url(#sunGlow_${seed})" />
      <circle cx="${sunX}" cy="${sunY}" r="40" fill="#ffffff" opacity="0.85" />

      <!-- Distant Stars / Particles -->
      <circle cx="${(sunX + 300) % 900}" cy="80" r="1.5" fill="#fff" opacity="0.8" />
      <circle cx="${(sunX + 150) % 900}" cy="140" r="1" fill="#fff" opacity="0.5" />
      <circle cx="${(sunX + 500) % 900}" cy="60" r="2" fill="${cfg.secondary}" opacity="0.9" />

      <!-- Midground Skyline or Mountains -->
      <polygon points="${mountainPoints}" fill="#11111a" opacity="0.7" />
      ${style === 'cyberpunk' || style === '3D' ? skylineBars : ''}

      <!-- Ground / Floor Perspective -->
      <rect y="410" width="960" height="130" fill="url(#groundGrad_${seed})" />
      <rect y="410" width="960" height="130" fill="url(#grid_${seed})" />

      <!-- Horizon light streak -->
      <line x1="0" y1="410" x2="960" y2="410" stroke="${cfg.accent}" stroke-width="1.5" opacity="0.5" />

      <!-- Characters Layer -->
      ${charactersSvg}

      <!-- Cinematic Letterbox Grid / Safe Area overlay -->
      <rect x="40" y="30" width="880" height="480" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.12" stroke-dasharray="4 8" />
      
      <!-- Crosshairs -->
      <line x1="475" y1="270" x2="485" y2="270" stroke="#ffffff" stroke-width="1" opacity="0.25" />
      <line x1="480" y1="265" x2="480" y2="275" stroke="#ffffff" stroke-width="1" opacity="0.25" />

      <!-- Storyboard HUD Metadata -->
      <rect x="20" y="16" width="220" height="24" rx="4" fill="#000000" opacity="0.6" />
      <text x="28" y="32" fill="#e2e8f0" font-size="11" font-family="monospace" font-weight="bold">
        SCENE: ${title.toUpperCase()}
      </text>

      <rect x="760" y="16" width="180" height="24" rx="4" fill="#000000" opacity="0.6" />
      <text x="770" y="32" fill="${cfg.accent}" font-size="11" font-family="monospace">
        STYLE: ${style.toUpperCase()} #${seed}
      </text>

      <!-- Bottom prompt summary bar -->
      <rect x="0" y="505" width="960" height="35" fill="#0c0c10" opacity="0.9" />
      <text x="24" y="527" fill="#94a3b8" font-size="11" font-family="system-ui, sans-serif">
        ${prompt.length > 115 ? prompt.slice(0, 115) + '...' : prompt}
      </text>
      ${cameraPreset && cameraPreset !== 'none' ? `
        <text x="940" y="527" fill="${cfg.secondary}" font-size="11" font-family="monospace" text-anchor="end">
          CAM: [${cameraPreset.toUpperCase()}]
        </text>
      ` : ''}
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export function generateCharacterAvatar(name: string, style: ArtStyle, palette: string[] = []): string {
  const c1 = palette[0] || '#6c5ce7';
  const c2 = palette[1] || '#00cec9';
  const initial = name.charAt(0).toUpperCase() || 'C';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
      <defs>
        <linearGradient id="charGrad_${name}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="24" fill="#181820" />
      <circle cx="80" cy="80" r="65" fill="url(#charGrad_${name})" opacity="0.25" />
      <circle cx="80" cy="80" r="55" fill="#121217" stroke="url(#charGrad_${name})" stroke-width="3" />
      
      <!-- Stylized face contour -->
      <circle cx="80" cy="65" r="24" fill="#252530" stroke="${c1}" stroke-width="2" />
      <!-- Eyes -->
      <circle cx="72" cy="64" r="3" fill="${c2}" />
      <circle cx="88" cy="64" r="3" fill="${c2}" />
      <!-- Shoulders -->
      <path d="M 46 122 C 46 98 114 98 114 122 Z" fill="${c1}" opacity="0.8" />
      <text x="80" y="150" font-size="11" font-family="system-ui, sans-serif" font-weight="bold" fill="#e2e8f0" text-anchor="middle">${name.slice(0, 14)}</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}
