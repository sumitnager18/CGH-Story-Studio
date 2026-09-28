// Mock AI Providers for browser prototype
// Requirement Phase 49, 50, 51: Explicitly labeled as CGH Prototype Generated Artwork

import { IImageProvider, IAnimationProvider, ILipSyncProvider, ImageGenerationParams, AnimationParams, LipSyncParams, ProviderProgressCallback } from './types';
import { generateSceneArtwork } from '../utils/artworkGenerator';

export class CGHMockImageProvider implements IImageProvider {
  name = 'CGH Prototype Image Provider';

  async generateArtwork(params: ImageGenerationParams, onProgress?: ProviderProgressCallback): Promise<string> {
    onProgress?.(25, 'Synthesizing scene prompt semantic graph…');
    await new Promise(r => setTimeout(r, 400));
    onProgress?.(65, 'Rendering vector composition layers…');
    await new Promise(r => setTimeout(r, 450));
    onProgress?.(95, 'Refining volumetric lighting & color temperature…');
    await new Promise(r => setTimeout(r, 300));
    onProgress?.(100, 'CGH Prototype Generated Artwork ready');

    return generateSceneArtwork({
      title: 'AI Concept Keyframe',
      prompt: params.prompt,
      style: params.style,
      seed: params.seed,
      characterNames: params.characterNames
    });
  }
}

export class CGHMockAnimationProvider implements IAnimationProvider {
  name = 'CGH Prototype Animation Provider';

  async animateKeyframe(params: AnimationParams, onProgress?: ProviderProgressCallback): Promise<{ cameraMoveDescription: string }> {
    onProgress?.(30, 'Calculating camera trajectory spline…');
    await new Promise(r => setTimeout(r, 350));
    onProgress?.(70, 'Interpolating perspective depth matrices…');
    await new Promise(r => setTimeout(r, 400));
    onProgress?.(100, 'Motion simulation active');

    const descriptions: Record<string, string> = {
      'pan-left': 'Smooth horizontal camera drift panning left (1.2m/s)',
      'pan-right': 'Cinematic horizontal pan gliding right with subtle parallax',
      'zoom-in': 'Slow dramatic camera push-in focusing on subject',
      'zoom-out': 'Wide pull-back revealing scale of environment',
      'orbit': 'Dynamic 45-degree orbital pan around key focal point',
      'shake': 'High-intensity action kinetic camera shake vibration',
      'dolly-zoom': 'Vertigo dolly zoom compressing background perspective',
      'none': 'Static lock-off cinematic framing'
    };

    return {
      cameraMoveDescription: descriptions[params.preset] || 'Custom animated camera motion'
    };
  }
}

export class CGHMockLipSyncProvider implements ILipSyncProvider {
  name = 'CGH Prototype Lip-Sync Provider';

  async generatePhonemes(params: LipSyncParams, onProgress?: ProviderProgressCallback): Promise<{ visemeCount: number }> {
    onProgress?.(30, 'Analyzing audio waveform phoneme cadence…');
    await new Promise(r => setTimeout(r, 350));
    onProgress?.(75, 'Aligning facial visemes (AA, EE, OO, MM, FF)…');
    await new Promise(r => setTimeout(r, 400));
    onProgress?.(100, 'Lip-sync visemes synchronized');

    return {
      visemeCount: 48
    };
  }
}

export const mockImageProvider = new CGHMockImageProvider();
export const mockAnimationProvider = new CGHMockAnimationProvider();
export const mockLipSyncProvider = new CGHMockLipSyncProvider();
