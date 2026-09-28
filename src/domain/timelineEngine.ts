// Timeline Domain Engine — Single Source of Truth for timeline coordinates,
// sequence reflow, clip trimming, splitting, and scene duration linkage.

import { Scene, TimelineClip, TrackType, MasterAudioData } from '../types';
import { sliceWaveformBySourceRange } from './audioEngine';

// Minimum scene duration in seconds (Requirement Phase 5)
export const MIN_SCENE_DURATION = 2.0;

export {
  timeToPixels,
  pixelsToTime,
  snapTimeToGrid,
  DEFAULT_SNAP_INTERVAL
} from './timelineCoordinates';

export interface ReflowResult {
  clips: TimelineClip[];
  totalDuration: number;
}

// Phase 4: Authoritative sequence reflow for scenes, visual clips, and narration clips.
// When any scene duration changes or scenes are reordered, this recalculates all sequence-anchored
// clips sequentially while preserving independent music and SFX clips.
// CRITICAL: Preserves multiple narration clips per scene (e.g. from Split) without collapsing.
export function reflowTimelineForScenes(
  scenes: Scene[],
  existingClips: TimelineClip[],
  masterAudio?: MasterAudioData | null
): ReflowResult {
  let timeCursor = 0;
  const sequenceClips: TimelineClip[] = [];
  const independentClips: TimelineClip[] = [];

  // Group existing clips by sceneId and trackId
  const sceneClipsMap = new Map<string, TimelineClip>();
  const visualClipsMap = new Map<string, TimelineClip[]>();
  const narrationClipsMap = new Map<string, TimelineClip[]>();

  for (const clip of existingClips) {
    if (clip.sceneId) {
      if (clip.trackId === 'scene') {
        sceneClipsMap.set(clip.sceneId, clip);
      } else if (clip.trackId === 'visuals') {
        const list = visualClipsMap.get(clip.sceneId) || [];
        list.push(clip);
        visualClipsMap.set(clip.sceneId, list);
      } else if (clip.trackId === 'narration') {
        const list = narrationClipsMap.get(clip.sceneId) || [];
        list.push(clip);
        narrationClipsMap.set(clip.sceneId, list);
      } else {
        independentClips.push(clip);
      }
    } else if (clip.trackId === 'music' || clip.trackId === 'sfx') {
      independentClips.push(clip);
    }
  }

  // Reflow sequence clips for each scene
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const sceneDuration = Math.max(MIN_SCENE_DURATION, parseFloat(scene.duration.toFixed(2)));
    const sceneStart = parseFloat(timeCursor.toFixed(2));
    const sceneNum = scene.sceneNumber || (i + 1);

    // 1. Scene Track Clip (Exactly one per scene)
    const existingSceneClip = sceneClipsMap.get(scene.id);
    sequenceClips.push({
      id: existingSceneClip?.id || `clip_sc_${scene.id}`,
      trackId: 'scene',
      sceneId: scene.id,
      title: `Scene 0${sceneNum}: ${scene.title}`,
      start: sceneStart,
      duration: sceneDuration,
      sourceIn: 0,
      sourceOut: sceneDuration,
      volume: 100,
      fadeIn: 0.1,
      fadeOut: 0.1,
      color: '#6c5ce7'
    });

    // 2. Visuals Track Clip(s)
    const existingVisClips = visualClipsMap.get(scene.id) || [];
    if (existingVisClips.length > 0) {
      // Preserve existing visual clip attributes
      const primaryVis = existingVisClips[0];
      sequenceClips.push({
        ...primaryVis,
        start: sceneStart,
        duration: sceneDuration,
        sourceIn: 0,
        sourceOut: sceneDuration,
        title: primaryVis.title || `🖼 ${scene.title}`
      });
    } else {
      sequenceClips.push({
        id: `clip_vis_${scene.id}`,
        trackId: 'visuals',
        sceneId: scene.id,
        assetId: scene.visualAsset?.id,
        title: `🖼 ${scene.title}`,
        start: sceneStart,
        duration: sceneDuration,
        sourceIn: 0,
        sourceOut: sceneDuration,
        volume: 100,
        fadeIn: 0.2,
        fadeOut: 0.2,
        color: '#8b5cf6'
      });
    }

    // 3. Narration Track Clip(s)
    // CRITICAL (Requirements 4, 5, 6): Preserve ALL narration clips for this scene.
    // Do NOT collapse Part 1 + Part 2 back into one clip!
    // Do NOT recalculate sourceIn from sceneStart!
    const existingNarClips = narrationClipsMap.get(scene.id) || [];

    if (existingNarClips.length > 0) {
      // Sort existing narration clips by start time to maintain sequence
      existingNarClips.sort((a, b) => a.start - b.start);

      if (existingNarClips.length === 1) {
        // Single narration clip: adjust timeline start, keep source ranges & custom audio
        const narClip = existingNarClips[0];
        const isMaster = narClip.audioMode === 'master' || (masterAudio && narClip.masterSegmentId);
        
        let narDuration = narClip.duration;
        let sourceOut = narClip.sourceOut;

        // If scene duration was modified and narration was matched to scene duration
        if (Math.abs(narClip.duration - sceneDuration) > 0.05 && isMaster) {
          narDuration = sceneDuration;
          sourceOut = parseFloat((narClip.sourceIn + sceneDuration).toFixed(2));
        }

        let waveform = narClip.waveform;
        if (isMaster && masterAudio?.waveformPoints && masterAudio.waveformPoints.length > 0) {
          waveform = sliceWaveformBySourceRange(
            masterAudio.waveformPoints,
            narClip.sourceIn,
            sourceOut,
            masterAudio.duration
          );
        }

        sequenceClips.push({
          ...narClip,
          start: sceneStart,
          duration: narDuration,
          sourceIn: narClip.sourceIn,
          sourceOut: sourceOut,
          waveform
        });
      } else {
        // MULTIPLE narration clips (e.g. from Split): preserve all segments consecutively!
        let subCursor = sceneStart;
        for (const narClip of existingNarClips) {
          const clipDur = parseFloat(narClip.duration.toFixed(2));
          sequenceClips.push({
            ...narClip,
            start: parseFloat(subCursor.toFixed(2)),
            duration: clipDur,
            sourceIn: narClip.sourceIn,
            sourceOut: narClip.sourceOut,
            waveform: narClip.waveform
          });
          subCursor += clipDur;
        }
      }
    } else {
      // No existing narration clip: generate from master segment or default
      const seg = masterAudio?.segments.find(s => s.sceneId === scene.id || s.sceneNumber === sceneNum);
      const srcIn = seg ? seg.sourceIn : 0;
      const srcOut = seg ? seg.sourceOut : sceneDuration;

      let waveform: number[] | undefined = undefined;
      if (masterAudio && masterAudio.waveformPoints && masterAudio.waveformPoints.length > 0) {
        waveform = sliceWaveformBySourceRange(
          masterAudio.waveformPoints,
          srcIn,
          srcOut,
          masterAudio.duration || (srcIn + sceneDuration)
        );
      }

      sequenceClips.push({
        id: `clip_nar_${scene.id}`,
        trackId: 'narration',
        sceneId: scene.id,
        masterSegmentId: seg?.id,
        audioMode: seg ? 'master' : 'scene',
        title: `🎙 VO_0${sceneNum}.m4a`,
        start: sceneStart,
        duration: sceneDuration,
        sourceIn: srcIn,
        sourceOut: srcOut,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.15,
        color: '#06b6d4',
        waveform
      });
    }

    timeCursor += sceneDuration;
  }

  // Calculate total timeline duration: must encompass all scenes and any trailing music/SFX
  let maxClipEnd = timeCursor;
  for (const c of independentClips) {
    const end = c.start + c.duration;
    if (end > maxClipEnd) {
      maxClipEnd = end;
    }
  }

  const totalDuration = parseFloat(Math.max(15, maxClipEnd).toFixed(2));
  const allClips = [...sequenceClips, ...independentClips];

  return {
    clips: allClips,
    totalDuration
  };
}

