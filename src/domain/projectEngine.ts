// Project Domain Engine — Centralized project lifecycle, defaults, and schema migration

import { Project, ResolutionPreset, FrameRatePreset, ArtStyle, Scene, Character, TimelineClip } from '../types';
import { generateSceneArtwork, generateCharacterAvatar } from '../utils/artworkGenerator';
import { reflowTimelineForScenes } from './timelineEngine';
import { generateMockWaveform, sliceWaveformBySourceRange } from './audioEngine';

export const CURRENT_SCHEMA_VERSION = '0.6.0-prototype';

export function createDefaultProject(
  name: string = 'Cyber Odyssey Episode 01',
  resolution: ResolutionPreset = '1080p',
  fps: FrameRatePreset = 24,
  defaultStyle: ArtStyle = 'anime'
): Project {
  const projectId = `proj_${Date.now()}`;

  // Default characters
  const defaultCharacters: Character[] = [
    {
      id: 'char_01',
      name: 'Dr. Akira Vance',
      role: 'Lead Cyber-Neurologist',
      age: '38',
      bodyFaceHair: 'Tall athletic build, angular jawline, silver-streaked dark hair tied in low knot',
      clothing: 'High-collar carbon fiber lab coat over dark tactical undersuit with cyan luminescent trim',
      palette: ['#06b6d4', '#ec4899', '#3b82f6', '#f1f5f9'],
      artStyle: defaultStyle,
      referenceImage: generateCharacterAvatar('Dr. Akira Vance', defaultStyle, ['#06b6d4', '#ec4899', '#3b82f6']),
      consistencyScore: 98,
      notes: 'Key facial scar over right eyebrow. Always holds holographic diagnostic datapad.'
    },
    {
      id: 'char_02',
      name: 'Maya Lin',
      role: 'Rogue Quantum Infiltrator',
      age: '24',
      bodyFaceHair: 'Slim kinetic frame, sharp piercing amber eyes, asymmetrical neon pink bob haircut',
      clothing: 'Stealth nano-mesh hoodie jacket with orange safety webbing, reinforced knees, fingerless tech gloves',
      palette: ['#f43f5e', '#fbbf24', '#0f172a', '#38bdf8'],
      artStyle: defaultStyle,
      referenceImage: generateCharacterAvatar('Maya Lin', defaultStyle, ['#f43f5e', '#fbbf24', '#0f172a']),
      consistencyScore: 96,
      notes: 'Agile stance, holographic neural visor shifts between orange and cyan.'
    }
  ];

  // Default scenes
  const defaultScenes: Scene[] = [
    {
      id: 'scene_01',
      sceneNumber: 1,
      title: 'Neon Megacity Skyline',
      scriptText: 'Rain slicks the elevated mag-rail tracks as towering holographic ads flicker through volumetric purple fog over Neo-Tokyo Sector 4.',
      duration: 6.0,
      characterIds: [],
      visualAsset: {
        id: 'vis_scene_01',
        title: 'Neon Skyline Horizon',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: 'Neon Megacity Skyline',
          prompt: 'Futuristic megacity skyline at midnight, towering neon skyscrapers in purple rain fog',
          style: defaultStyle,
          seed: 4021,
          characterNames: []
        })
      },
      animationPreset: 'pan-right',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Wide sweeping crane shot drifting downward past luminous overpass',
      visualStyle: defaultStyle,
      notes: 'Establish ominous corporate atmospheric tension.'
    },
    {
      id: 'scene_02',
      sceneNumber: 2,
      title: 'Underground Laboratory Intrusion',
      scriptText: 'Dr. Akira watches holographic neural spikes spike into dangerous critical thresholds as alarms pulse silent crimson bursts.',
      duration: 7.0,
      characterIds: ['char_01'],
      visualAsset: {
        id: 'vis_scene_02',
        title: 'Quantum Bio-Lab Core',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: 'Underground Laboratory Intrusion',
          prompt: 'High tech quantum lab interior, glowing containment core, scientist at terminal',
          style: defaultStyle,
          seed: 9812,
          characterNames: ['Dr. Akira Vance']
        })
      },
      animationPreset: 'zoom-in',
      lipSyncStatus: 'queued',
      cameraMoveDescription: 'Medium push-in focusing on Dr. Akira facial reaction to monitor',
      visualStyle: defaultStyle,
      notes: 'Close-up on Akira holographic datapad reflection.'
    },
    {
      id: 'scene_03',
      sceneNumber: 3,
      title: 'Ventilation Shaft Infiltration',
      scriptText: 'Maya drops silently onto the catwalk, twin data-daggers clicking into stealth lock mode.',
      duration: 5.5,
      characterIds: ['char_02'],
      visualAsset: {
        id: 'vis_scene_03',
        title: 'Catwalk Ambush',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: 'Ventilation Shaft Infiltration',
          prompt: 'Stealth infiltrator crouching on high industrial catwalk, steam vents and laser sensors',
          style: defaultStyle,
          seed: 1243,
          characterNames: ['Maya Lin']
        })
      },
      animationPreset: 'orbit',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Dutch angle rotating clockwise with slight camera shake',
      visualStyle: defaultStyle,
      notes: 'High kinetic energy keyframe.'
    },
    {
      id: 'scene_04',
      sceneNumber: 4,
      title: 'The Neural Core Confrontation',
      scriptText: 'Akira and Maya lock eyes across the quantum terminal as the mainframe initiates emergency lockdown.',
      duration: 6.5,
      characterIds: ['char_01', 'char_02'],
      visualAsset: {
        id: 'vis_scene_04',
        title: 'Lockdown Faceoff',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: 'The Neural Core Confrontation',
          prompt: 'Two characters facing each other across glowing holographic terminal, high contrast lighting',
          style: defaultStyle,
          seed: 7789,
          characterNames: ['Dr. Akira Vance', 'Maya Lin']
        })
      },
      animationPreset: 'dolly-zoom',
      lipSyncStatus: 'queued',
      cameraMoveDescription: 'Tense two-shot dolly zoom centering on the pulsating neural core',
      visualStyle: defaultStyle,
      notes: 'Pivotal story cliffhanger.'
    }
  ];

  // Master audio mock waveform
  const masterWaveform = generateMockWaveform(200, 777);
  const totalSceneDuration = defaultScenes.reduce((acc, s) => acc + s.duration, 0);

  let masterCursor = 0;
  const masterAudio = {
    fileName: 'master_narration_ep01.m4a',
    duration: 36.0,
    waveformPoints: masterWaveform,
    segments: defaultScenes.map(s => {
      const seg = {
        id: `seg_${s.id}`,
        sceneNumber: s.sceneNumber,
        sceneId: s.id,
        sourceIn: masterCursor,
        sourceOut: masterCursor + s.duration,
        start: masterCursor,
        end: masterCursor + s.duration,
        duration: s.duration,
        title: `VO Scene 0${s.sceneNumber}`
      };
      masterCursor += s.duration;
      return seg;
    })
  };

  // Build initial clips and reflow
  const initialIndependentClips: TimelineClip[] = [
    {
      id: 'clip_music_01',
      trackId: 'music',
      title: '🎵 Neon Pulse (Main Theme)',
      start: 0,
      duration: 25.0,
      sourceIn: 0,
      sourceOut: 25.0,
      volume: 75,
      fadeIn: 1.5,
      fadeOut: 2.0,
      color: '#10b981',
      waveform: generateMockWaveform(80, 555)
    },
    {
      id: 'clip_sfx_01',
      trackId: 'sfx',
      title: '🔊 Sub-Bass Drone Impact',
      start: 5.8,
      duration: 3.5,
      sourceIn: 0,
      sourceOut: 3.5,
      volume: 85,
      fadeIn: 0.1,
      fadeOut: 0.5,
      color: '#f59e0b',
      waveform: generateMockWaveform(30, 999)
    }
  ];

  const reflow = reflowTimelineForScenes(defaultScenes, initialIndependentClips, masterAudio);

  return {
    id: projectId,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      resolution,
      fps,
      defaultStyle,
      aspectRatio: '16:9'
    },
    script: defaultScenes.map(s => `${s.title}\n${s.scriptText}`).join('\n\n'),
    masterAudio,
    scenes: defaultScenes,
    characters: defaultCharacters,
    assets: [],
    timeline: {
      clips: reflow.clips,
      duration: reflow.totalDuration
    },
    aiJobs: []
  };
}

