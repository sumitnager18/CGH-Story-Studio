// Audio Domain Engine — Authoritative master audio handling, waveform slicing,
// scene narration segments, and mixed-mode overrides.

import { Project, MasterAudioData, TimelineClip } from '../types';

// Phase 25: Deterministic shared waveform generator
export function generateMockWaveform(points: number = 160, seed: number = 42): number[] {
  const result: number[] = [];
  let s = (Math.abs(seed) * 1664525 + 1013904223) >>> 0;
  const rng = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  for (let i = 0; i < points; i++) {
    // Produce human speech-like burst cadence (syllables, pauses)
    const base = Math.sin(i * 0.12) * 0.25 + 0.35;
    const burst = rng() > 0.3 ? rng() * 0.55 : 0.05;
    const envelope = Math.sin((i / points) * Math.PI);
    const value = Math.max(0.05, Math.min(0.98, (base + burst) * envelope));
    result.push(parseFloat(value.toFixed(2)));
  }

  return result;
}

// Slice waveform according to source range (Phase 25)
export function sliceWaveformBySourceRange(
  waveform: number[],
  sourceInSeconds: number,
  sourceOutSeconds: number,
  totalSourceDurationSeconds: number
): number[] {
  if (!waveform || waveform.length === 0) {
    return generateMockWaveform(24, Math.floor(sourceInSeconds * 100));
  }

  const safeTotal = Math.max(1, totalSourceDurationSeconds);
  const startRatio = Math.max(0, Math.min(1, sourceInSeconds / safeTotal));
  const endRatio = Math.max(startRatio, Math.min(1, sourceOutSeconds / safeTotal));

  const startIdx = Math.floor(startRatio * waveform.length);
  const endIdx = Math.max(startIdx + 4, Math.ceil(endRatio * waveform.length));

  const slice = waveform.slice(startIdx, endIdx);
  if (slice.length === 0) {
    return generateMockWaveform(20, Math.floor(sourceInSeconds * 10));
  }

  return slice;
}

// Resample waveform into target bar count for rendering
export function resampleWaveformForWidth(waveform: number[], targetBars: number): number[] {
  if (waveform.length === targetBars) return waveform;
  if (waveform.length === 0) return Array(targetBars).fill(0.3);

  const resampled: number[] = [];
  const step = waveform.length / targetBars;

  for (let i = 0; i < targetBars; i++) {
    const start = Math.floor(i * step);
    const end = Math.min(waveform.length, Math.floor((i + 1) * step));
    let sum = 0;
    let count = 0;

    for (let j = start; j < end; j++) {
      sum += waveform[j];
      count++;
    }

    const avg = count > 0 ? sum / count : waveform[start] || 0.3;
    resampled.push(parseFloat(avg.toFixed(2)));
  }

  return resampled;
}

