/**
 * LocalStorage persistence and initial sample project generator for CGH Story Studio
 */
import { Project, Scene, Character, MediaAsset, TimelineClip, AIJob } from '../types';
import { generateSpeechWaveform, sliceWaveform } from './mockAudio';
import { generateSceneArtwork, generateCharacterAvatar } from './artworkGenerator';

const STORAGE_KEY = 'cgh_story_studio_projects';
const ACTIVE_PROJECT_ID_KEY = 'cgh_story_studio_active_id';

export function createDefaultProject(): Project {
  const masterDuration = 34; // 34 seconds total demo
  const masterWaveform = generateSpeechWaveform(160, 101);

  // Characters
  const char1: Character = {
    id: 'char_ren',
    name: 'Ren Vance',
    role: 'Cyber-Runner Protagonist',
    age: '28',
    bodyFaceHair: 'Sharp jawline, messy silver-streaked black hair, cybernetic ocular implant (left eye)',
    clothing: 'Weathered matte-black trenchcoat with high collar, tactical boots, holstered plasma blade',
    palette: ['#06b6d4', '#1e293b', '#64748b', '#0f172a'],
    artStyle: 'cyberpunk',
    referenceImage: generateCharacterAvatar('Ren Vance', 'cyberpunk', ['#06b6d4', '#3b82f6']),
    consistencyScore: 98,
    notes: 'Maintain left cybernetic eye glow across all camera angles.'
  };

  const char2: Character = {
    id: 'char_maya',
    name: 'Maya Lin',
    role: 'Quantum Netrunner',
    age: '24',
    bodyFaceHair: 'Asymmetrical bob cut with electric magenta tips, neural port tattoo along spine',
    clothing: 'Oversized hooded techwear jacket, biometric smart gloves, holographic AR visor',
    palette: ['#ec4899', '#8b5cf6', '#38bdf8', '#18181b'],
    artStyle: 'cyberpunk',
    referenceImage: generateCharacterAvatar('Maya Lin', 'cyberpunk', ['#ec4899', '#8b5cf6']),
    consistencyScore: 95,
    notes: 'Keep AR visor translucent with cyan telemetry readouts.'
  };

  const char3: Character = {
    id: 'char_enforcer',
    name: 'Chrome Enforcer',
    role: 'Syndicate Hunter Drone',
    age: 'Model X-9',
    bodyFaceHair: 'Polished mirror-chrome ballistic plating, crimson mono-sensor eye slit',
    clothing: 'Heavy exo-chassis armor with pulse rifle mount',
    palette: ['#ef4444', '#71717a', '#09090b', '#dc2626'],
    artStyle: 'cyberpunk',
    referenceImage: generateCharacterAvatar('Enforcer', 'cyberpunk', ['#ef4444', '#71717a']),
    consistencyScore: 92,
    notes: 'Reflective metal highlights must match environmental street lights.'
  };

  const characters = [char1, char2, char3];

  // Scenes
  const scene1Script = "Ren stands atop the gargoyle of the Arasaka tower, rain dripping from his black coat into the shimmering neon abyss below. The digital city buzzes with forbidden frequencies.";
  const scene2Script = "Inside the subterranean hacker lair, Maya's holographic monitors flicker wildly. An unmapped quantum packet breaches their perimeter firewall.";
  const scene3Script = "Ren kicks open the blast door, cybernetic blade drawn. 'Maya, shut the terminal down! They traced the ghost protocol directly to this sector!'";
  const scene4Script = "A squad of chrome-plated Enforcers materialized through the steam vents, red optic sensors locked on the artifact drive.";
  const scene5Script = "Maya activates the magnetic EMP charge as Ren pulls her onto the high-speed transit tube. The city behind them blazes with secondary circuit blowouts.";

  const scenes: Scene[] = [
    {
      id: 'sc_01',
      sceneNumber: 1,
      title: 'Neon Rain & High Tower',
      scriptText: scene1Script,
      duration: 7,
      characterIds: ['char_ren'],
      visualAsset: {
        id: 'vis_01',
        title: 'Ren overlooking Neo-Tokyo',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: '01: Neon Rain',
          prompt: 'Cinematic wide shot of Ren Vance in dark trenchcoat looking down upon cyberpunk cityscape, neon rain, blue & cyan atmospheric glow',
          style: 'cyberpunk',
          seed: 1420,
          characterNames: ['Ren Vance'],
          cameraPreset: 'pan-left',
          palette: ['#06b6d4', '#1e293b']
        }),
        metadata: {
          prompt: 'Cinematic wide shot of Ren Vance in dark trenchcoat looking down upon cyberpunk cityscape, neon rain, blue & cyan atmospheric glow',
          style: 'cyberpunk',
          seed: 1420,
          model: 'CGH Procedural Scene Renderer',
          cfgScale: 7.5,
          steps: 30,
          characterRefIds: ['char_ren'],
          timestamp: new Date().toISOString()
        }
      },
      animationPreset: 'pan-left',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Slow cinematic pan from left skyscraper to right abyss.',
      visualStyle: 'cyberpunk',
      notes: 'Rain particle density should be heavy; rim light on coat.'
    },
    {
      id: 'sc_02',
      sceneNumber: 2,
      title: 'Subterranean Terminal Breach',
      scriptText: scene2Script,
      duration: 6.5,
      characterIds: ['char_maya'],
      visualAsset: {
        id: 'vis_02',
        title: "Maya's Hacker Lair",
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: '02: Terminal Breach',
          prompt: 'Medium close-up of Maya Lin with glowing holographic screens and magenta AR visor, panicked tech bunker, flickering wires',
          style: 'cyberpunk',
          seed: 2841,
          characterNames: ['Maya Lin'],
          cameraPreset: 'zoom-in',
          palette: ['#ec4899', '#8b5cf6']
        }),
        metadata: {
          prompt: 'Medium close-up of Maya Lin with glowing holographic screens and magenta AR visor, panicked tech bunker, flickering wires',
          style: 'cyberpunk',
          seed: 2841,
          model: 'CGH Procedural Scene Renderer',
          cfgScale: 8.0,
          steps: 32,
          characterRefIds: ['char_maya'],
          timestamp: new Date().toISOString()
        }
      },
      animationPreset: 'zoom-in',
      lipSyncStatus: 'ready',
      cameraMoveDescription: 'Dramatic slow push-in on Maya as monitors flare.',
      visualStyle: 'cyberpunk',
      notes: 'HUD data reflection on visor.'
    },
    {
      id: 'sc_03',
      sceneNumber: 3,
      title: "Ren's Urgent Warning",
      scriptText: scene3Script,
      duration: 6.5,
      characterIds: ['char_ren', 'char_maya'],
      visualAsset: {
        id: 'vis_03',
        title: 'Blast Door Breach',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: "03: Ren's Warning",
          prompt: 'Two-shot low angle: Ren in doorway holding plasma blade yelling warning, Maya in foreground spinning in chair',
          style: 'cyberpunk',
          seed: 3952,
          characterNames: ['Ren Vance', 'Maya Lin'],
          cameraPreset: 'shake',
          palette: ['#06b6d4', '#ec4899']
        }),
        metadata: {
          prompt: 'Two-shot low angle: Ren in doorway holding plasma blade yelling warning, Maya in foreground spinning in chair',
          style: 'cyberpunk',
          seed: 3952,
          model: 'CGH Procedural Scene Renderer',
          cfgScale: 7.8,
          steps: 30,
          characterRefIds: ['char_ren', 'char_maya'],
          timestamp: new Date().toISOString()
        }
      },
      animationPreset: 'shake',
      lipSyncStatus: 'ready',
      cameraMoveDescription: 'Camera hand-held jitter and recoil as blast door slams.',
      visualStyle: 'cyberpunk',
      notes: 'Mouth sync aligned to audio peaks.'
    },
    {
      id: 'sc_04',
      sceneNumber: 4,
      title: 'Enforcer Ambush',
      scriptText: scene4Script,
      duration: 7,
      characterIds: ['char_enforcer'],
      visualAsset: {
        id: 'vis_04',
        title: 'Chrome Enforcers in Steam',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: '04: Enforcer Ambush',
          prompt: 'Menacing chrome cyborg enforcers emerging from steam vents, crimson optical lenses glowing, dark corridor ambush',
          style: 'cyberpunk',
          seed: 4104,
          characterNames: ['Chrome Enforcer'],
          cameraPreset: 'dolly-zoom',
          palette: ['#ef4444', '#71717a']
        }),
        metadata: {
          prompt: 'Menacing chrome cyborg enforcers emerging from steam vents, crimson optical lenses glowing, dark corridor ambush',
          style: 'cyberpunk',
          seed: 4104,
          model: 'CGH Procedural Scene Renderer',
          cfgScale: 8.2,
          steps: 35,
          characterRefIds: ['char_enforcer'],
          timestamp: new Date().toISOString()
        }
      },
      animationPreset: 'dolly-zoom',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Vertigo dolly zoom as danger escalates.',
      visualStyle: 'cyberpunk',
      notes: 'Steam particles backlit by red optics.'
    },
    {
      id: 'sc_05',
      sceneNumber: 5,
      title: 'EMP Detonation & Skyway Escape',
      scriptText: scene5Script,
      duration: 7,
      characterIds: ['char_ren', 'char_maya'],
      visualAsset: {
        id: 'vis_05',
        title: 'Skyway EMP Escape',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: '05: Skyway Escape',
          prompt: 'Wide action shot: magnetic shockwave exploding across city grid, two runners leaping onto supersonic monorail roof',
          style: 'cyberpunk',
          seed: 5218,
          characterNames: ['Ren Vance', 'Maya Lin'],
          cameraPreset: 'orbit',
          palette: ['#38bdf8', '#a855f7']
        }),
        metadata: {
          prompt: 'Wide action shot: magnetic shockwave exploding across city grid, two runners leaping onto supersonic monorail roof',
          style: 'cyberpunk',
          seed: 5218,
          model: 'CGH Procedural Scene Renderer',
          cfgScale: 8.0,
          steps: 32,
          characterRefIds: ['char_ren', 'char_maya'],
          timestamp: new Date().toISOString()
        }
      },
      animationPreset: 'orbit',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Dynamic 3D orbiting camera around shockwave apex.',
      visualStyle: 'cyberpunk',
      notes: 'Sparks and electric arcs along the rail.'
    }
  ];

  // Full raw script text
  const fullScript = scenes.map(s => `SCENE ${s.sceneNumber}: ${s.title.toUpperCase()}\n${s.scriptText}`).join('\n\n');

  // Master Audio Segments
  let cursor = 0;
  const audioSegments = scenes.map((sc) => {
    const seg = {
      id: `seg_${sc.id}`,
      sceneNumber: sc.sceneNumber,
      sceneId: sc.id,
      sourceIn: cursor,
      sourceOut: cursor + sc.duration,
      start: cursor,
      end: cursor + sc.duration,
      duration: sc.duration,
      title: `VO Scene ${sc.sceneNumber} - ${sc.title}`
    };
    cursor += sc.duration;
    return seg;
  });

  // Timeline Clips
  const clips: TimelineClip[] = [];
  let timePos = 0;

  scenes.forEach((sc, i) => {
    const dur = sc.duration;
    const seg = audioSegments[i];

    // 1. Scene track clip
    clips.push({
      id: `clip_sc_${sc.id}`,
      trackId: 'scene',
      sceneId: sc.id,
      title: `Scene ${sc.sceneNumber}: ${sc.title}`,
      start: timePos,
      duration: dur,
      sourceIn: 0,
      sourceOut: dur,
      volume: 100,
      fadeIn: 0.2,
      fadeOut: 0.2,
      color: '#6c5ce7'
    });

    // 2. Narration track clip
    clips.push({
      id: `clip_nar_${sc.id}`,
      trackId: 'narration',
      sceneId: sc.id,
      masterSegmentId: seg.id,
      audioMode: 'master',
      title: `🎙 VO_0${sc.sceneNumber}_Master.m4a`,
      start: timePos,
      duration: dur,
      sourceIn: seg.sourceIn,
      sourceOut: seg.sourceOut,
      volume: 100,
      fadeIn: 0.15,
      fadeOut: 0.2,
      color: '#06b6d4',
      waveform: sliceWaveform(masterWaveform, seg.sourceIn, dur, masterDuration)
    });

    // 3. Visuals track clip
    clips.push({
      id: `clip_vis_${sc.id}`,
      trackId: 'visuals',
      sceneId: sc.id,
      assetId: sc.visualAsset?.id,
      title: `🖼 ${sc.visualAsset?.title || 'Keyframe'}`,
      start: timePos,
      duration: dur,
      sourceIn: 0,
      sourceOut: dur,
      volume: 100,
      fadeIn: 0.4,
      fadeOut: 0.4,
      color: '#8b5cf6'
    });

    timePos += dur;
  });

  // Background Music track clip
  clips.push({
    id: 'clip_bg_music',
    trackId: 'music',
    title: '🎵 Cyber_Distortion_Pad_Loop.wav',
    start: 0,
    duration: 34,
    sourceIn: 0,
    sourceOut: 34,
    volume: 65,
    fadeIn: 1.5,
    fadeOut: 2.0,
    color: '#10b981',
    waveform: generateSpeechWaveform(120, 888)
  });

  // SFX track clips
  clips.push({
    id: 'clip_sfx_rain',
    trackId: 'sfx',
    title: '🔊 Thunder_Heavy_Rain.wav',
    start: 0,
    duration: 14,
    sourceIn: 0,
    sourceOut: 14,
    volume: 45,
    fadeIn: 0.5,
    fadeOut: 1.0,
    color: '#f59e0b',
    waveform: generateSpeechWaveform(60, 444)
  });

  clips.push({
    id: 'clip_sfx_emp',
    trackId: 'sfx',
    title: '🔊 EMP_Sub_Drop_Glitch.wav',
    start: 26,
    duration: 8,
    sourceIn: 0,
    sourceOut: 8,
    volume: 90,
    fadeIn: 0.1,
    fadeOut: 1.5,
    color: '#f59e0b',
    waveform: generateSpeechWaveform(40, 999)
  });

  // Assets Library
  const assets: MediaAsset[] = [
    {
      id: 'asset_audio_master',
      name: 'neo_tokyo_ep1_narration_master.m4a',
      type: 'audio',
      duration: 34,
      url: '#',
      size: '2.4 MB',
      tags: ['Voiceover', 'Master', 'Clean']
    },
    {
      id: 'asset_music_bg',
      name: 'Cyber_Distortion_Pad_Loop.wav',
      type: 'music',
      duration: 34,
      url: '#',
      size: '8.1 MB',
      tags: ['BGM', 'Synthwave', 'Atmosphere']
    },
    {
      id: 'asset_sfx_emp',
      name: 'EMP_Sub_Drop_Glitch.wav',
      type: 'sfx',
      duration: 8,
      url: '#',
      size: '1.2 MB',
      tags: ['SFX', 'Bass', 'Sci-Fi']
    }
  ];

  // AI Jobs Sample
  const aiJobs: AIJob[] = [
    {
      id: 'job_sample_01',
      type: 'image',
      title: 'Keyframe Generation: Scene 05',
      sceneId: 'sc_05',
      status: 'done',
      progress: 100,
      params: { prompt: 'Wide action shot skyway escape', style: 'cyberpunk' },
      createdAt: Date.now() - 120000,
      startedAt: Date.now() - 115000,
      completedAt: Date.now() - 110000
    },
    {
      id: 'job_sample_02',
      type: 'lip-sync',
      title: 'Audio-Driven Lip-Sync: Scene 02 Maya',
      sceneId: 'sc_02',
      characterId: 'char_maya',
      status: 'done',
      progress: 100,
      params: { audioClip: 'VO_02_Master.m4a', character: 'Maya Lin' },
      createdAt: Date.now() - 60000,
      startedAt: Date.now() - 55000,
      completedAt: Date.now() - 50000
    }
  ];

  return {
    id: 'proj_demo_neotokyo',
    name: 'Neo-Tokyo 2099: The Ghost Signal',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    settings: {
      resolution: '1080p',
      fps: 24,
      defaultStyle: 'cyberpunk',
      aspectRatio: '16:9'
    },
    script: fullScript,
    masterAudio: {
      fileName: 'neo_tokyo_ep1_narration_master.m4a',
      duration: masterDuration,
      waveformPoints: masterWaveform,
      segments: audioSegments
    },
    scenes,
    characters,
    assets,
    timeline: {
      clips,
      duration: 34
    },
    aiJobs
  };
}

