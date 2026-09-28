/**
 * Audio synthesis and waveform generation utilities for CGH Story Studio
 * Requirement Phase 22 & 25: Unified deterministic waveform generation & HTMLAudioElement playback.
 * NO oscillator beeps pretending to be narration!
 */

export {
  generateMockWaveform,
  sliceWaveformBySourceRange,
  resampleWaveformForWidth
} from '../domain/audioEngine';

import { generateMockWaveform, sliceWaveformBySourceRange } from '../domain/audioEngine';

export const generateSpeechWaveform = generateMockWaveform;
export const sliceWaveform = sliceWaveformBySourceRange;

class PrototypeAudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;

  public playBlobOrFile(url: string, onEnded?: () => void): boolean {
    try {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement = null;
      }
      this.currentUrl = url;
      this.audioElement = new Audio(url);
      if (onEnded) {
        this.audioElement.onended = onEnded;
      }
      this.audioElement.play().catch(e => {
        console.warn('[CGH Audio Engine] Playback deferred by browser policy:', e);
      });
      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
  }

  // Phase 22: Simulated transport clock only (no oscillator beeping)
  public playTimelineTick(_time: number, _isNarration: boolean = true) {
    // Pure simulated transport clock - no fake audio beeps
  }

  public playNarrationBeep(_frequency = 220, _duration = 0.15, _volume = 0.1) {
    // Phase 22: Fake beeps removed per specification
  }
}

export const studioAudio = new PrototypeAudioPlayer();
