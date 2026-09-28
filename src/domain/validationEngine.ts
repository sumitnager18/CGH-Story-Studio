// Validation Domain Engine — Authoritative structural and semantic integrity verification

import { Project } from '../types';
import { MIN_SCENE_DURATION } from './timelineEngine';

export interface ValidationIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

export interface ProjectValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateProject(project: Project): ProjectValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!project.id) errors.push('Project missing id');
  if (!project.name || project.name.trim() === '') errors.push('Project name cannot be empty');

  // 1. Scene Validations
  const sceneIds = new Set<string>();
  const sceneNumbers = new Set<number>();

  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i];
    if (sceneIds.has(scene.id)) {
      errors.push(`Duplicate scene id: "${scene.id}"`);
    } else {
      sceneIds.add(scene.id);
    }

    if (sceneNumbers.has(scene.sceneNumber)) {
      warnings.push(`Duplicate scene number: ${scene.sceneNumber}`);
    } else {
      sceneNumbers.add(scene.sceneNumber);
    }

    if (typeof scene.duration !== 'number' || !Number.isFinite(scene.duration)) {
      errors.push(`Scene "${scene.title}" has non-finite duration`);
    } else if (scene.duration < MIN_SCENE_DURATION) {
      errors.push(`Scene "${scene.title}" duration (${scene.duration}s) is below minimum (${MIN_SCENE_DURATION}s)`);
    }
  }

  // 2. Character Validations
  const characterIds = new Set<string>();
  for (const char of project.characters) {
    if (characterIds.has(char.id)) {
      errors.push(`Duplicate character id: "${char.id}"`);
    } else {
      characterIds.add(char.id);
    }
  }

  // Verify character assignments in scenes point to valid characters
  for (const scene of project.scenes) {
    for (const cId of scene.characterIds) {
      if (!characterIds.has(cId)) {
        warnings.push(`Scene "${scene.title}" references non-existent character id: "${cId}"`);
      }
    }
  }

  // 3. Timeline Clip Validations
  const clipIds = new Set<string>();
  let maxClipEnd = 0;

  for (const clip of project.timeline.clips) {
    if (clipIds.has(clip.id)) {
      errors.push(`Duplicate timeline clip id: "${clip.id}"`);
    } else {
      clipIds.add(clip.id);
    }

    if (!Number.isFinite(clip.start) || clip.start < 0) {
      errors.push(`Clip "${clip.title}" has invalid start time: ${clip.start}`);
    }
    if (!Number.isFinite(clip.duration) || clip.duration <= 0) {
      errors.push(`Clip "${clip.title}" has non-positive duration: ${clip.duration}`);
    }
    if (clip.sourceOut < clip.sourceIn) {
      errors.push(`Clip "${clip.title}" has sourceOut (${clip.sourceOut}) < sourceIn (${clip.sourceIn})`);
    }

    // Track Rules Enforcement (Requirement 13)
    const validTracks = ['scene', 'narration', 'visuals', 'music', 'sfx'];
    if (!validTracks.includes(clip.trackId)) {
      errors.push(`Clip "${clip.title}" has invalid trackId: "${clip.trackId}"`);
    }

    if (clip.trackId === 'scene' && !clip.sceneId) {
      errors.push(`Scene clip "${clip.title}" is missing required sceneId`);
    }

    if (clip.trackId === 'visuals' && !clip.sceneId) {
      warnings.push(`Visuals clip "${clip.title}" is not linked to any scene`);
    }

    if (clip.trackId === 'narration') {
      if (!clip.sceneId) {
        warnings.push(`Narration clip "${clip.title}" is not linked to any scene`);
      }
      if (clip.audioMode === 'master' && project.masterAudio && !clip.masterSegmentId) {
        warnings.push(`Narration clip "${clip.title}" marked as master audio mode but missing masterSegmentId`);
      }
    }

    const clipEnd = clip.start + clip.duration;
    if (clipEnd > maxClipEnd) {
      maxClipEnd = clipEnd;
    }
  }

  if (project.timeline.duration < maxClipEnd - 0.05) {
    warnings.push(`Timeline duration (${project.timeline.duration}s) is less than max clip end (${maxClipEnd}s)`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export const validateProjectState = validateProject;