// Phase 16 & 17: Import Master Audio
export function importMasterAudio(
  project: Project,
  fileName: string,
  durationSeconds?: number,
  audioBlobUrl?: string
): Project {
  const dur = durationSeconds && durationSeconds > 0 ? durationSeconds : 36;
  const waveform = generateMockWaveform(200, Math.floor(dur * 7));

  // Build segments matching current scene sequence with decoupled source ranges
  let srcCursor = 0;
  const segments = project.scenes.map((scene) => {
    const segDur = scene.duration;
    const seg = {
      id: `seg_${scene.id}`,
      sceneNumber: scene.sceneNumber,
      sceneId: scene.id,
      sourceIn: srcCursor,
      sourceOut: srcCursor + segDur,
      start: srcCursor,
      end: srcCursor + segDur,
      duration: segDur,
      title: `VO Scene 0${scene.sceneNumber}: ${scene.title}`
    };
    srcCursor += segDur;
    return seg;
  });

  const masterAudio: MasterAudioData = {
    fileName,
    duration: dur,
    waveformPoints: waveform,
    audioBlobUrl,
    segments
  };

  // Synchronize Narration Timeline Clips (Phase 18)
  const nonNarrationClips = project.timeline.clips.filter(c => c.trackId !== 'narration');
  const narrationClips: TimelineClip[] = [];
  let timelinePos = 0;

  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i];
    const seg = segments[i];
    const sceneDur = scene.duration;

    narrationClips.push({
      id: `clip_nar_${scene.id}`,
      trackId: 'narration',
      sceneId: scene.id,
      masterSegmentId: seg.id,
      audioMode: 'master',
      title: `🎙 ${fileName} [0${scene.sceneNumber}]`,
      start: timelinePos,
      duration: sceneDur,
      sourceIn: seg.sourceIn,
      sourceOut: seg.sourceOut,
      volume: 100,
      fadeIn: 0.1,
      fadeOut: 0.15,
      color: '#06b6d4',
      waveform: sliceWaveformBySourceRange(waveform, seg.sourceIn, seg.sourceOut, dur)
    });
    timelinePos += sceneDur;
  }

  // Update scenes audioMode to master
  const updatedScenes = project.scenes.map(s => ({
    ...s,
    audioMode: 'master' as const,
    customAudioName: undefined,
    customAudioDuration: undefined
  }));

  return {
    ...project,
    masterAudio,
    scenes: updatedScenes,
    timeline: {
      ...project.timeline,
      clips: [...narrationClips, ...nonNarrationClips]
    },
    updatedAt: Date.now()
  };
}

// Phase 18: Map Master Audio to Scene Segments
export function mapMasterAudioToScenes(project: Project): Project {
  if (!project.masterAudio) return project;

  const masterDur = project.masterAudio.duration;
  const waveform = project.masterAudio.waveformPoints;
  const totalSceneCount = project.scenes.length;
  if (totalSceneCount === 0) return project;

  // Generate persistent AudioSegment objects
  let srcCursor = 0;
  const segments = project.scenes.map((scene) => {
    const segDur = scene.duration;
    const seg = {
      id: `seg_${scene.id}`,
      sceneNumber: scene.sceneNumber,
      sceneId: scene.id,
      sourceIn: srcCursor,
      sourceOut: srcCursor + segDur,
      start: srcCursor,
      end: srcCursor + segDur,
      duration: segDur,
      title: `VO Scene 0${scene.sceneNumber}: ${scene.title}`
    };
    srcCursor += segDur;
    return seg;
  });

  const updatedMasterAudio: MasterAudioData = {
    ...project.masterAudio,
    segments
  };

  // Calculate sequential timeline start positions for all scenes
  let timeCursor = 0;
  const sceneTimelineStarts = new Map<string, number>();
  for (const scene of project.scenes) {
    sceneTimelineStarts.set(scene.id, parseFloat(timeCursor.toFixed(2)));
    timeCursor += scene.duration;
  }

  // Count narration clips per scene to handle single vs split clips
  const narrationClipsByScene = new Map<string, TimelineClip[]>();
  for (const clip of project.timeline.clips) {
    if (clip.trackId === 'narration' && clip.sceneId) {
      const list = narrationClipsByScene.get(clip.sceneId) || [];
      list.push(clip);
      narrationClipsByScene.set(clip.sceneId, list);
    }
  }

  const updatedClips = project.timeline.clips.map(clip => {
    if (clip.trackId === 'narration' && clip.sceneId) {
      const seg = segments.find(s => s.sceneId === clip.sceneId);
      const scene = project.scenes.find(s => s.id === clip.sceneId);
      const sceneStart = sceneTimelineStarts.get(clip.sceneId) ?? 0;
      const clipsForThisScene = narrationClipsByScene.get(clip.sceneId) || [];

      if (seg && scene) {
        // If this scene has multiple clips (e.g. user split narration), preserve the relative sub-offsets
        if (clipsForThisScene.length > 1) {
          const subOffset = Math.max(0, clip.start - (clipsForThisScene[0]?.start ?? sceneStart));
          return {
            ...clip,
            masterSegmentId: seg.id,
            audioMode: 'master' as const,
            start: parseFloat((sceneStart + subOffset).toFixed(2)),
            duration: clip.duration,
            sourceIn: clip.sourceIn,
            sourceOut: clip.sourceOut,
            waveform: sliceWaveformBySourceRange(waveform, clip.sourceIn, clip.sourceOut, masterDur)
          };
        }

        return {
          ...clip,
          masterSegmentId: seg.id,
          audioMode: 'master' as const,
          start: sceneStart,
          duration: scene.duration,
          sourceIn: seg.sourceIn,
          sourceOut: seg.sourceOut,
          title: `🎙 ${project.masterAudio?.fileName || 'Master_VO'} [0${scene.sceneNumber}]`,
          waveform: sliceWaveformBySourceRange(waveform, seg.sourceIn, seg.sourceOut, masterDur)
        };
      }
    }
    return clip;
  });

  return {
    ...project,
    masterAudio: updatedMasterAudio,
    timeline: {
      ...project.timeline,
      clips: updatedClips
    },
    updatedAt: Date.now()
  };
}

