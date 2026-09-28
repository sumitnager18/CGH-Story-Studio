// Provider Interfaces for AI operations (Image generation, Motion animation, Lip-Sync)
// Requirement Phase 49 & 50

import { ArtStyle, CameraPreset } from '../types';

export interface ImageGenerationParams {
  prompt: string;
  style: ArtStyle;
  seed: number;
  characterNames: string[];
  cfgScale?: number;
  steps?: number;
}

export interface AnimationParams {
  preset: CameraPreset;
  durationSeconds: number;
}

export interface LipSyncParams {
  audioClipId?: string;
  phonemeCadence?: string[];
}

export interface ProviderProgressCallback {
  (progressPercent: number, stageMessage: string): void;
}

export interface IImageProvider {
  name: string;
  generateArtwork(params: ImageGenerationParams, onProgress?: ProviderProgressCallback): Promise<string>;
}

export interface IAnimationProvider {
  name: string;
  animateKeyframe(params: AnimationParams, onProgress?: ProviderProgressCallback): Promise<{ cameraMoveDescription: string }>;
}

export interface ILipSyncProvider {
  name: string;
  generatePhonemes(params: LipSyncParams, onProgress?: ProviderProgressCallback): Promise<{ visemeCount: number }>;
}