// Phase 5: Direct manipulation scene resize.
// When user drags right edge of a scene clip, this validates duration and reflows downstream scenes.
export function resizeSceneDuration(
  scenes: Scene[],
  clips: TimelineClip[],
  sceneId: string,
  newDuration: number,
  masterAudio?: MasterAudioData | null
): { scenes: Scene[]; clips: TimelineClip[]; totalDuration: number } {
  // Reject negative, zero, NaN, Infinity or sub-minimum durations (Requirement Phase 5)
  if (!Number.isFinite(newDuration) || newDuration < MIN_SCENE_DURATION) {
    newDuration = MIN_SCENE_DURATION;
  }
  newDuration = parseFloat(newDuration.toFixed(2));

  const updatedScenes = scenes.map(s => {
    if (s.id === sceneId) {
      return { ...s, duration: newDuration };
    }
    return s;
  });

  const reflow = reflowTimelineForScenes(updatedScenes, clips, masterAudio);

  return {
    scenes: updatedScenes,
    clips: reflow.clips,
    totalDuration: reflow.totalDuration
  };
}

// Phase 13: Split timeline clip at current playhead position
// Decouples source ranges: Part 1 (sourceIn A -> B), Part 2 (sourceIn B -> C)
export function splitClipAtTime(
  clips: TimelineClip[],
  clipId: string,
  splitTime: number
): TimelineClip[] | null {
  const clipToSplit = clips.find(c => c.id === clipId);
  if (!clipToSplit) return null;

  // Split must fall strictly inside clip boundaries
  if (splitTime <= clipToSplit.start + 0.2 || splitTime >= clipToSplit.start + clipToSplit.duration - 0.2) {
    return null;
  }

  const firstDuration = parseFloat((splitTime - clipToSplit.start).toFixed(2));
  const secondDuration = parseFloat((clipToSplit.duration - firstDuration).toFixed(2));

  // Decoupled source split point: B = sourceIn + firstDuration
  const splitSourcePoint = parseFloat((clipToSplit.sourceIn + firstDuration).toFixed(2));

  // Slice waveform points proportionally
  let firstWaveform: number[] | undefined = undefined;
  let secondWaveform: number[] | undefined = undefined;
  if (clipToSplit.waveform && clipToSplit.waveform.length > 0) {
    const ratio = Math.max(0.1, Math.min(0.9, firstDuration / clipToSplit.duration));
    const splitIndex = Math.max(1, Math.floor(ratio * clipToSplit.waveform.length));
    firstWaveform = clipToSplit.waveform.slice(0, splitIndex);
    secondWaveform = clipToSplit.waveform.slice(splitIndex);
  }

  const firstPart: TimelineClip = {
    ...clipToSplit,
    duration: firstDuration,
    sourceIn: clipToSplit.sourceIn,
    sourceOut: splitSourcePoint,
    waveform: firstWaveform
  };

  const secondPart: TimelineClip = {
    ...clipToSplit,
    id: `clip_${Date.now()}_split_${Math.random().toString(36).substring(2, 6)}`,
    title: `${clipToSplit.title.replace(/\s*\(Part \d+\)$/, '')} (Part 2)`,
    start: parseFloat(splitTime.toFixed(2)),
    duration: secondDuration,
    sourceIn: splitSourcePoint,
    sourceOut: clipToSplit.sourceOut,
    waveform: secondWaveform
  };

  return clips.map(c => c.id === clipId ? firstPart : c).concat(secondPart);
}

