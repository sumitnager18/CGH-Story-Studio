// Scene Domain Engine — Single Source of Truth for Scene lifecycle,
// script splitting, scene reordering, and timeline sequence synchronization.

import { Project, Scene, ArtStyle } from '../types';
import { generateSceneArtwork } from '../utils/artworkGenerator';
import { reflowTimelineForScenes, resizeSceneDuration, MIN_SCENE_DURATION } from './timelineEngine';

export function createSceneEntity(
  sceneNumber: number,
  title?: string,
  durationSeconds: number = 6.0,
  defaultStyle: ArtStyle = 'anime',
  scriptText: string = ''
): Scene {
  const sceneId = `sc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const validDuration = Math.max(MIN_SCENE_DURATION, parseFloat(durationSeconds.toFixed(2)));

  return {
    id: sceneId,
    sceneNumber,
    title: title || `Scene 0${sceneNumber}`,
    scriptText: scriptText || 'Enter scene narration, visual direction, and character dialogue...',
    duration: validDuration,
    characterIds: [],
    visualAsset: {
      id: `vis_${sceneId}`,
      title: title || `Scene 0${sceneNumber} Storyboard`,
      aspectRatio: '16:9',
      imageUrl: generateSceneArtwork({
        title: title || `Scene 0${sceneNumber}`,
        prompt: 'Cinematic storyboard concept shot',
        style: defaultStyle,
        seed: Math.floor(Math.random() * 9000),
        characterNames: []
      })
    },
    animationPreset: 'pan-left',
    lipSyncStatus: 'none',
    cameraMoveDescription: 'Slow cinematic push-in',
    visualStyle: defaultStyle,
    notes: ''
  };
}

// Add a new scene to project and immediately reflow timeline
export function addSceneToProject(
  project: Project,
  title?: string,
  durationSeconds: number = 6.0
): { project: Project; newSceneId: string } {
  const newNum = project.scenes.length + 1;
  const newScene = createSceneEntity(newNum, title, durationSeconds, project.settings.defaultStyle);

  const updatedScenes = [...project.scenes, newScene];
  const reflow = reflowTimelineForScenes(updatedScenes, project.timeline.clips, project.masterAudio);

  const updatedProject: Project = {
    ...project,
    scenes: updatedScenes,
    timeline: {
      ...project.timeline,
      clips: reflow.clips,
      duration: reflow.totalDuration
    },
    updatedAt: Date.now()
  };

  return {
    project: updatedProject,
    newSceneId: newScene.id
  };
}

// Delete scene from project and ripple reflow
export function deleteSceneFromProject(project: Project, sceneId: string): Project {
  if (project.scenes.length <= 1) {
    // Keep at least 1 scene
    return project;
  }

  const remainingScenes = project.scenes
    .filter(s => s.id !== sceneId)
    .map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));

  const remainingClips = project.timeline.clips.filter(c => c.sceneId !== sceneId);
  const reflow = reflowTimelineForScenes(remainingScenes, remainingClips, project.masterAudio);

  // Clean up orphan references in AI jobs
  const cleanAiJobs = project.aiJobs.filter(j => j.sceneId !== sceneId);

  return {
    ...project,
    scenes: remainingScenes,
    aiJobs: cleanAiJobs,
    timeline: {
      ...project.timeline,
      clips: reflow.clips,
      duration: reflow.totalDuration
    },
    updatedAt: Date.now()
  };
}

// Reorder scenes and reflow sequence timeline clips (Phase 26)
export function reorderScenesInProject(
  project: Project,
  startIndex: number,
  endIndex: number
): Project {
  if (startIndex === endIndex || startIndex < 0 || endIndex < 0 || startIndex >= project.scenes.length || endIndex >= project.scenes.length) {
    return project;
  }

  const reordered = Array.from(project.scenes);
  const [removed] = reordered.splice(startIndex, 1);
  reordered.splice(endIndex, 0, removed);

  // Update sceneNumber sequentially
  const reindexed = reordered.map((s, idx) => ({ ...s, sceneNumber: idx + 1 }));
  const reflow = reflowTimelineForScenes(reindexed, project.timeline.clips, project.masterAudio);

  return {
    ...project,
    scenes: reindexed,
    timeline: {
      ...project.timeline,
      clips: reflow.clips,
      duration: reflow.totalDuration
    },
    updatedAt: Date.now()
  };
}

// Update scene attributes with automatic downstream reflow when duration changes (Phase 4)
export function updateSceneInProject(
  project: Project,
  sceneId: string,
  updates: Partial<Scene>
): Project {
  // If duration changed, execute authoritative reflow
  if (updates.duration !== undefined) {
    const resized = resizeSceneDuration(
      project.scenes,
      project.timeline.clips,
      sceneId,
      updates.duration,
      project.masterAudio
    );

    // Apply any other updates to the scene as well
    const finalScenes = resized.scenes.map(s => {
      if (s.id === sceneId) {
        return { ...s, ...updates, duration: s.duration };
      }
      return s;
    });

    return {
      ...project,
      scenes: finalScenes,
      timeline: {
        ...project.timeline,
        clips: resized.clips,
        duration: resized.totalDuration
      },
      updatedAt: Date.now()
    };
  }

  // Duration unchanged: simple field update
  const updatedScenes = project.scenes.map(s => {
    if (s.id === sceneId) {
      return { ...s, ...updates };
    }
    return s;
  });

  return {
    ...project,
    scenes: updatedScenes,
    updatedAt: Date.now()
  };
}

// Phase 27: Auto-split script into scenes by blank paragraph
export function autoSplitScriptIntoScenes(
  project: Project,
  scriptText: string
): Project {
  const paragraphs = scriptText
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return project;

  const defaultStyle = project.settings.defaultStyle;
  const newScenes: Scene[] = paragraphs.map((text, idx) => {
    const sceneNum = idx + 1;
    // Derive title from first line or words
    const firstLine = text.split('\n')[0].replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const titleWords = firstLine.split(/\s+/).slice(0, 5).join(' ');
    const title = titleWords ? `Scene 0${sceneNum}: ${titleWords}` : `Scene 0${sceneNum}`;
    
    // Estimate sensible duration: 1 second per ~3 words, min 4s, max 14s
    const wordCount = text.split(/\s+/).length;
    const estDuration = Math.max(MIN_SCENE_DURATION, Math.min(14, Math.round(wordCount / 3.0)));

    return createSceneEntity(sceneNum, title, estDuration, defaultStyle, text);
  });

  const reflow = reflowTimelineForScenes(newScenes, project.timeline.clips, project.masterAudio);

  return {
    ...project,
    script: scriptText,
    scenes: newScenes,
    timeline: {
      ...project.timeline,
      clips: reflow.clips,
      duration: reflow.totalDuration
    },
    updatedAt: Date.now()
  };
}
