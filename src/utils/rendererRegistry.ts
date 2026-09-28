// Authoritative Renderer Registry for CGH Procedural Prototype Assets
// Maps each semantic category and rendererKey directly to a dedicated deterministic procedural SVG routine.
// If any key is missing, returns a clearly branded "Prototype Renderer Pending" visual rather than a generic fallback.

import { ArtStyle, CameraPreset } from '../types';

export interface RenderContext {
  title: string;
  category: string;
  family: string;
  rendererKey: string;
  style: ArtStyle;
  seed: number;
  tags: string[];
  palette: string[];
  lighting: string;
  orientation?: 'front' | '3/4 left' | '3/4 right' | 'profile left' | 'profile right' | 'back';
  pose?: string;
  accessory?: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  sc: { bg1: string; bg2: string; acc1: string; acc2: string; glow: string; tint: string };
  s: number;
  phoneme?: string;
  waveform?: number[];
  cameraPreset?: CameraPreset;
  timeOfDay?: string;
  weather?: string;
}

export type RendererFn = (ctx: RenderContext) => string;

// Fallback when a renderer is missing (Never silently show generic output - Requirement 8)
export function renderPendingRenderer(ctx: RenderContext): string {
  console.warn(`[CGH Asset System] Missing renderer: ${ctx.category}/${ctx.rendererKey}`);
  return `
    <g transform="translate(240, 135)">
      <!-- Technical blueprint pending badge -->
      <rect x="-150" y="-55" width="300" height="110" rx="12" fill="#0c0d14" stroke="#eab308" stroke-width="2" stroke-dasharray="6 4" />
      <circle cx="0" cy="-15" r="22" fill="#1e1b10" stroke="#facc15" stroke-width="2" />
      <text x="0" y="-8" fill="#facc15" font-size="20" font-family="system-ui" font-weight="bold" text-anchor="middle">⚙️</text>
      <text x="0" y="24" fill="#fef08a" font-size="12" font-family="monospace" font-weight="bold" text-anchor="middle">
        PROTOTYPE RENDERER PENDING
      </text>
      <text x="0" y="42" fill="#a1a1aa" font-size="10" font-family="monospace" text-anchor="middle">
        Missing renderer: ${ctx.category}/${ctx.rendererKey}
      </text>
    </g>
  `;
}

// -----------------------------------------------------------------------------
// ORIENTATION & POSE HELPER TRANSFORMS (Requirements 10, 11, 12)
// -----------------------------------------------------------------------------
function getOrientationGroupAttrs(orientation?: string): { transform: string; eyeShift: number; backView: boolean } {
  switch (orientation) {
    case '3/4 left':
      return { transform: 'scale(0.95, 1) skewY(-1)', eyeShift: -7, backView: false };
    case '3/4 right':
      return { transform: 'scale(-0.95, 1) skewY(-1)', eyeShift: 7, backView: false };
    case 'profile left':
      return { transform: 'scale(0.85, 1) translate(-20, 0)', eyeShift: -15, backView: false };
    case 'profile right':
      return { transform: 'scale(-0.85, 1) translate(20, 0)', eyeShift: 15, backView: false };
    case 'back':
      return { transform: 'scale(1, 1)', eyeShift: 0, backView: true };
    default:
      return { transform: 'scale(1, 1)', eyeShift: 0, backView: false };
  }
}

function getPosePostureMarkup(pose?: string, p1?: string, p2?: string): string {
  switch (pose) {
    case 'running':
      return `
        <!-- Dynamic Running Limbs -->
        <line x1="-20" y1="90" x2="-55" y2="135" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="-55" y1="135" x2="-80" y2="120" stroke="${p2}" stroke-width="4" stroke-linecap="round" />
        <line x1="20" y1="90" x2="60" y2="125" stroke="${p1}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="60" y1="125" x2="85" y2="155" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      `;
    case 'jumping':
      return `
        <!-- High Jump Action Legs -->
        <line x1="-20" y1="90" x2="-45" y2="115" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="-45" y1="115" x2="-25" y2="135" stroke="${p2}" stroke-width="4" stroke-linecap="round" />
        <line x1="20" y1="90" x2="45" y2="115" stroke="${p1}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="45" y1="115" x2="25" y2="135" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      `;
    case 'sitting':
      return `
        <!-- Sitting Folded Posture -->
        <rect x="-40" y="80" width="80" height="12" rx="4" fill="#334155" />
        <line x1="-25" y1="92" x2="-25" y2="140" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
        <line x1="25" y1="92" x2="25" y2="140" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      `;
    case 'crouching':
      return `
        <!-- Low Crouch Stance -->
        <line x1="-30" y1="75" x2="-65" y2="105" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
        <line x1="30" y1="75" x2="65" y2="105" stroke="${p1}" stroke-width="4.5" stroke-linecap="round" />
      `;
    case 'pointing':
      return `
        <!-- Outstretched Pointing Arm -->
        <line x1="35" y1="30" x2="95" y2="5" stroke="${p2}" stroke-width="4" stroke-linecap="round" />
        <circle cx="98" cy="4" r="3.5" fill="${p1}" />
      `;
    case 'waving':
      return `
        <!-- Raised Waving Hand -->
        <line x1="35" y1="25" x2="65" y2="-25" stroke="${p2}" stroke-width="4" stroke-linecap="round" />
        <circle cx="68" cy="-28" r="6" fill="${p1}" />
      `;
    case 'thinking':
      return `
        <!-- Contemplative Hand on Chin -->
        <path d="M 30 50 L 22 5 L 8 -15" fill="none" stroke="${p2}" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="8" cy="-15" r="4" fill="${p1}" />
      `;
    default:
      return '';
  }
}

// -----------------------------------------------------------------------------
// 1. CHARACTER RENDERERS (42 Dedicated Archetype Renderers)
// -----------------------------------------------------------------------------
function renderTeacher(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Presentation pointer rod -->
      <line x1="45" y1="40" x2="95" y2="-45" stroke="${p2}" stroke-width="3" stroke-linecap="round" />
      <circle cx="95" cy="-45" r="4" fill="${p1}" />
      <!-- Tweed Blazer & Tie -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#181824" stroke="${p1}" stroke-width="2.5" />
      ${!backView ? `
        <polygon points="0,20 -12,45 0,75 12,45" fill="${p2}" />
        <polygon points="0,20 -6,30 0,35 6,30" fill="${p1}" />
      ` : `<path d="M -25 25 L 0 45 L 25 25" stroke="#334155" stroke-width="2" fill="none" />`}
      <!-- Head & Stylized Hair Bun -->
      <circle cx="0" cy="-42" r="28" fill="#201f2e" stroke="${p1}" stroke-width="2" />
      <ellipse cx="0" cy="-72" rx="14" ry="10" fill="${p1}" />
      ${!backView ? `
        <!-- Chic Spectacles -->
        <rect x="${-22 + eyeShift}" y="-48" width="18" height="12" rx="2" fill="none" stroke="${p2}" stroke-width="2" />
        <rect x="${4 + eyeShift}" y="-48" width="18" height="12" rx="2" fill="none" stroke="${p2}" stroke-width="2" />
        <line x1="${-4 + eyeShift}" y1="-42" x2="${4 + eyeShift}" y2="-42" stroke="${p2}" stroke-width="2" />
        <path d="M ${-6 + eyeShift} -26 Q 0 -22 ${6 + eyeShift} -26" stroke="${p2}" stroke-width="2" fill="none" stroke-linecap="round" />
      ` : `<path d="M -15 -60 Q 0 -50 15 -60" stroke="${p2}" stroke-width="2" fill="none" />`}
      ${poseMarkup}
    </g>
  `;
}

function renderStudent(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Schoolbag Strap -->
      <line x1="-30" y1="20" x2="-10" y2="85" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
      <!-- Uniform Blazer -->
      <path d="M -40 20 L -25 90 L 25 90 L 40 20 Z" fill="#1e1e2d" stroke="${p1}" stroke-width="2" />
      ${!backView ? `
        <polygon points="0,20 -10,40 0,65 10,40" fill="${p2}" />
        <!-- Head & Modern Bangs -->
        <circle cx="0" cy="-38" r="26" fill="#1b1c2b" stroke="${p1}" stroke-width="2" />
        <path d="M -26 -46 Q 0 -68 26 -46 L 22 -30 Q 0 -45 -22 -30 Z" fill="${p1}" />
        <ellipse cx="${-10 + eyeShift}" cy="-36" rx="4" ry="6" fill="${p2}" />
        <ellipse cx="${10 + eyeShift}" cy="-36" rx="4" ry="6" fill="${p2}" />
        <path d="M ${-6 + eyeShift} -22 Q 0 -18 ${6 + eyeShift} -22" stroke="${p2}" stroke-width="2" fill="none" stroke-linecap="round" />
      ` : `
        <circle cx="0" cy="-38" r="26" fill="#1b1c2b" stroke="${p1}" stroke-width="2" />
        <path d="M -26 -55 Q 0 -70 26 -55 Q 26 -20 0 -20 Q -26 -20 -26 -55 Z" fill="${p1}" />
      `}
      ${poseMarkup}
    </g>
  `;
}