// Migrate project data across schema versions (Phase 56)
export function migrateProject(raw: any): Project {
  if (!raw || typeof raw !== 'object') {
    return createDefaultProject();
  }

  // Ensure scenes have minimum duration and sequential numbers
  const scenes: Scene[] = Array.isArray(raw.scenes)
    ? raw.scenes.map((s: any, idx: number) => ({
        ...s,
        sceneNumber: idx + 1,
        duration: Math.max(2.0, Number.isFinite(s.duration) ? s.duration : 6.0)
      }))
    : [];

  const project: Project = {
    id: raw.id || `proj_${Date.now()}`,
    name: raw.name || 'Untitled CGH Story',
    createdAt: raw.createdAt || Date.now(),
    updatedAt: raw.updatedAt || Date.now(),
    settings: {
      resolution: raw.settings?.resolution || '1080p',
      fps: raw.settings?.fps || 24,
      defaultStyle: raw.settings?.defaultStyle || 'anime',
      aspectRatio: raw.settings?.aspectRatio || '16:9'
    },
    script: raw.script || '',
    masterAudio: raw.masterAudio || null,
    scenes,
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    assets: Array.isArray(raw.assets) ? raw.assets : [],
    timeline: {
      clips: Array.isArray(raw.timeline?.clips) ? raw.timeline.clips : [],
      duration: Number.isFinite(raw.timeline?.duration) ? raw.timeline.duration : 25
    },
    aiJobs: Array.isArray(raw.aiJobs) ? raw.aiJobs : []
  };

  // Execute reflow to guarantee integrity
  const reflow = reflowTimelineForScenes(project.scenes, project.timeline.clips, project.masterAudio);
  project.timeline.clips = reflow.clips;
  project.timeline.duration = reflow.totalDuration;

  return project;
}