export function loadProjectsFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultProj = createDefaultProject();
      saveProjectsToStorage([defaultProj]);
      setActiveProjectId(defaultProj.id);
      return [defaultProj];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaultProj = createDefaultProject();
      saveProjectsToStorage([defaultProj]);
      setActiveProjectId(defaultProj.id);
      return [defaultProj];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading projects from storage:', err);
    const defaultProj = createDefaultProject();
    return [defaultProj];
  }
}

export function saveProjectsToStorage(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_ID_KEY, id);
}

// Single Project Access Helpers (Requirement Phase 55)
export function loadProject(id: string): Project | null {
  const projects = loadProjectsFromStorage();
  return projects.find(p => p.id === id) || null;
}

export function saveProject(project: Project): void {
  const projects = loadProjectsFromStorage();
  const index = projects.findIndex(p => p.id === project.id);
  let next: Project[];
  if (index >= 0) {
    next = [...projects];
    next[index] = { ...project, updatedAt: Date.now() };
  } else {
    next = [...projects, { ...project, updatedAt: Date.now() }];
  }
  saveProjectsToStorage(next);
}

export function deleteProject(id: string): Project[] {
  const projects = loadProjectsFromStorage();
  const next = projects.filter(p => p.id !== id);
  saveProjectsToStorage(next);
  return next;
}

export function duplicateProject(id: string): Project | null {
  const projects = loadProjectsFromStorage();
  const source = projects.find(p => p.id === id);
  if (!source) return null;

  const duplicated: Project = {
    ...JSON.parse(JSON.stringify(source)),
    id: `proj_${Date.now()}`,
    name: `${source.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const next = [...projects, duplicated];
  saveProjectsToStorage(next);
  return duplicated;
}
