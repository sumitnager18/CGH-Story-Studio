export type ResolutionPreset = '1080p' | '4K' | '720p' | '9:16';
export type FrameRatePreset = 24 | 30 | 60;
export type ArtStyle = 'anime' | 'cartoon' | 'realistic' | '3D' | 'comic' | 'cyberpunk' | 'oil-painting';
export type CameraPreset = 'none' | 'pan-left' | 'pan-right' | 'zoom-in' | 'zoom-out' | 'orbit' | 'shake' | 'dolly-zoom';
export type LipSyncStatus = 'none' | 'queued' | 'processing' | 'ready';

export interface VisualMetadata {
  prompt: string;
  negativePrompt?: string;
  style: ArtStyle;
  seed: number;
  model: string;
  cfgScale: number;
  steps: number;
  characterRefIds: string[];
  timestamp: string;
}

export interface VisualAsset {
  id: string;
  title: string;
  imageUrl: string; // SVG data uri or high-quality illustration
  thumbnailUrl?: string;
  aspectRatio: string;
  metadata?: VisualMetadata;
}

export interface Character {
  id: string;
  name: string;
  role?: string;
  age: string;
  bodyFaceHair: string;
  clothing: string;
  palette: string[]; // hex codes
  artStyle: ArtStyle;
  referenceImage: string; // SVG avatar data URL or color avatar
  consistencyScore: number; // 0 - 100
  notes: string;
}

export type AudioSourceMode = 'master' | 'scene' | 'mixed' | 'custom';

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  scriptText: string;
  duration: number; // in seconds
  characterIds: string[];
  visualAsset: VisualAsset | null;
  animationPreset: CameraPreset;
  lipSyncStatus: LipSyncStatus;
  cameraMoveDescription: string;
  visualStyle: ArtStyle;
  notes: string;
  audioMode?: AudioSourceMode;
  customAudioName?: string;
  customAudioDuration?: number;
}

export type TrackType = 'scene' | 'narration' | 'visuals' | 'music' | 'sfx';

export interface Track {
  id: TrackType;
  label: string;
  icon: string;
  height: number;
  muted?: boolean;
  solo?: boolean;
}

export interface TimelineClip {
  id: string;
  trackId: TrackType;
  sceneId?: string;
  assetId?: string;
  masterSegmentId?: string;
  audioMode?: AudioSourceMode;
  title: string;
  start: number; // in seconds
  duration: number; // in seconds
  sourceIn: number;
  sourceOut: number;
  volume: number; // 0 - 100
  fadeIn: number; // in seconds
  fadeOut: number; // in seconds
  color?: string;
  waveform?: number[]; // for audio tracks
  /** Open-source interchange/media reference metadata. */
  sourceKind?: 'generated' | 'library' | 'local' | 'external';
  localAssetId?: string;
  sourceUri?: string;
}

export type AIJobType = 'image' | 'video' | 'lip-sync' | 'audio-split';
export type AIJobStatus = 'queued' | 'running' | 'done' | 'failed';

export interface AIJob {
  id: string;
  type: AIJobType;
  title: string;
  sceneId?: string;
  characterId?: string;
  status: AIJobStatus;
  progress: number; // 0 - 100
  params: any;
  result?: any;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  errorMessage?: string;
}

export interface MasterAudioSegment {
  id: string;
  sceneNumber: number;
  sceneId?: string;
  sourceIn: number;
  sourceOut: number;
  start: number; // for backward compatibility
  end: number;   // for backward compatibility
  duration: number;
  title: string;
}

export interface MasterAudioData {
  fileName: string;
  duration: number; // in seconds
  waveformPoints: number[]; // normalized 0..1
  audioBlobUrl?: string;
  segments: MasterAudioSegment[];
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'audio' | 'image' | 'sfx' | 'music';
  duration?: number;
  url: string;
  size?: string;
  tags?: string[];
}

export interface ProjectSettings {
  resolution: ResolutionPreset;
  fps: FrameRatePreset;
  defaultStyle: ArtStyle;
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: ProjectSettings;
  script: string;
  masterAudio: MasterAudioData | null;
  scenes: Scene[];
  characters: Character[];
  assets: MediaAsset[];
  timeline: {
    clips: TimelineClip[];
    duration: number; // computed or manual
  };
  aiJobs: AIJob[];
}

export type SelectionType = 'scene' | 'character' | 'clip' | 'project';

export interface SelectedItem {
  type: SelectionType;
  id: string;
}

export interface CommandHistoryEntry {
  id: string;
  label: string;
  timestamp: number;
}