// Phase 19 & 20: Scene Audio Override / Restore Master Audio
export function replaceSceneAudio(
  project: Project,
  sceneId: string,
  fileName: string,
  durationSeconds: number,
  blobUrl?: string
): Project {
  const scene = project.scenes.find(s => s.id === sceneId);
  if (!scene) return project;

  const customWaveform = generateMockWaveform(40, Math.floor(durationSeconds * 13));

  const updatedClips = project.timeline.clips.map(clip => {
    if (clip.trackId === 'narration' && clip.sceneId === sceneId) {
      return {
        ...clip,
        audioMode: 'custom' as const,
        title: `🎙 ${fileName} (Custom VO)`,
        sourceIn: 0,
        sourceOut: durationSeconds,
        duration: durationSeconds,
        waveform: customWaveform
      };
    }
    return clip;
  });

  const updatedScenes = project.scenes.map(s => {
    if (s.id === sceneId) {
      return {
        ...s,
        audioMode: 'custom' as const,
        customAudioName: fileName,
        customAudioDuration: durationSeconds
      };
    }
    return s;
  });

  return {
    ...project,
    scenes: updatedScenes,
    timeline: {
      ...project.timeline,
      clips: updatedClips
    },
    updatedAt: Date.now()
  };
}

export function restoreMasterAudioForScene(project: Project, sceneId: string): Project {
  if (!project.masterAudio) return project;

  const scene = project.scenes.find(s => s.id === sceneId);
  if (!scene) return project;

  const master = project.masterAudio;
  const seg = master.segments.find(s => s.sceneId === sceneId || s.sceneNumber === scene.sceneNumber);
  const srcIn = seg ? seg.sourceIn : 0;
  const srcOut = seg ? seg.sourceOut : scene.duration;

  const updatedClips = project.timeline.clips.map(clip => {
    if (clip.trackId === 'narration' && clip.sceneId === sceneId) {
      return {
        ...clip,
        masterSegmentId: seg?.id,
        audioMode: 'master' as const,
        title: `🎙 ${master.fileName} [0${scene.sceneNumber}]`,
        sourceIn: srcIn,
        sourceOut: srcOut,
        duration: scene.duration,
        waveform: sliceWaveformBySourceRange(master.waveformPoints, srcIn, srcOut, master.duration)
      };
    }
    return clip;
  });

  const updatedScenes = project.scenes.map(s => {
    if (s.id === sceneId) {
      return {
        ...s,
        audioMode: 'master' as const,
        customAudioName: undefined,
        customAudioDuration: undefined
      };
    }
    return s;
  });

  return {
    ...project,
    scenes: updatedScenes,
    timeline: {
      ...project.timeline,
      clips: updatedClips
    },
    updatedAt: Date.now()
  };
}