// Phase 10 & 11: Move clip with semantic track rules enforcement
// Track Rules:
// Scenes -> scene track only
// Narration -> narration track only
// Visuals -> visuals track only
// Music -> music track only
// SFX -> sfx track only
export function moveTimelineClip(
  clips: TimelineClip[],
  clipId: string,
  newStart: number,
  targetTrackId?: TrackType
): TimelineClip[] {
  const target = clips.find(c => c.id === clipId);
  if (!target) return clips;

  const validStart = Math.max(0, parseFloat(newStart.toFixed(2)));

  // Semantic Track Enforcement (Requirement 13):
  // Prevent arbitrary track cross-assignment
  if (targetTrackId && targetTrackId !== target.trackId) {
    // Reject cross-track assignment
    return clips;
  }

  return clips.map(c => {
    if (c.id === clipId) {
      return {
        ...c,
        start: validStart
      };
    }
    return c;
  });
}

// Phase 10: Trim independent clip
export function trimIndependentClip(
  clips: TimelineClip[],
  clipId: string,
  newStart: number,
  newDuration: number
): TimelineClip[] {
  const validStart = Math.max(0, parseFloat(newStart.toFixed(2)));
  const validDuration = Math.max(0.5, parseFloat(newDuration.toFixed(2)));

  return clips.map(c => {
    if (c.id === clipId) {
      return {
        ...c,
        start: validStart,
        duration: validDuration,
        sourceOut: parseFloat((c.sourceIn + validDuration).toFixed(2))
      };
    }
    return c;
  });
}

// Phase 14: Delete clip with explicit semantic rules (Requirement 12)
// Delete Scene clip: deletes scene entity and linked sequence clips, reflows later scenes.
// Delete Narration clip: deletes narration clip only!
// Delete Visual clip: deletes visual clip only!
// Delete Music/SFX clip: deletes audio clip only!
export function deleteTimelineClip(
  scenes: Scene[],
  clips: TimelineClip[],
  clipId: string,
  masterAudio?: MasterAudioData | null
): { scenes: Scene[]; clips: TimelineClip[]; totalDuration: number } {
  const target = clips.find(c => c.id === clipId);
  if (!target) {
    return { scenes, clips, totalDuration: 15 };
  }

  // 1. Explicit Semantics: Delete Scene Clip
  // Only deleting a clip on the 'scene' track deletes the scene and reflows downstream scenes
  if (target.trackId === 'scene' && target.sceneId) {
    const remainingScenes = scenes
      .filter(s => s.id !== target.sceneId)
      .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));

    const remainingClips = clips.filter(c => c.sceneId !== target.sceneId);
    const reflow = reflowTimelineForScenes(remainingScenes, remainingClips, masterAudio);

    return {
      scenes: remainingScenes,
      clips: reflow.clips,
      totalDuration: reflow.totalDuration
    };
  }

  // 2. Explicit Semantics: Delete Narration Clip, Visual Clip, or Independent Clip
  // Deletes the clip ONLY, leaving the Scene object and other sequence clips intact!
  const remainingClips = clips.filter(c => c.id !== clipId);
  let maxEnd = 0;
  for (const c of remainingClips) {
    if (c.start + c.duration > maxEnd) {
      maxEnd = c.start + c.duration;
    }
  }

  return {
    scenes,
    clips: remainingClips,
    totalDuration: Math.max(15, parseFloat(maxEnd.toFixed(2)))
  };
}