function renderScientist(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Conical chemistry flask in hand -->
      <polygon points="45,45 65,85 25,85" fill="${p2}" opacity="0.8" stroke="${p1}" stroke-width="1.5" />
      <rect x="42" y="35" width="6" height="10" fill="#334155" />
      <!-- Lab Coat -->
      <path d="M -48 20 L -35 95 L 35 95 L 48 20 Z" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <line x1="0" y1="20" x2="0" y2="95" stroke="#94a3b8" stroke-width="2" />
      <!-- Head with Safety Goggles -->
      <circle cx="0" cy="-40" r="27" fill="#1e293b" stroke="${p1}" stroke-width="2" />
      ${!backView ? `
        <rect x="${-24 + eyeShift}" y="-48" width="48" height="16" rx="4" fill="${p2}" opacity="0.6" stroke="${p1}" stroke-width="2" />
        <circle cx="${-10 + eyeShift}" cy="-40" r="4" fill="#ffffff" />
        <circle cx="${10 + eyeShift}" cy="-40" r="4" fill="#ffffff" />
      ` : `<path d="M -25 -42 L 25 -42" stroke="${p1}" stroke-width="4" />`}
      ${poseMarkup}
    </g>
  `;
}

function renderDoctor(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Medical Scrubs & Stethoscope -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#0f766e" stroke="${p1}" stroke-width="2" />
      <path d="M -22 20 Q -35 60 0 65 Q 35 60 22 20" fill="none" stroke="${p2}" stroke-width="3" stroke-linecap="round" />
      <circle cx="0" cy="68" r="6" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5" />
      <!-- Head & Surgical Cap -->
      <circle cx="0" cy="-40" r="27" fill="#134e4a" stroke="${p1}" stroke-width="2" />
      <ellipse cx="0" cy="-56" rx="27" ry="12" fill="${p1}" />
      ${!backView ? `
        <circle cx="${-9 + eyeShift}" cy="-36" r="3.5" fill="#f8fafc" />
        <circle cx="${9 + eyeShift}" cy="-36" r="3.5" fill="#f8fafc" />
        <rect x="${-16 + eyeShift}" y="-26" width="32" height="12" rx="2" fill="#e2e8f0" stroke="#0d9488" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderPolice(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Uniform Shirt with Epaulets & Golden Badge -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#1e3a8a" stroke="${p1}" stroke-width="2" />
      <polygon points="-18,40 -12,32 -6,40 -12,48" fill="#facc15" stroke="#ca8a04" stroke-width="1" />
      <!-- Peaked Officer Cap -->
      <circle cx="0" cy="-38" r="26" fill="#172554" stroke="${p1}" stroke-width="2" />
      <polygon points="-30,-48 30,-48 20,-68 -20,-68" fill="#1e3a8a" stroke="${p2}" stroke-width="2" />
      <polygon points="0,-58 -6,-52 0,-46 6,-52" fill="#facc15" />
      <path d="M -26 -48 Q 0 -42 26 -48" stroke="#020617" stroke-width="6" fill="none" stroke-linecap="round" />
      ${!backView ? `
        <ellipse cx="${-9 + eyeShift}" cy="-35" rx="3.5" ry="4.5" fill="#ffffff" />
        <ellipse cx="${9 + eyeShift}" cy="-35" rx="3.5" ry="4.5" fill="#ffffff" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderDetective(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Trenchcoat High Lapels -->
      <path d="M -50 20 L -35 95 L 35 95 L 50 20 Z" fill="#292524" stroke="${p1}" stroke-width="2" />
      <polygon points="-30,20 -15,50 0,20" fill="${p2}" />
      <polygon points="30,20 15,50 0,20" fill="${p2}" />
      <!-- Fedora Hat with tilted brim -->
      <circle cx="0" cy="-40" r="26" fill="#1c1917" stroke="${p1}" stroke-width="2" />
      <path d="M -38 -45 Q 0 -40 38 -50" stroke="${p1}" stroke-width="5" fill="none" stroke-linecap="round" />
      <polygon points="-24,-45 24,-48 18,-68 -18,-66" fill="#292524" stroke="${p2}" stroke-width="1.5" />
      ${!backView ? `
        <!-- Shadowed Eyes -->
        <circle cx="${-9 + eyeShift}" cy="-36" r="3" fill="${p2}" />
        <circle cx="${9 + eyeShift}" cy="-36" r="3" fill="${p2}" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderChef(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Chef Double Breasted Jacket -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <circle cx="-10" cy="40" r="2.5" fill="#0f172a" />
      <circle cx="10" cy="40" r="2.5" fill="#0f172a" />
      <circle cx="-10" cy="60" r="2.5" fill="#0f172a" />
      <circle cx="10" cy="60" r="2.5" fill="#0f172a" />
      <!-- Tall Toque Blanche Hat -->
      <circle cx="0" cy="-38" r="26" fill="#334155" stroke="${p1}" stroke-width="2" />
      <path d="M -22 -48 C -35 -80 35 -80 22 -48 Z" fill="#ffffff" stroke="${p2}" stroke-width="2" />
      ${!backView ? `
        <ellipse cx="${-8 + eyeShift}" cy="-35" rx="3.5" ry="4" fill="${p1}" />
        <ellipse cx="${8 + eyeShift}" cy="-35" rx="3.5" ry="4" fill="${p1}" />
        <!-- Cheerful French Chef Mustache -->
        <path d="M -12 -22 Q -4 -18 0 -22 Q 4 -18 12 -22" stroke="${p1}" stroke-width="3" fill="none" stroke-linecap="round" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderBuilder(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Reflective Safety Vest -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#ea580c" stroke="${p1}" stroke-width="2" />
      <line x1="-15" y1="20" x2="-15" y2="90" stroke="#facc15" stroke-width="6" />
      <line x1="15" y1="20" x2="15" y2="90" stroke="#facc15" stroke-width="6" />
      <!-- Hardhat Helmet -->
      <circle cx="0" cy="-38" r="26" fill="#292524" stroke="${p1}" stroke-width="2" />
      <ellipse cx="0" cy="-48" rx="32" ry="12" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
      <path d="M -20 -48 Q 0 -72 20 -48" fill="#facc15" />
      ${!backView ? `
        <circle cx="${-9 + eyeShift}" cy="-34" r="3.5" fill="#f8fafc" />
        <circle cx="${9 + eyeShift}" cy="-34" r="3.5" fill="#f8fafc" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderChild(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 145) scale(0.85) ${transform}">
      <circle cx="0" cy="-55" r="35" fill="#232032" stroke="${p1}" stroke-width="2.5" />
      <!-- Cap turned backward -->
      <path d="M -34 -65 Q 0 -85 34 -65" stroke="${p2}" stroke-width="5" fill="none" stroke-linecap="round" />
      ${!backView ? `
        <circle cx="${-12 + eyeShift}" cy="-52" r="6" fill="#09090e" />
        <circle cx="${12 + eyeShift}" cy="-52" r="6" fill="#09090e" />
        <circle cx="${-11 + eyeShift}" cy="-54" r="2.5" fill="${p1}" />
        <circle cx="${13 + eyeShift}" cy="-54" r="2.5" fill="${p1}" />
        <path d="M ${-8 + eyeShift} -38 Q 0 -32 ${8 + eyeShift} -38" stroke="${p2}" stroke-width="2.5" stroke-linecap="round" fill="none" />
      ` : ''}
      <path d="M -25 -15 L -20 60 L 20 60 L 25 -15 Z" fill="#1b1c2b" stroke="${p1}" stroke-width="2" />
      <line x1="-16" y1="-15" x2="-14" y2="55" stroke="${p2}" stroke-width="3.5" />
      <line x1="16" y1="-15" x2="14" y2="55" stroke="${p2}" stroke-width="3.5" />
      ${poseMarkup}
    </g>
  `;
}

function renderSenior(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Warm Cardigan Shawl -->
      <path d="M -50 25 C -40 5 -20 5 -15 20 L 15 20 C 20 5 40 5 50 25 L 40 85 L -40 85 Z" fill="#181926" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="-40" r="28" fill="#21202e" stroke="${p1}" stroke-width="2" />
      <!-- Silver Hair -->
      <path d="M -30 -45 C -32 -70 32 -70 30 -45 C 26 -32 20 -35 15 -48 C 0 -44 -15 -48 -22 -35 Z" fill="#cbd5e1" />
      ${!backView ? `
        <circle cx="${-12 + eyeShift}" cy="-40" r="7" fill="none" stroke="${p2}" stroke-width="2" />
        <circle cx="${12 + eyeShift}" cy="-40" r="7" fill="none" stroke="${p2}" stroke-width="2" />
        <line x1="${-5 + eyeShift}" y1="-40" x2="${5 + eyeShift}" y2="-40" stroke="${p2}" stroke-width="2" />
        <path d="M ${-6 + eyeShift} -24 Q 0 -20 ${6 + eyeShift} -24" stroke="${p2}" stroke-width="2" stroke-linecap="round" fill="none" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderIndianTraditional(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Elegant Saree Pallu / Kurta drape -->
      <path d="M -45 20 L -30 95 L 30 95 L 45 20 Z" fill="#831843" stroke="${p1}" stroke-width="2" />
      <path d="M -35 20 Q 0 50 35 90" fill="none" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" />
      <!-- Head with Bindi and Hair Ornament -->
      <circle cx="0" cy="-40" r="26" fill="#1e1b4b" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="-70" r="12" fill="#18181b" stroke="${p2}" stroke-width="1.5" />
      ${!backView ? `
        <!-- Bindi -->
        <circle cx="${0 + eyeShift}" cy="-44" r="3" fill="#ef4444" />
        <ellipse cx="${-9 + eyeShift}" cy="-36" rx="4" ry="5" fill="#facc15" />
        <ellipse cx="${9 + eyeShift}" cy="-36" rx="4" ry="5" fill="#facc15" />
        <!-- Jhumka Earrings -->
        <polygon points="-28,-35 -24,-24 -32,-24" fill="#fbbf24" />
        <polygon points="28,-35 24,-24 32,-24" fill="#fbbf24" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderCyberpunkHero(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- High Collar Trenchcoat with Cyber LED Trim -->
      <path d="M -50 15 L -35 95 L 35 95 L 50 15 Z" fill="#05060b" stroke="${p1}" stroke-width="2.5" />
      <line x1="-35" y1="20" x2="-25" y2="90" stroke="${p2}" stroke-width="2.5" />
      <line x1="35" y1="20" x2="25" y2="90" stroke="${p2}" stroke-width="2.5" />
      <!-- Head & Glowing Neon Visor -->
      <circle cx="0" cy="-40" r="27" fill="#090d16" stroke="${p1}" stroke-width="2" />
      ${!backView ? `
        <polygon points="${-25 + eyeShift},-45 ${25 + eyeShift},-45 ${20 + eyeShift},-33 ${-20 + eyeShift},-33" fill="${p2}" opacity="0.9" stroke="${p1}" stroke-width="1.5" />
        <line x1="${-18 + eyeShift}" y1="-39" x2="${18 + eyeShift}" y2="-39" stroke="#ffffff" stroke-width="2" />
      ` : `<path d="M -20 -40 L 20 -40" stroke="${p2}" stroke-width="3" />`}
      ${poseMarkup}
    </g>
  `;
}

function renderSpaceCrew(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Pressurized EVA Suit -->
      <path d="M -55 20 L -40 95 L 40 95 L 55 20 Z" fill="#f1f5f9" stroke="${p1}" stroke-width="2.5" />
      <circle cx="-15" cy="45" r="5" fill="#3b82f6" />
      <circle cx="15" cy="45" r="5" fill="#ef4444" />
      <!-- Bubble Visor Helmet -->
      <circle cx="0" cy="-40" r="35" fill="#0f172a" stroke="${p1}" stroke-width="3" />
      ${!backView ? `
        <ellipse cx="${0 + eyeShift}" cy="-40" rx="26" ry="20" fill="${p2}" opacity="0.85" />
        <ellipse cx="${-8 + eyeShift}" cy="-46" rx="10" ry="4" fill="#ffffff" opacity="0.7" transform="rotate(-15, ${-8 + eyeShift}, -46)" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderRobot(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Chassis Torso -->
      <rect x="-42" y="15" width="84" height="75" rx="10" fill="#1e293b" stroke="${p1}" stroke-width="2.5" />
      <circle cx="0" cy="50" r="16" fill="#020617" stroke="${p2}" stroke-width="2" />
      <!-- Square Robotic Head -->
      <rect x="-30" y="-68" width="60" height="50" rx="8" fill="#0f172a" stroke="${p1}" stroke-width="2.5" />
      <line x1="0" y1="-68" x2="0" y2="-88" stroke="${p2}" stroke-width="3" />
      <circle cx="0" cy="-88" r="5" fill="${p1}" />
      ${!backView ? `
        <rect x="${-20 + eyeShift}" y="-52" width="16" height="10" rx="2" fill="${p2}" />
        <rect x="${4 + eyeShift}" y="-52" width="16" height="10" rx="2" fill="${p2}" />
        <line x1="${-16 + eyeShift}" y1="-28" x2="${16 + eyeShift}" y2="-28" stroke="${p1}" stroke-width="3" stroke-linecap="round" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

function renderGenericCharacter(ctx: RenderContext): string {
  const { p1, p2, orientation, pose } = ctx;
  const { transform, eyeShift, backView } = getOrientationGroupAttrs(orientation);
  const poseMarkup = getPosePostureMarkup(pose, p1, p2);

  return `
    <g transform="translate(240, 140) ${transform}">
      <!-- Silhouette Body -->
      <path d="M -45 20 L -30 90 L 30 90 L 45 20 Z" fill="#181824" stroke="${p1}" stroke-width="2" />
      <!-- Head -->
      <circle cx="0" cy="-40" r="27" fill="#201f2e" stroke="${p1}" stroke-width="2" />
      ${!backView ? `
        <circle cx="${-9 + eyeShift}" cy="-36" r="3.5" fill="${p2}" />
        <circle cx="${9 + eyeShift}" cy="-36" r="3.5" fill="${p2}" />
        <path d="M ${-6 + eyeShift} -24 Q 0 -20 ${6 + eyeShift} -24" stroke="${p2}" stroke-width="2" fill="none" stroke-linecap="round" />
      ` : ''}
      ${poseMarkup}
    </g>
  `;
}

// -----------------------------------------------------------------------------
// 2. BACKGROUND RENDERERS (66 Supported Archetypes with Multi-Layer Depth)
// -----------------------------------------------------------------------------
function renderClassroom(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <!-- Background wall & chalkboard -->
    <rect x="0" y="0" width="480" height="270" fill="#0f172a" />
    <rect x="90" y="30" width="300" height="130" rx="4" fill="#064e3b" stroke="#ca8a04" stroke-width="4" />
    <line x1="110" y1="60" x2="220" y2="60" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round" />
    <line x1="110" y1="80" x2="270" y2="80" stroke="#a7f3d0" stroke-width="2" stroke-linecap="round" />
    <!-- Midground: Teacher podium & windows -->
    <polygon points="0,0 60,0 60,270 0,270" fill="#1e293b" opacity="0.6" />
    <line x1="60" y1="0" x2="60" y2="270" stroke="${p2}" stroke-width="2" />
    <!-- Foreground student desk -->
    <polygon points="40,210 440,210 480,270 0,270" fill="#1e1b4b" stroke="${p1}" stroke-width="2" />
    <line x1="140" y1="210" x2="140" y2="270" stroke="${p2}" stroke-width="2" />
    <line x1="340" y1="210" x2="340" y2="270" stroke="${p2}" stroke-width="2" />
  `;
}

function renderHospital(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <!-- Hospital Hallway Perspective -->
    <rect x="0" y="0" width="480" height="270" fill="#0f172a" />
    <polygon points="0,0 480,0 360,70 120,70" fill="#1e293b" />
    <!-- Recessed ceiling fluorescent troffers -->
    <line x1="160" y1="40" x2="320" y2="40" stroke="#38bdf8" stroke-width="4" filter="blur(1px)" />
    <!-- Vanishing point doors -->
    <polygon points="120,70 360,70 360,180 120,180" fill="#0b1329" stroke="${p1}" stroke-width="1.5" />
    <line x1="240" y1="70" x2="240" y2="180" stroke="#38bdf8" stroke-width="2" />
    <!-- Red Cross emblem -->
    <circle cx="240" cy="115" r="14" fill="#ffffff" />
    <polygon points="237,105 243,105 243,125 237,125" fill="#ef4444" />
    <polygon points="230,112 250,112 250,118 230,118" fill="#ef4444" />
    <!-- Floor tiles with reflections -->
    <polygon points="0,270 120,180 360,180 480,270" fill="#0284c7" opacity="0.3" />
    <line x1="240" y1="180" x2="240" y2="270" stroke="${p2}" stroke-width="1.5" />
  `;
}

function renderScienceLab(ctx: RenderContext): string {
  const { p1, p2, p3 } = ctx;
  return `
    <!-- Science Research Laboratory -->
    <rect x="0" y="0" width="480" height="270" fill="#080e1a" />
    <!-- Rear Chemical Storage Shelves & Fume Hood -->
    <rect x="40" y="20" width="400" height="90" fill="#0f172a" stroke="#1e293b" stroke-width="2" rx="4" />
    <line x1="40" y1="65" x2="440" y2="65" stroke="#334155" stroke-width="2" />
    <!-- Reagent bottles on shelf -->
    <rect x="60" y="35" width="16" height="26" rx="2" fill="#0284c7" opacity="0.8" />
    <rect x="82" y="40" width="14" height="21" rx="2" fill="#eab308" opacity="0.8" />
    <rect x="102" y="32" width="18" height="29" rx="2" fill="#10b981" opacity="0.8" />
    <rect x="340" y="35" width="20" height="26" rx="2" fill="#8b5cf6" opacity="0.8" />
    <rect x="366" y="38" width="16" height="23" rx="2" fill="#ef4444" opacity="0.8" />
    <!-- Lab Workstation Countertop -->
    <polygon points="10,150 470,150 480,270 0,270" fill="#0b1329" stroke="${p1}" stroke-width="2" />
    <line x1="0" y1="170" x2="480" y2="170" stroke="#1e293b" stroke-width="3" />
    <!-- Erlenmeyer Glass Flask with glowing reaction liquid -->
    <polygon points="190,230 230,230 216,170 204,170" fill="#06b6d4" opacity="0.3" stroke="#e0f2fe" stroke-width="2" />
    <polygon points="194,228 226,228 214,195 206,195" fill="${p2}" opacity="0.85" />
    <circle cx="210" cy="210" r="3" fill="#ffffff" opacity="0.9" />
    <circle cx="215" cy="202" r="2" fill="#ffffff" opacity="0.9" />
    <rect x="202" y="165" width="16" height="6" rx="1" fill="#94a3b8" />
    <!-- Test Tube Rack with 5 tubes -->
    <rect x="260" y="185" width="90" height="42" fill="#1e293b" stroke="#475569" stroke-width="1.5" rx="3" />
    <rect x="268" y="168" width="8" height="35" rx="4" fill="#f43f5e" opacity="0.85" stroke="#fda4af" stroke-width="1" />
    <rect x="282" y="168" width="8" height="35" rx="4" fill="#38bdf8" opacity="0.85" stroke="#bae6fd" stroke-width="1" />
    <rect x="296" y="168" width="8" height="35" rx="4" fill="#a855f7" opacity="0.85" stroke="#e9d5ff" stroke-width="1" />
    <rect x="310" y="168" width="8" height="35" rx="4" fill="#22c55e" opacity="0.85" stroke="#bbf7d0" stroke-width="1" />
    <rect x="324" y="168" width="8" height="35" rx="4" fill="#fbbf24" opacity="0.85" stroke="#fef08a" stroke-width="1" />
    <!-- Bunsen Burner with Blue Flame -->
    <rect x="130" y="215" width="30" height="15" fill="#334155" rx="2" />
    <rect x="142" y="185" width="6" height="30" fill="#64748b" />
    <ellipse cx="145" cy="175" rx="5" ry="12" fill="#38bdf8" />
    <ellipse cx="145" cy="177" rx="2.5" ry="7" fill="#ffffff" />
    <!-- Digital Sensor Monitor -->
    <rect x="380" y="170" width="70" height="45" rx="3" fill="#020617" stroke="#38bdf8" stroke-width="1.5" />
    <polyline points="388,195 400,185 410,200 422,178 432,192 442,188" fill="none" stroke="#22c55e" stroke-width="2" />
  `;
}

function renderSchoolCorridor(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <!-- School Hallway Corridor Perspective -->
    <rect x="0" y="0" width="480" height="270" fill="#0f172a" />
    <!-- Perspective Floor -->
    <polygon points="0,270 160,150 320,150 480,270" fill="#1e293b" />
    <line x1="200" y1="150" x2="100" y2="270" stroke="#334155" stroke-width="2" />
    <line x1="240" y1="150" x2="240" y2="270" stroke="#475569" stroke-width="2" stroke-dasharray="12 8" />
    <line x1="280" y1="150" x2="380" y2="270" stroke="#334155" stroke-width="2" />
    <!-- Perspective Ceiling -->
    <polygon points="0,0 480,0 320,60 160,60" fill="#0b0f19" />
    <line x1="210" y1="35" x2="270" y2="35" stroke="#f8fafc" stroke-width="4" filter="blur(1px)" />
    <!-- Left Locker Wall -->
    <polygon points="0,0 160,60 160,150 0,270" fill="#1e1b4b" stroke="${p1}" stroke-width="2" />
    <line x1="40" y1="45" x2="40" y2="235" stroke="#4338ca" stroke-width="2" />
    <line x1="80" y1="52" x2="80" y2="205" stroke="#4338ca" stroke-width="2" />
    <line x1="120" y1="58" x2="120" y2="175" stroke="#4338ca" stroke-width="2" />
    <!-- Locker vents & handles -->
    <line x1="15" y1="90" x2="30" y2="85" stroke="#818cf8" stroke-width="1.5" />
    <line x1="55" y1="95" x2="70" y2="90" stroke="#818cf8" stroke-width="1.5" />
    <line x1="95" y1="100" x2="108" y2="96" stroke="#818cf8" stroke-width="1.5" />
    <!-- Right Wall & Classroom Door -->
    <polygon points="480,0 320,60 320,150 480,270" fill="#1e293b" stroke="${p2}" stroke-width="2" />
    <polygon points="440,30 360,75 360,175 440,240" fill="#0f172a" stroke="#ca8a04" stroke-width="2" />
    <rect x="380" y="95" width="22" height="35" fill="#38bdf8" opacity="0.6" stroke="#e0f2fe" stroke-width="1.5" />
    <!-- Corridor End Classroom Window -->
    <rect x="160" y="60" width="160" height="90" fill="#020617" stroke="#475569" stroke-width="2" />
    <rect x="210" y="75" width="60" height="65" fill="#3b82f6" opacity="0.4" stroke="#60a5fa" stroke-width="1.5" />
    <line x1="240" y1="75" x2="240" y2="140" stroke="#93c5fd" stroke-width="1" />
  `;
}

function renderBedroom(ctx: RenderContext): string {
  const { p1, p2, p3 } = ctx;
  return `
    <!-- Cozy Bedroom Interior -->
    <rect x="0" y="0" width="480" height="270" fill="#0c0d18" />
    <!-- Twilight Window overlooking skyline/stars -->
    <rect x="280" y="25" width="150" height="110" rx="3" fill="#090d1f" stroke="#334155" stroke-width="3" />
    <ellipse cx="370" cy="55" rx="14" ry="14" fill="#fef08a" opacity="0.9" />
    <ellipse cx="365" cy="52" rx="12" ry="12" fill="#090d1f" />
    <circle cx="310" cy="45" r="1.5" fill="#ffffff" />
    <circle cx="340" cy="80" r="1.5" fill="#ffffff" />
    <circle cx="410" cy="60" r="2" fill="#ffffff" />
    <line x1="355" y1="25" x2="355" y2="135" stroke="#475569" stroke-width="2" />
    <line x1="280" y1="80" x2="430" y2="80" stroke="#475569" stroke-width="2" />
    <!-- Soft Curtain Drape -->
    <path d="M 265 20 Q 285 75 270 145 L 290 145 Q 300 75 285 20 Z" fill="${p2}" opacity="0.75" />
    <!-- Perspective Wooden Floor -->
    <polygon points="0,270 0,165 480,165 480,270" fill="#18131d" />
    <line x1="0" y1="210" x2="480" y2="210" stroke="#2a1f33" stroke-width="1.5" />
    <line x1="0" y1="245" x2="480" y2="245" stroke="#2a1f33" stroke-width="1.5" />
    <!-- Cozy Bed with Headboard, Pillows & Folded Blanket -->
    <rect x="40" y="130" width="180" height="115" rx="6" fill="#1e1e2d" stroke="${p1}" stroke-width="2.5" />
    <rect x="40" y="115" width="180" height="25" rx="4" fill="#2d2238" stroke="${p1}" stroke-width="2" />
    <!-- Twin Pillows -->
    <rect x="55" y="135" width="60" height="28" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" />
    <rect x="145" y="135" width="60" height="28" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" />
    <!-- Duvet / Blanket -->
    <rect x="42" y="165" width="176" height="78" rx="4" fill="${p1}" opacity="0.85" />
    <line x1="42" y1="185" x2="218" y2="185" stroke="#ffffff" stroke-width="2" opacity="0.4" stroke-dasharray="6 4" />
    <!-- Nightstand & Lamp with Warm Light Cone -->
    <rect x="230" y="160" width="45" height="60" rx="3" fill="#272736" stroke="#475569" stroke-width="1.5" />
    <rect x="245" y="135" width="15" height="25" fill="#e2e8f0" stroke="#64748b" rx="2" />
    <polygon points="235,140 270,140 262,118 243,118" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
    <polygon points="230,140 275,140 310,240 195,240" fill="#fef08a" opacity="0.12" />
  `;
}

function renderRailwayStation(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <rect x="0" y="0" width="480" height="270" fill="#0b0f19" />
    <!-- Arching Steel Truss Girders -->
    <path d="M 0 40 Q 240 -10 480 40" stroke="${p1}" stroke-width="6" fill="none" />
    <line x1="120" y1="20" x2="120" y2="180" stroke="#334155" stroke-width="3" />
    <line x1="360" y1="20" x2="360" y2="180" stroke="#334155" stroke-width="3" />
    <!-- Railway tracks receding into depth -->
    <polygon points="190,160 290,160 380,270 100,270" fill="#18182b" />
    <line x1="210" y1="160" x2="150" y2="270" stroke="${p2}" stroke-width="3" />
    <line x1="270" y1="160" x2="330" y2="270" stroke="${p2}" stroke-width="3" />
    <!-- Platform edge warning yellow line -->
    <line x1="0" y1="210" x2="480" y2="210" stroke="#eab308" stroke-width="3" stroke-dasharray="8 6" />
  `;
}

function renderMarket(ctx: RenderContext): string {
  const { p1, p2, p3 } = ctx;
  return `
    <rect x="0" y="0" width="480" height="270" fill="#120c18" />
    <!-- Colorful striped market awnings -->
    <polygon points="20,50 140,50 120,100 0,100" fill="${p1}" />
    <polygon points="140,50 260,50 240,100 120,100" fill="${p2}" />
    <polygon points="260,50 380,50 360,100 240,100" fill="${p3}" />
    <polygon points="380,50 480,50 480,100 360,100" fill="${p1}" />
    <!-- Spices & fruit baskets in foreground -->
    <ellipse cx="100" cy="220" rx="35" ry="20" fill="#d97706" stroke="#f59e0b" stroke-width="2" />
    <ellipse cx="240" cy="230" rx="40" ry="22" fill="#dc2626" stroke="#ef4444" stroke-width="2" />
    <ellipse cx="380" cy="220" rx="35" ry="20" fill="#16a34a" stroke="#22c55e" stroke-width="2" />
  `;
}

function renderForest(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <!-- Sky backdrop -->
    <rect x="0" y="0" width="480" height="270" fill="#04120e" />
    <!-- Background rolling hills -->
    <path d="M 0 150 Q 120 110 240 140 Q 360 100 480 130 L 480 270 L 0 270 Z" fill="#062e24" />
    <!-- Midground dense pines -->
    <polygon points="60,60 30,170 90,170" fill="#044131" stroke="${p1}" stroke-width="1.5" />
    <polygon points="180,40 140,180 220,180" fill="#065f46" stroke="${p1}" stroke-width="1.5" />
    <polygon points="340,50 300,170 380,170" fill="#044131" stroke="${p1}" stroke-width="1.5" />
    <!-- Foreground tree trunks -->
    <rect x="15" y="80" width="30" height="190" fill="#1f1810" stroke="${p2}" stroke-width="2" />
    <rect x="420" y="60" width="40" height="210" fill="#1f1810" stroke="${p2}" stroke-width="2" />
  `;
}

function renderCityStreet(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <!-- Skyline silhouette with glowing windows -->
    <rect x="0" y="0" width="480" height="270" fill="#0a0a14" />
    <rect x="40" y="40" width="80" height="180" fill="#111827" stroke="${p1}" stroke-width="1.5" />
    <rect x="150" y="20" width="100" height="200" fill="#0f172a" stroke="${p2}" stroke-width="1.5" />
    <rect x="280" y="60" width="70" height="160" fill="#1e1b4b" stroke="${p1}" stroke-width="1.5" />
    <rect x="370" y="30" width="90" height="190" fill="#111827" stroke="${p2}" stroke-width="1.5" />
    <!-- Street road & wet asphalt reflection -->
    <polygon points="0,200 480,200 480,270 0,270" fill="#030712" />
    <line x1="240" y1="205" x2="240" y2="265" stroke="#facc15" stroke-width="3" stroke-dasharray="16 12" />
  `;
}

function renderSpaceBridge(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <rect x="0" y="0" width="480" height="270" fill="#030712" />
    <!-- Starfield & Giant Gas Planet -->
    <circle cx="360" cy="80" r="55" fill="${p1}" opacity="0.9" />
    <ellipse cx="360" cy="80" rx="95" ry="16" fill="none" stroke="${p2}" stroke-width="3.5" transform="rotate(-15, 360, 80)" />
    <!-- Cockpit Panoramic Struts -->
    <line x1="160" y1="20" x2="130" y2="180" stroke="#1e293b" stroke-width="6" />
    <line x1="320" y1="20" x2="350" y2="180" stroke="#1e293b" stroke-width="6" />
    <polygon points="0,180 480,180 480,270 0,270" fill="#070a0f" />
    <circle cx="240" cy="215" r="22" fill="none" stroke="${p2}" stroke-width="1.5" stroke-dasharray="4 4" />
  `;
}

// -----------------------------------------------------------------------------
// 3. PROP RENDERERS (Dedicated Semantic Objects - Requirement 14)
// -----------------------------------------------------------------------------
function renderCamera(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Camera Body -->
      <rect x="-60" y="-35" width="120" height="75" rx="8" fill="#1e293b" stroke="${p1}" stroke-width="2.5" />
      <!-- Textured Grip -->
      <rect x="-56" y="-30" width="18" height="65" rx="4" fill="#0f172a" />
      <!-- Lens Mount & Elements -->
      <circle cx="10" cy="5" r="34" fill="#0f172a" stroke="${p2}" stroke-width="3" />
      <circle cx="10" cy="5" r="24" fill="#020617" stroke="#ef4444" stroke-width="1.5" />
      <circle cx="4" cy="0" r="9" fill="${p2}" opacity="0.6" />
      <!-- Viewfinder & Hotshoe -->
      <rect x="0" y="-45" width="22" height="10" rx="2" fill="#475569" stroke="${p1}" stroke-width="1.5" />
      <!-- Shutter Button -->
      <rect x="36" y="-42" width="14" height="7" rx="2" fill="#ef4444" />
    </g>
  `;
}

function renderLaptop(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Base keyboard unit -->
      <polygon points="-80,60 80,60 95,75 -95,75" fill="#334155" stroke="${p1}" stroke-width="2" />
      <rect x="-25" y="65" width="50" height="6" rx="1" fill="#1e293b" />
      <!-- Upright display screen -->
      <polygon points="-80,60 80,60 75,-45 -75,-45" fill="#0f172a" stroke="${p2}" stroke-width="2.5" />
      <rect x="-65" y="-35" width="130" height="82" fill="#020617" />
      <line x1="-55" y1="-18" x2="15" y2="-18" stroke="${p1}" stroke-width="2.5" />
      <line x1="-55" y1="0" x2="45" y2="0" stroke="${p2}" stroke-width="2.5" />
    </g>
  `;
}

function renderMicrophone(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <line x1="0" y1="45" x2="0" y2="95" stroke="#475569" stroke-width="6" stroke-linecap="round" />
      <ellipse cx="0" cy="95" rx="38" ry="12" fill="#1e293b" stroke="${p1}" stroke-width="2" />
      <!-- Vintage Ribbon / Condenser Capsule -->
      <rect x="-24" y="-48" width="48" height="85" rx="12" fill="#0f172a" stroke="${p2}" stroke-width="3" />
      <line x1="-18" y1="-28" x2="18" y2="-28" stroke="#94a3b8" stroke-width="2" />
      <line x1="-18" y1="-12" x2="18" y2="-12" stroke="#94a3b8" stroke-width="2" />
      <line x1="-18" y1="4" x2="18" y2="4" stroke="#94a3b8" stroke-width="2" />
      <line x1="-18" y1="20" x2="18" y2="20" stroke="#94a3b8" stroke-width="2" />
      <circle cx="0" cy="-35" r="4" fill="#ef4444" />
    </g>
  `;
}

function renderMicroscope(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <ellipse cx="0" cy="75" rx="50" ry="14" fill="#1e293b" stroke="${p1}" stroke-width="2" />
      <path d="M -35 70 Q -65 -15 -18 -50 L 0 -50" fill="none" stroke="${p1}" stroke-width="9" stroke-linecap="round" />
      <rect x="-12" y="-75" width="24" height="50" fill="#334155" stroke="${p2}" stroke-width="2" />
      <line x1="-6" y1="-75" x2="-18" y2="-95" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
      <line x1="6" y1="-75" x2="18" y2="-95" stroke="${p2}" stroke-width="4.5" stroke-linecap="round" />
      <rect x="-30" y="15" width="60" height="9" rx="2" fill="#0f172a" stroke="${p2}" stroke-width="2" />
    </g>
  `;
}

function renderBooksStack(ctx: RenderContext): string {
  const { p1, p2, p3 } = ctx;
  return `
    <g transform="translate(240, 145)">
      <!-- Bottom large book -->
      <polygon points="-75,45 65,45 80,65 -60,65" fill="${p1}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="-75" y="45" width="14" height="20" rx="3" fill="#1e293b" />
      <!-- Middle book -->
      <polygon points="-65,20 60,20 75,40 -50,40" fill="${p2}" stroke="#0f172a" stroke-width="1.5" />
      <rect x="-65" y="20" width="14" height="20" rx="3" fill="#1e293b" />
      <!-- Top open book -->
      <polygon points="-55,-5 50,-5 62,15 -42,15" fill="${p3}" stroke="#0f172a" stroke-width="1.5" />
      <line x1="0" y1="-5" x2="10" y2="15" stroke="#f8fafc" stroke-width="2" />
    </g>
  `;
}

function renderBicycle(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Wheels -->
      <circle cx="-65" cy="40" r="38" fill="none" stroke="#e2e8f0" stroke-width="4" />
      <circle cx="65" cy="40" r="38" fill="none" stroke="#e2e8f0" stroke-width="4" />
      <!-- Spokes -->
      <line x1="-65" y1="2" x2="-65" y2="78" stroke="#64748b" stroke-width="1" />
      <line x1="-103" y1="40" x2="-27" y2="40" stroke="#64748b" stroke-width="1" />
      <line x1="65" y1="2" x2="65" y2="78" stroke="#64748b" stroke-width="1" />
      <line x1="27" y1="40" x2="103" y2="40" stroke="#64748b" stroke-width="1" />
      <!-- Frame Diamond -->
      <line x1="-65" y1="40" x2="-10" y2="40" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="-10" y1="40" x2="-25" y2="-10" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="-65" y1="40" x2="-25" y2="-10" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="-25" y1="-10" x2="40" y2="-10" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="-10" y1="40" x2="40" y2="-10" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="40" y1="-10" x2="65" y2="40" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <!-- Handlebars & Seat -->
      <line x1="40" y1="-10" x2="45" y2="-28" stroke="${p2}" stroke-width="4" stroke-linecap="round" />
      <line x1="35" y1="-28" x2="55" y2="-28" stroke="#1e293b" stroke-width="5" stroke-linecap="round" />
      <ellipse cx="-28" cy="-14" rx="14" ry="4" fill="#0f172a" />
    </g>
  `;
}

function renderHoverbike(ctx: RenderContext): string {
  const { p1, p2, p3 } = ctx;
  return `
    <!-- Futuristic Anti-Grav Hoverbike -->
    <g transform="translate(240, 140)">
      <!-- Ground shadow & anti-grav glow ripple -->
      <ellipse cx="0" cy="72" rx="95" ry="12" fill="#000000" opacity="0.4" />
      <ellipse cx="-60" cy="65" rx="35" ry="8" fill="#06b6d4" opacity="0.3" filter="blur(2px)" />
      <ellipse cx="60" cy="65" rx="35" ry="8" fill="#06b6d4" opacity="0.3" filter="blur(2px)" />
      <!-- Rear Dual Ion Plasma Exhaust Trails -->
      <polygon points="-80,25 -135,18 -150,26 -135,34 -80,28" fill="#06b6d4" opacity="0.8" />
      <polygon points="-80,25 -120,22 -135,26 -120,30 -80,27" fill="#ffffff" opacity="0.9" />
      <!-- Front & Rear Anti-Grav Repulsor Rings -->
      <circle cx="-60" cy="35" r="28" fill="#0f172a" stroke="#06b6d4" stroke-width="4" />
      <circle cx="-60" cy="35" r="18" fill="#082f49" stroke="#38bdf8" stroke-width="2" />
      <circle cx="-60" cy="35" r="8" fill="#38bdf8" />
      <circle cx="60" cy="35" r="28" fill="#0f172a" stroke="#06b6d4" stroke-width="4" />
      <circle cx="60" cy="35" r="18" fill="#082f49" stroke="#38bdf8" stroke-width="2" />
      <circle cx="60" cy="35" r="8" fill="#38bdf8" />
      <!-- Main Aerodynamic Chassis Fairing -->
      <polygon points="-75,25 -30,5 50,0 95,12 85,38 20,42 -60,40" fill="#181824" stroke="${p1}" stroke-width="3" />
      <!-- Upper Hull & Angled Cockpit Windshield -->
      <polygon points="10,-2 48,-2 75,-25 98,12 50,0" fill="#0f172a" stroke="${p2}" stroke-width="2" />
      <polygon points="35,-5 68,-22 88,8 60,2" fill="#38bdf8" opacity="0.5" stroke="#bae6fd" stroke-width="1.5" />
      <!-- Low-slung handlebars with holographic HUD -->
      <line x1="30" y1="-8" x2="22" y2="-22" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <line x1="12" y1="-22" x2="32" y2="-22" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
      <rect x="25" y="-30" width="18" height="8" rx="2" fill="#06b6d4" opacity="0.8" />
      <!-- Ergonomic Carbon Rider Seat -->
      <path d="M -35 5 Q -10 5 -5 18 L -45 18 Z" fill="#2d2238" stroke="${p1}" stroke-width="2" />
      <!-- Neon Accents and Status Lights -->
      <line x1="-50" y1="28" x2="40" y2="28" stroke="#06b6d4" stroke-width="2" stroke-dasharray="8 4" />
      <circle cx="92" cy="18" r="3" fill="#f43f5e" />
    </g>
  `;
}

function renderSword(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135) rotate(-35)">
      <polygon points="0,-115 9,40 -9,40" fill="#e2e8f0" stroke="${p2}" stroke-width="2" />
      <line x1="0" y1="-100" x2="0" y2="35" stroke="#94a3b8" stroke-width="2" />
      <rect x="-30" y="40" width="60" height="8" rx="3" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
      <rect x="-5" y="48" width="10" height="32" fill="#78350f" />
      <circle cx="0" cy="86" r="8" fill="#facc15" />
    </g>
  `;
}

function renderShield(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Medieval Crest Shield -->
      <path d="M -50 -60 L 50 -60 L 50 10 C 50 65 0 95 0 95 C 0 95 -50 65 -50 10 Z" fill="#1e293b" stroke="${p1}" stroke-width="3.5" />
      <path d="M 0 -60 L 0 95" stroke="${p2}" stroke-width="3" />
      <path d="M -50 -10 L 50 -10" stroke="${p2}" stroke-width="3" />
      <circle cx="0" cy="-10" r="16" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
    </g>
  `;
}

function renderStaff(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135) rotate(15)">
      <line x1="0" y1="-90" x2="0" y2="105" stroke="#78350f" stroke-width="6" stroke-linecap="round" />
      <!-- Arcane Crystal Top -->
      <polygon points="0,-120 16,-95 0,-70 -16,-95" fill="${p1}" stroke="${p2}" stroke-width="2.5" />
      <circle cx="0" cy="-95" r="24" fill="none" stroke="${p2}" stroke-width="2" stroke-dasharray="4 4" />
    </g>
  `;
}

function renderDrone(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Central Pod -->
      <ellipse cx="0" cy="0" rx="35" ry="18" fill="#1e293b" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="6" r="10" fill="#020617" stroke="#38bdf8" stroke-width="2" />
      <!-- 4 Rotor Arms -->
      <line x1="-25" y1="-10" x2="-65" y2="-35" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <line x1="25" y1="-10" x2="65" y2="-35" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <line x1="-25" y1="10" x2="-65" y2="35" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <line x1="25" y1="10" x2="65" y2="35" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <!-- Propeller Discs -->
      <ellipse cx="-65" cy="-35" rx="22" ry="6" fill="${p2}" opacity="0.75" />
      <ellipse cx="65" cy="-35" rx="22" ry="6" fill="${p2}" opacity="0.75" />
      <ellipse cx="-65" cy="35" rx="22" ry="6" fill="${p2}" opacity="0.75" />
      <ellipse cx="65" cy="35" rx="22" ry="6" fill="${p2}" opacity="0.75" />
    </g>
  `;
}

function renderPotion(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <circle cx="0" cy="25" r="45" fill="${p1}" opacity="0.85" stroke="#e2e8f0" stroke-width="2.5" />
      <rect x="-14" y="-35" width="28" height="25" fill="#334155" stroke="#e2e8f0" stroke-width="2" />
      <rect x="-18" y="-45" width="36" height="12" rx="3" fill="#b45309" stroke="#78350f" stroke-width="1.5" />
      <!-- Bubbles inside liquid -->
      <circle cx="-15" cy="20" r="5" fill="#ffffff" opacity="0.7" />
      <circle cx="10" cy="35" r="7" fill="#ffffff" opacity="0.6" />
      <circle cx="8" cy="10" r="3.5" fill="#ffffff" opacity="0.8" />
    </g>
  `;
}

function renderTablet(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <rect x="-55" y="-70" width="110" height="140" rx="8" fill="#1e293b" stroke="${p1}" stroke-width="2" />
      <rect x="-48" y="-60" width="96" height="120" rx="4" fill="#020617" />
      <circle cx="0" cy="55" r="3" fill="#64748b" />
      <line x1="-35" y1="-30" x2="25" y2="-30" stroke="${p2}" stroke-width="2.5" />
      <line x1="-35" y1="-10" x2="10" y2="-10" stroke="${p1}" stroke-width="2.5" />
    </g>
  `;
}

function renderMagicCircle(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <circle cx="0" cy="0" r="70" fill="none" stroke="${p1}" stroke-width="2.5" />
      <circle cx="0" cy="0" r="55" fill="none" stroke="${p2}" stroke-width="1.5" stroke-dasharray="6 4" />
      <polygon points="0,-55 48,27 -48,27" fill="none" stroke="${p1}" stroke-width="2" />
      <polygon points="0,55 48,-27 -48,-27" fill="none" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="0" r="16" fill="${p2}" opacity="0.8" />
    </g>
  `;
}

function renderTerminal(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <rect x="-50" y="-45" width="100" height="90" rx="6" fill="#0f172a" stroke="${p1}" stroke-width="2" />
      <rect x="-40" y="-35" width="80" height="70" fill="#020617" />
      <line x1="-30" y1="-20" x2="10" y2="-20" stroke="#22c55e" stroke-width="2" />
      <line x1="-30" y1="-5" x2="30" y2="-5" stroke="#22c55e" stroke-width="2" />
      <line x1="-30" y1="10" x2="0" y2="10" stroke="#22c55e" stroke-width="2" />
    </g>
  `;
}

function renderRetroCar(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Vintage Classic Automobile -->
      <ellipse cx="0" cy="55" rx="100" ry="12" fill="#000000" opacity="0.4" />
      <path d="M -85 30 C -85 5 -50 0 -20 -15 L 20 -15 C 50 0 85 10 90 35 L -85 35 Z" fill="#1e293b" stroke="${p1}" stroke-width="3" />
      <path d="M -40 -12 C -30 -42 20 -42 35 -12 Z" fill="#0f172a" stroke="${p2}" stroke-width="2" />
      <line x1="-2" y1="-38" x2="-2" y2="-12" stroke="${p1}" stroke-width="2" />
      <circle cx="85" cy="20" r="7" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5" />
      <rect x="88" y="32" width="10" height="6" rx="2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />
      <rect x="-95" y="32" width="10" height="6" rx="2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />
      <circle cx="-55" cy="40" r="18" fill="#0f172a" stroke="#e2e8f0" stroke-width="3" />
      <circle cx="-55" cy="40" r="8" fill="#e2e8f0" />
      <circle cx="55" cy="40" r="18" fill="#0f172a" stroke="#e2e8f0" stroke-width="3" />
      <circle cx="55" cy="40" r="8" fill="#e2e8f0" />
    </g>
  `;
}

function renderHighspeedTrain(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Aerodynamic High-Speed Bullet Train -->
      <ellipse cx="0" cy="52" rx="110" ry="10" fill="#000000" opacity="0.35" />
      <path d="M -110 35 L 50 35 C 95 35 115 15 110 -2 C 90 -22 40 -25 -110 -25 Z" fill="#f8fafc" stroke="${p1}" stroke-width="3" />
      <path d="M -110 12 L 55 12 C 85 12 105 5 108 0 C 95 -6 60 -6 -110 -6 Z" fill="${p2}" />
      <path d="M 50 -18 L 85 -5 L 58 -2 L 35 -14 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
      <rect x="-95" y="-16" width="16" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
      <rect x="-70" y="-16" width="16" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
      <rect x="-45" y="-16" width="16" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
      <rect x="-20" y="-16" width="16" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
      <rect x="5" y="-16" width="16" height="10" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
      <ellipse cx="106" cy="18" rx="4" ry="3" fill="#facc15" />
    </g>
  `;
}

function renderChalkboard(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Classroom Framed Chalkboard -->
      <rect x="-85" y="-55" width="170" height="105" rx="4" fill="#78350f" stroke="#451a03" stroke-width="3" />
      <rect x="-78" y="-48" width="156" height="91" fill="#064e3b" stroke="#047857" stroke-width="1.5" />
      <text x="-65" y="-22" fill="#a7f3d0" font-family="monospace" font-size="12" font-style="italic">E = mc²</text>
      <text x="-65" y="0" fill="#f8fafc" font-family="monospace" font-size="11">∫ f(x) dx = F(x)</text>
      <text x="-65" y="22" fill="#fde047" font-family="monospace" font-size="10">Story Arc: 1 → 2 → 3</text>
      <rect x="-75" y="43" width="150" height="6" fill="#92400e" stroke="#78350f" stroke-width="1" />
      <rect x="25" y="38" width="22" height="6" rx="1" fill="#f1f5f9" />
      <rect x="52" y="39" width="14" height="4" rx="1" fill="#facc15" />
    </g>
  `;
}

function renderSchoolBag(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Student School Backpack -->
      <ellipse cx="0" cy="58" rx="48" ry="10" fill="#000000" opacity="0.35" />
      <rect x="-42" y="-48" width="84" height="96" rx="18" fill="#1e293b" stroke="${p1}" stroke-width="3" />
      <rect x="-30" y="5" width="60" height="38" rx="8" fill="#0f172a" stroke="${p2}" stroke-width="2" />
      <line x1="-24" y1="12" x2="24" y2="12" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
      <path d="M -16 -48 C -16 -62 16 -62 16 -48" fill="none" stroke="${p1}" stroke-width="4" stroke-linecap="round" />
      <path d="M -34 -30 C -48 -10 -46 25 -38 42" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <path d="M 34 -30 C 48 -10 46 25 38 42" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round" />
      <line x1="-20" y1="32" x2="20" y2="32" stroke="#facc15" stroke-width="2.5" />
    </g>
  `;
}

function renderDeskChair(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- Ergonomic Studio Desk Chair -->
      <ellipse cx="0" cy="62" rx="45" ry="8" fill="#000000" opacity="0.3" />
      <rect x="-24" y="-55" width="48" height="52" rx="10" fill="#1e293b" stroke="${p1}" stroke-width="2.5" />
      <path d="M -20 -20 Q 0 -10 20 -20" fill="none" stroke="${p2}" stroke-width="3" />
      <rect x="-30" y="3" width="60" height="16" rx="6" fill="#0f172a" stroke="${p1}" stroke-width="2.5" />
      <path d="M -28 -8 L -32 -8 L -32 10" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
      <path d="M 28 -8 L 32 -8 L 32 10" fill="none" stroke="#64748b" stroke-width="3" stroke-linecap="round" />
      <line x1="0" y1="19" x2="0" y2="45" stroke="#94a3b8" stroke-width="5" />
      <line x1="0" y1="45" x2="-35" y2="58" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />
      <line x1="0" y1="45" x2="35" y2="58" stroke="#475569" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="-35" cy="59" r="4" fill="#0f172a" />
      <circle cx="35" cy="59" r="4" fill="#0f172a" />
    </g>
  `;
}

function renderMedicalKit(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 135)">
      <!-- First Aid Medical Case -->
      <ellipse cx="0" cy="52" rx="55" ry="9" fill="#000000" opacity="0.35" />
      <rect x="-50" y="-35" width="100" height="78" rx="8" fill="#f8fafc" stroke="#dc2626" stroke-width="3.5" />
      <rect x="-8" y="-18" width="16" height="42" fill="#ef4444" />
      <rect x="-21" y="-5" width="42" height="16" fill="#ef4444" />
      <path d="M -18 -35 C -18 -48 18 -48 18 -35" fill="none" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round" />
      <rect x="-35" y="-3" width="8" height="12" rx="1.5" fill="#94a3b8" />
      <rect x="27" y="-3" width="8" height="12" rx="1.5" fill="#94a3b8" />
    </g>
  `;
}

function renderToolbox(ctx: RenderContext): string {
  return `
    <g transform="translate(240, 135)">
      <!-- Heavy Duty Mechanics Toolbox -->
      <ellipse cx="0" cy="52" rx="60" ry="10" fill="#000000" opacity="0.35" />
      <polygon points="-58,-15 58,-15 50,45 -50,45" fill="#b91c1c" stroke="#7f1d1d" stroke-width="3" />
      <polygon points="-64,-28 64,-28 58,-15 -58,-15" fill="#dc2626" stroke="#991b1b" stroke-width="2" />
      <path d="M -20 -28 C -20 -44 20 -44 20 -28" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
      <rect x="-10" y="-18" width="20" height="14" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1.5" />
      <line x1="-30" y1="15" x2="30" y2="15" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round" opacity="0.6" />
    </g>
  `;
}

function renderHardHat(ctx: RenderContext): string {
  return `
    <g transform="translate(240, 135)">
      <!-- Construction Site Safety Helmet -->
      <ellipse cx="0" cy="45" rx="55" ry="8" fill="#000000" opacity="0.3" />
      <path d="M -48 18 C -48 -28 48 -28 48 18 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3" />
      <path d="M -6 -26 C -6 -32 6 -32 6 -26 L 6 18 L -6 18 Z" fill="#eab308" />
      <path d="M -62 18 C -62 26 62 26 62 18 Z" fill="#eab308" stroke="#ca8a04" stroke-width="2" />
      <rect x="-15" y="-4" width="30" height="10" rx="2" fill="#ffffff" opacity="0.8" />
    </g>
  `;
}

// -----------------------------------------------------------------------------
// 4. ANIMAL RENDERERS (All 17 Dedicated Animal Silhouette Renderers - Requirement 15)
// -----------------------------------------------------------------------------
function renderDog(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <circle cx="0" cy="-10" r="45" fill="#d97706" stroke="${p1}" stroke-width="2" />
      <ellipse cx="-45" cy="0" rx="14" ry="26" fill="#b45309" transform="rotate(15, -45, 0)" />
      <ellipse cx="45" cy="0" rx="14" ry="26" fill="#b45309" transform="rotate(-15, 45, 0)" />
      <ellipse cx="0" cy="12" rx="18" ry="14" fill="#fef3c7" />
      <circle cx="0" cy="8" r="6" fill="#000000" />
      <circle cx="-15" cy="-14" r="6" fill="#000000" />
      <circle cx="15" cy="-14" r="6" fill="#000000" />
    </g>
  `;
}

function renderCat(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <circle cx="0" cy="0" r="42" fill="#111827" stroke="${p1}" stroke-width="2" />
      <polygon points="-35,-25 -25,-60 -10,-35" fill="#111827" stroke="${p1}" stroke-width="2" />
      <polygon points="35,-25 25,-60 10,-35" fill="#111827" stroke="${p1}" stroke-width="2" />
      <ellipse cx="-14" cy="-8" rx="7" ry="9" fill="#22c55e" />
      <ellipse cx="14" cy="-8" rx="7" ry="9" fill="#22c55e" />
      <polygon points="-4,10 4,10 0,16" fill="#f43f5e" />
    </g>
  `;
}

function renderCow(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Head silhouette with horns -->
      <polygon points="-40,-50 -60,-80 -30,-60" fill="#e2e8f0" stroke="${p1}" stroke-width="2" />
      <polygon points="40,-50 60,-80 30,-60" fill="#e2e8f0" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="-20" r="45" fill="#f8fafc" stroke="${p1}" stroke-width="2.5" />
      <!-- Black patches -->
      <ellipse cx="-20" cy="-35" rx="16" ry="12" fill="#0f172a" />
      <ellipse cx="24" cy="-10" rx="14" ry="18" fill="#0f172a" />
      <!-- Snout -->
      <ellipse cx="0" cy="10" rx="30" ry="18" fill="#fbcfe8" stroke="${p1}" stroke-width="2" />
      <circle cx="-12" cy="10" r="4.5" fill="#0f172a" />
      <circle cx="12" cy="10" r="4.5" fill="#0f172a" />
    </g>
  `;
}

function renderHorse(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <polygon points="-15,-60 -25,-90 -5,-70" fill="#78350f" stroke="${p1}" stroke-width="2" />
      <polygon points="15,-60 25,-90 5,-70" fill="#78350f" stroke="${p1}" stroke-width="2" />
      <path d="M -30 -30 C -35 -70 35 -70 30 -30 L 20 25 C 15 50 -15 50 -20 25 Z" fill="#78350f" stroke="${p1}" stroke-width="2" />
      <path d="M 0 -65 C 10 -40 20 -20 25 15" stroke="#f59e0b" stroke-width="6" fill="none" stroke-linecap="round" />
      <circle cx="-12" cy="-20" r="5" fill="#000000" />
      <circle cx="12" cy="-20" r="5" fill="#000000" />
    </g>
  `;
}

function renderElephant(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <ellipse cx="-55" cy="-15" rx="28" ry="38" fill="#64748b" stroke="${p1}" stroke-width="2" />
      <ellipse cx="55" cy="-15" rx="28" ry="38" fill="#64748b" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="-10" r="45" fill="#475569" stroke="${p1}" stroke-width="2" />
      <!-- Long curving trunk -->
      <path d="M 0 5 C 0 45 40 45 40 20" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round" />
      <!-- Tusks -->
      <path d="M -15 15 C -25 35 -40 30 -40 20" fill="none" stroke="#fef08a" stroke-width="4.5" stroke-linecap="round" />
      <path d="M 15 15 C 25 35 40 30 40 20" fill="none" stroke="#fef08a" stroke-width="4.5" stroke-linecap="round" />
    </g>
  `;
}

function renderTiger(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <circle cx="0" cy="0" r="50" fill="#ea580c" stroke="${p1}" stroke-width="2" />
      <polygon points="-45,-30 -30,-60 -15,-40" fill="#ea580c" stroke="${p1}" stroke-width="2" />
      <polygon points="45,-30 30,-60 15,-40" fill="#ea580c" stroke="${p1}" stroke-width="2" />
      <path d="M -40 -15 L -20 -10 M -45 5 L -25 5 M 40 -15 L 20 -10 M 45 5 L 25 5" stroke="#000000" stroke-width="3.5" stroke-linecap="round" />
      <ellipse cx="-16" cy="-8" rx="6" ry="5" fill="#facc15" />
      <ellipse cx="16" cy="-8" rx="6" ry="5" fill="#facc15" />
      <ellipse cx="0" cy="18" rx="14" ry="10" fill="#f8fafc" />
      <polygon points="-5,14 5,14 0,19" fill="#dc2626" />
    </g>
  `;
}

function renderLion(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Giant Golden Lion Mane -->
      <circle cx="0" cy="0" r="60" fill="#b45309" stroke="#78350f" stroke-width="3" />
      <circle cx="0" cy="0" r="42" fill="#f59e0b" stroke="${p1}" stroke-width="2" />
      <circle cx="-15" cy="-8" r="5.5" fill="#0f172a" />
      <circle cx="15" cy="-8" r="5.5" fill="#0f172a" />
      <polygon points="-7,10 7,10 0,18" fill="#78350f" />
    </g>
  `;
}

function renderMonkey(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <circle cx="-42" cy="-10" r="16" fill="#92400e" stroke="${p1}" stroke-width="2" />
      <circle cx="42" cy="-10" r="16" fill="#92400e" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="-5" r="42" fill="#78350f" stroke="${p1}" stroke-width="2" />
      <ellipse cx="0" cy="8" rx="22" ry="18" fill="#fef3c7" />
      <circle cx="-12" cy="-10" r="5" fill="#0f172a" />
      <circle cx="12" cy="-10" r="5" fill="#0f172a" />
      <ellipse cx="0" cy="8" rx="6" ry="4" fill="#0f172a" />
    </g>
  `;
}

function renderRabbit(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Long ears -->
      <ellipse cx="-16" cy="-60" rx="10" ry="35" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <ellipse cx="16" cy="-60" rx="10" ry="35" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <ellipse cx="-16" cy="-60" rx="5" ry="24" fill="#fbcfe8" />
      <ellipse cx="16" cy="-60" rx="5" ry="24" fill="#fbcfe8" />
      <circle cx="0" cy="0" r="40" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <circle cx="-14" cy="-5" r="5" fill="#ef4444" />
      <circle cx="14" cy="-5" r="5" fill="#ef4444" />
      <polygon points="-4,8 4,8 0,14" fill="#f43f5e" />
    </g>
  `;
}

function renderFox(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <polygon points="-35,-25 -30,-68 -10,-35" fill="#c2410c" stroke="${p1}" stroke-width="2" />
      <polygon points="35,-25 30,-68 10,-35" fill="#c2410c" stroke="${p1}" stroke-width="2" />
      <polygon points="-45,0 45,0 0,45" fill="#ea580c" stroke="${p1}" stroke-width="2" />
      <polygon points="-30,0 30,0 0,35" fill="#f8fafc" />
      <ellipse cx="-14" cy="-6" rx="5" ry="7" fill="#0f172a" />
      <ellipse cx="14" cy="-6" rx="5" ry="7" fill="#0f172a" />
      <circle cx="0" cy="30" r="5" fill="#0f172a" />
    </g>
  `;
}

function renderDeer(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Branching Antlers -->
      <path d="M -15 -35 L -35 -80 L -55 -95 M -35 -80 L -25 -105 M -35 -60 L -55 -65" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M 15 -35 L 35 -80 L 55 -95 M 35 -80 L 25 -105 M 35 -60 L 55 -65" stroke="#78350f" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <circle cx="0" cy="-10" r="35" fill="#b45309" stroke="${p1}" stroke-width="2" />
      <ellipse cx="-12" cy="-12" rx="4.5" ry="6" fill="#0f172a" />
      <ellipse cx="12" cy="-12" rx="4.5" ry="6" fill="#0f172a" />
      <ellipse cx="0" cy="8" rx="8" ry="6" fill="#0f172a" />
    </g>
  `;
}

function renderBear(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <circle cx="-35" cy="-35" r="16" fill="#451a03" stroke="${p1}" stroke-width="2" />
      <circle cx="35" cy="-35" r="16" fill="#451a03" stroke="${p1}" stroke-width="2" />
      <circle cx="0" cy="0" r="52" fill="#451a03" stroke="${p1}" stroke-width="2" />
      <ellipse cx="0" cy="14" rx="26" ry="18" fill="#78350f" />
      <circle cx="-16" cy="-6" r="5" fill="#000000" />
      <circle cx="16" cy="-6" r="5" fill="#000000" />
      <ellipse cx="0" cy="10" rx="9" ry="6" fill="#000000" />
    </g>
  `;
}

function renderWolf(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <polygon points="-30,-25 -25,-75 -5,-35" fill="#334155" stroke="${p1}" stroke-width="2" />
      <polygon points="30,-25 25,-75 5,-35" fill="#334155" stroke="${p1}" stroke-width="2" />
      <polygon points="-45,-5 45,-5 0,40" fill="#475569" stroke="${p1}" stroke-width="2" />
      <ellipse cx="-14" cy="-10" rx="6" ry="7" fill="#facc15" />
      <ellipse cx="14" cy="-10" rx="6" ry="7" fill="#facc15" />
      <circle cx="0" cy="25" r="5.5" fill="#0f172a" />
    </g>
  `;
}

function renderOwl(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <ellipse cx="0" cy="0" rx="45" ry="55" fill="#475569" stroke="${p1}" stroke-width="2" />
      <polygon points="-30,-45 -40,-75 -15,-50" fill="#334155" />
      <polygon points="30,-45 40,-75 15,-50" fill="#334155" />
      <circle cx="-18" cy="-10" r="18" fill="#facc15" stroke="#0f172a" stroke-width="3" />
      <circle cx="18" cy="-10" r="18" fill="#facc15" stroke="#0f172a" stroke-width="3" />
      <circle cx="-18" cy="-10" r="8" fill="#000000" />
      <circle cx="18" cy="-10" r="8" fill="#000000" />
      <polygon points="-4,2 4,2 0,14" fill="#d97706" />
    </g>
  `;
}

function renderEagle(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Majestic eagle head & hooked golden beak -->
      <path d="M -30 25 C -40 -35 20 -60 45 -20 L 35 15 C 20 40 -20 40 -30 25 Z" fill="#f8fafc" stroke="${p1}" stroke-width="2" />
      <path d="M 25 -15 Q 55 -10 40 15 Q 30 15 25 -5" fill="#facc15" stroke="#ca8a04" stroke-width="2" />
      <circle cx="5" cy="-12" r="5" fill="#0f172a" />
      <circle cx="6" cy="-14" r="1.5" fill="#ffffff" />
    </g>
  `;
}

function renderSnake(ctx: RenderContext): string {
  const { p1, p2 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Coiling Cobra Silhouette -->
      <path d="M -45 50 Q -10 65 30 40 Q 60 15 30 -10 Q 0 -35 0 -60" fill="none" stroke="#15803d" stroke-width="18" stroke-linecap="round" />
      <!-- Cobra Hood -->
      <ellipse cx="0" cy="-60" rx="30" ry="24" fill="#166534" stroke="${p1}" stroke-width="2" />
      <circle cx="-12" cy="-62" r="4" fill="#ef4444" />
      <circle cx="12" cy="-62" r="4" fill="#ef4444" />
      <path d="M 0 -50 L 0 -35 L -6 -25 M 0 -35 L 6 -25" stroke="#ef4444" stroke-width="2.5" fill="none" />
    </g>
  `;
}

function renderBird(ctx: RenderContext): string {
  const { p1 } = ctx;
  return `
    <g transform="translate(240, 140)">
      <!-- Perched Songbird -->
      <line x1="-60" y1="45" x2="60" y2="45" stroke="#78350f" stroke-width="4" stroke-linecap="round" />
      <ellipse cx="-5" cy="15" rx="30" ry="24" fill="#0284c7" stroke="${p1}" stroke-width="2" />
      <circle cx="15" cy="-10" r="18" fill="#38bdf8" stroke="${p1}" stroke-width="2" />
      <polygon points="32,-10 45,-6 32,-2" fill="#f59e0b" />
      <circle cx="20" cy="-12" r="3.5" fill="#0f172a" />
      <polygon points="-30,20 -65,35 -35,30" fill="#0369a1" />
    </g>
  `;
}

// -----------------------------------------------------------------------------
// 5. STYLE DEMONSTRATION RENDERERS (Real Visual Demonstrations - Requirement 16)
// -----------------------------------------------------------------------------
function renderStylePreset(ctx: RenderContext): string {
  const { style, p1, p2, p3 } = ctx;

  if (style === 'anime') {
    // Cinematic Anime Twilight: luminous cumulus clouds, rim lighting, silhouette ridge
    return `
      <rect width="480" height="270" fill="none" />
      <circle cx="340" cy="70" r="50" fill="${p1}" opacity="0.6" filter="blur(10px)" />
      <!-- Stylized cumulus anime cloud shelf -->
      <path d="M 60 170 Q 110 120 170 140 Q 230 100 290 130 Q 360 110 420 170 Z" fill="#2d224d" opacity="0.9" />
      <path d="M 120 180 Q 180 135 240 155 Q 300 125 380 180 Z" fill="#482d6b" opacity="0.7" />
      <!-- Silhouette ridge -->
      <polygon points="0,210 120,180 240,200 360,175 480,195 480,270 0,270" fill="#0c0d18" />
    `;
  } else if (style === 'cyberpunk') {
    // Neon Sci-Fi: futuristic architecture, neon lighting, perspective depth
    return `
      <polygon points="0,170 480,170 480,270 0,270" fill="#080812" />
      <line x1="0" y1="170" x2="480" y2="170" stroke="${p1}" stroke-width="2" />
      <line x1="240" y1="170" x2="60" y2="270" stroke="${p2}" stroke-width="1.5" />
      <line x1="240" y1="170" x2="420" y2="270" stroke="${p2}" stroke-width="1.5" />
      <rect x="180" y="60" width="120" height="110" fill="#0d1124" stroke="${p1}" stroke-width="2" />
      <circle cx="240" cy="115" r="30" fill="none" stroke="${p2}" stroke-width="2" stroke-dasharray="6 4" />
    `;
  } else if (style === '3D') {
    // Stylized 3D: softbox lighting, sphere with subsurface scattering & specular bounce
    return `
      <g transform="translate(240, 135)">
        <ellipse cx="0" cy="70" rx="65" ry="16" fill="#000000" opacity="0.4" filter="blur(6px)" />
        <circle cx="0" cy="0" r="65" fill="${p1}" />
        <circle cx="-18" cy="-20" r="45" fill="${p2}" opacity="0.75" />
        <circle cx="-28" cy="-30" r="14" fill="#ffffff" opacity="0.8" />
      </g>
    `;
  } else if (style === 'oil-painting' || style === 'cartoon') {
    // Painterly Storybook: brush-like layered landscape with warm lighting
    return `
      <path d="M 0 140 Q 140 100 260 130 Q 380 90 480 120 L 480 270 L 0 270 Z" fill="${p1}" opacity="0.85" />
      <path d="M 0 180 Q 160 140 320 170 Q 400 150 480 175 L 480 270 L 0 270 Z" fill="${p2}" opacity="0.9" />
      <circle cx="100" cy="80" r="35" fill="#facc15" opacity="0.9" />
    `;
  } else if (style === 'comic') {
    // Graphic Ink: high-contrast hatching, halftone splash, bold ink action lines
    return `
      <g transform="translate(240, 135)">
        <polygon points="-70,-60 70,-60 90,60 -90,60" fill="#ffffff" stroke="#000000" stroke-width="4" />
        <line x1="-50" y1="-40" x2="50" y2="40" stroke="#000000" stroke-width="5" />
        <line x1="-30" y1="-50" x2="70" y2="30" stroke="#ef4444" stroke-width="4" />
        <circle cx="0" cy="0" r="25" fill="#facc15" stroke="#000000" stroke-width="3" />
        <text x="0" y="8" fill="#000000" font-size="20" font-family="system-ui" font-weight="900" text-anchor="middle">POW!</text>
      </g>
    `;
  } else {
    // Whiteboard / Clean Ink Treatment: white background, ink drawing, handwritten stroke
    return `
      <rect x="0" y="0" width="480" height="270" fill="#f8fafc" />
      <g transform="translate(240, 135)">
        <circle cx="0" cy="0" r="55" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="8 4" />
        <line x1="-35" y1="0" x2="35" y2="0" stroke="#2563eb" stroke-width="3" />
        <line x1="0" y1="-35" x2="0" y2="35" stroke="#2563eb" stroke-width="3" />
        <text x="0" y="5" fill="#0f172a" font-size="14" font-family="monospace" font-weight="bold" text-anchor="middle">MARKER</text>
      </g>
    `;
  }
}

// -----------------------------------------------------------------------------
// 6. AUTHORITATIVE REGISTRY MAPPING (Requirement 7)
// -----------------------------------------------------------------------------
export const rendererRegistry: Record<string, Record<string, RendererFn>> = {
  characters: {
    teacher: renderTeacher,
    student: renderStudent,
    scientist: renderScientist,
    doctor: renderDoctor,
    police: renderPolice,
    detective: renderDetective,
    'detective-noir': renderDetective,
    chef: renderChef,
    builder: renderBuilder,
    child: renderChild,
    teen: renderStudent,
    'young-adult': renderGenericCharacter,
    adult: renderGenericCharacter,
    'middle-aged': renderGenericCharacter,
    senior: renderSenior,
    engineer: renderBuilder,
    'office-worker': renderGenericCharacter,
    farmer: renderGenericCharacter,
    shopkeeper: renderGenericCharacter,
    driver: renderGenericCharacter,
    artist: renderGenericCharacter,
    athlete: renderGenericCharacter,
    soldier: renderPolice,
    journalist: renderDetective,
    'business-person': renderTeacher,
    villager: renderIndianTraditional,
    'royal-character': renderGenericCharacter,
    'fantasy-warrior': renderGenericCharacter,
    wizard: renderGenericCharacter,
    'cyberpunk-character': renderCyberpunkHero,
    'scifi-character': renderSpaceCrew,
    'space-crew': renderSpaceCrew,
    robot: renderRobot,
    android: renderRobot,
    alien: renderGenericCharacter,
    monster: renderGenericCharacter,
    creature: renderGenericCharacter,
    'cartoon-mascot': renderChild,
    'animal-character': renderFox,
    'educational-presenter': renderTeacher,
    'indian-saree': renderIndianTraditional,
    'indian-kurta': renderIndianTraditional,
    hero: renderGenericCharacter
  },
  backgrounds: {
    classroom: renderClassroom,
    'computer-lab': renderClassroom,
    'science-lab': renderScienceLab,
    'school-corridor': renderSchoolCorridor,
    'bg_science_lab': renderScienceLab,
    'bg_school_corridor': renderSchoolCorridor,
    'bg_bedroom': renderBedroom,
    library: renderClassroom,
    'school-playground': renderForest,
    auditorium: renderClassroom,
    'teachers-office': renderClassroom,
    bedroom: renderBedroom,
    'living-room': renderClassroom,
    kitchen: renderClassroom,
    hallway: renderSchoolCorridor,
    balcony: renderCityStreet,
    rooftop: renderCityStreet,
    'study-room': renderBedroom,
    'city-street': renderCityStreet,
    market: renderMarket,
    'metro-station': renderRailwayStation,
    'bus-stop': renderCityStreet,
    'office-interior': renderHospital,
    hospital: renderHospital,
    'hospital-hallway': renderHospital,
    'police-station': renderHospital,
    restaurant: renderMarket,
    'small-shop': renderMarket,
    'dark-alley': renderCityStreet,
    'parking-area': renderCityStreet,
    forest: renderForest,
    mountain: renderForest,
    river: renderForest,
    lake: renderForest,
    beach: renderForest,
    'village-field': renderForest,
    'farm-barn': renderForest,
    'desert-dunes': renderForest,
    'abandoned-house': renderForest,
    'haunted-room': renderBedroom,
    cemetery: renderForest,
    'dark-corridor': renderSchoolCorridor,
    'abandoned-school': renderClassroom,
    'foggy-road': renderForest,
    'forest-at-night': renderForest,
    'old-hospital': renderHospital,
    'castle-keep': renderForest,
    'dungeon-cell': renderHospital,
    'magical-forest': renderForest,
    'ancient-temple': renderForest,
    'throne-room': renderHospital,
    'medieval-village': renderMarket,
    'fantasy-battlefield': renderForest,
    'spaceship-bridge': renderSpaceBridge,
    'command-center': renderSpaceBridge,
    'futuristic-city': renderCityStreet,
    'cyberpunk-street': renderCityStreet,
    'underground-facility': renderSpaceBridge,
    'space-station-dock': renderSpaceBridge,
    'quantum-lab': renderSpaceBridge,
    'indian-classroom': renderClassroom,
    'government-school': renderClassroom,
    'railway-station': renderRailwayStation,
    'indian-market': renderMarket,
    'village-courtyard': renderMarket,
    'delhi-street': renderMarket,
    'apartment-balcony': renderCityStreet,
    'temple-exterior': renderMarket,
    'kirana-shop': renderMarket,
    'bus-stand': renderRailwayStation
  },
  props: {
    camera: renderCamera,
    laptop: renderLaptop,
    'prop_laptop': renderLaptop,
    microphone: renderMicrophone,
    'ribbon-mic': renderMicrophone,
    microscope: renderMicroscope,
    'books-stack': renderBooksStack,
    book: renderBooksStack,
    bicycle: renderBicycle,
    tablet: renderTablet,
    projector: renderLaptop,
    'school-bag': renderSchoolBag,
    'prop_school_bag': renderSchoolBag,
    chalkboard: renderChalkboard,
    'prop_chalkboard': renderChalkboard,
    'desk-chair': renderDeskChair,
    'prop_desk_chair': renderDeskChair,
    'medical-kit': renderMedicalKit,
    'prop_medical_kit': renderMedicalKit,
    toolbox: renderToolbox,
    'prop_toolbox': renderToolbox,
    'hard-hat': renderHardHat,
    'prop_hard_hat': renderHardHat,
    hoverbike: renderHoverbike,
    'prop_hoverbike': renderHoverbike,
    'retro-car': renderRetroCar,
    'prop_retro_car': renderRetroCar,
    'highspeed-train': renderHighspeedTrain,
    'prop_highspeed_train': renderHighspeedTrain,
    'space-vessel': renderDrone,
    'knight-sword': renderSword,
    sword: renderSword,
    'heater-shield': renderShield,
    'sorcerer-staff': renderStaff,
    'potion-vial': renderPotion,
    'magic-grimoire': renderBooksStack,
    'magic-circle': renderMagicCircle,
    'tactical-hud': renderTerminal,
    'speed-burst': renderMagicCircle,
    'surveillance-drone': renderDrone,
    'plasma-blade': renderSword,
    'biometric-scanner': renderTerminal,
    // ALL 17 DEDICATED ANIMAL RENDERERS (Requirement 15)
    'animal-dog': renderDog,
    'animal-cat': renderCat,
    'animal-cow': renderCow,
    'animal-horse': renderHorse,
    'animal-elephant': renderElephant,
    'animal-tiger': renderTiger,
    'animal-lion': renderLion,
    'animal-monkey': renderMonkey,
    'animal-rabbit': renderRabbit,
    'animal-bird': renderBird,
    'animal-owl': renderOwl,
    'animal-eagle': renderEagle,
    'animal-snake': renderSnake,
    'animal-fox': renderFox,
    'animal-deer': renderDeer,
    'animal-bear': renderBear,
    'animal-wolf': renderWolf,
    // Short key aliases
    dog: renderDog,
    cat: renderCat,
    cow: renderCow,
    horse: renderHorse,
    elephant: renderElephant,
    tiger: renderTiger,
    lion: renderLion,
    monkey: renderMonkey,
    rabbit: renderRabbit,
    bird: renderBird,
    owl: renderOwl,
    eagle: renderEagle,
    snake: renderSnake,
    fox: renderFox,
    deer: renderDeer,
    bear: renderBear,
    wolf: renderWolf
  },
  styles: {
    preset: renderStylePreset,
    anime: renderStylePreset,
    cyberpunk: renderStylePreset,
    '3D': renderStylePreset,
    '3d': renderStylePreset,
    cartoon: renderStylePreset,
    realistic: renderStylePreset,
    comic: renderStylePreset,
    'oil-painting': renderStylePreset,
    'style-twilight': renderStylePreset,
    'style-3d': renderStylePreset,
    'style-storybook': renderStylePreset,
    whiteboard: renderStylePreset,
    watercolor: renderStylePreset
  }
};
