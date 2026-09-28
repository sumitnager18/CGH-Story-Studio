import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  Project,
  Scene,
  Character,
  TimelineClip,
  AIJob,
  SelectedItem,
  CommandHistoryEntry,
  CameraPreset,
  ArtStyle,
  ResolutionPreset,
  FrameRatePreset,
  TrackType
} from '../types';
import {
  loadProjectsFromStorage,
  saveProjectsToStorage,
  getActiveProjectId,
  setActiveProjectId,
  createDefaultProject
} from '../utils/storage';
import { generateSpeechWaveform, sliceWaveform, studioAudio } from '../utils/mockAudio';
import { generateSceneArtwork, generateCharacterAvatar } from '../utils/artworkGenerator';
import { LibraryAsset, AssetCategory } from '../types/assets';
import { ensureAssetImage } from '../data/assetLibrary';
import {
  updateSceneInProject,
  addSceneToProject,
  deleteSceneFromProject,
  reorderScenesInProject,
  autoSplitScriptIntoScenes as autoSplitScriptDomain,
  resizeSceneDuration,
  reflowTimelineForScenes,
  splitClipAtTime,
  MIN_SCENE_DURATION,
  importMasterAudio as importMasterAudioDomain,
  mapMasterAudioToScenes as mapMasterAudioToScenesDomain,
  replaceSceneAudio as replaceSceneAudioDomain,
  restoreMasterAudioForScene as restoreMasterAudioForSceneDomain,
  moveTimelineClip,
  trimIndependentClip,
  deleteTimelineClip,
  validateProjectState
} from '../domain';

interface StudioContextType {
  project: Project;
  allProjects: Project[];
  selectedItem: SelectedItem;
  selectedScene: Scene | null;
  selectedCharacter: Character | null;
  selectedClip: TimelineClip | null;
  activeLeftTab: 'story' | 'scenes' | 'characters' | 'assets' | 'ai-jobs';
  setActiveLeftTab: (tab: 'story' | 'scenes' | 'characters' | 'assets' | 'ai-jobs') => void;
  currentTime: number;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean | ((prev: boolean) => boolean)) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  timelineZoom: number;
  setTimelineZoom: (zoom: number | ((prev: number) => number)) => void;
  isTimelineExpanded: boolean;
  setIsTimelineExpanded: (exp: boolean | ((prev: boolean) => boolean)) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  generateModalSceneId: string | null;
  setGenerateModalSceneId: (id: string | null) => void;
  characterEditId: string | null;
  setCharacterEditId: (id: string | null) => void;
  // 10,000+ Asset Library State & Operations
  assetLibraryInitialCategory: AssetCategory;
  setAssetLibraryInitialCategory: (cat: AssetCategory) => void;
  assetLibraryInitialQuery: string;
  setAssetLibraryInitialQuery: (q: string) => void;
  openAssetLibrary: (category?: AssetCategory, query?: string) => void;
  applyAssetToScene: (sceneId: string, asset: LibraryAsset) => void;
  addLibraryCharacterToProject: (asset: LibraryAsset) => void;
  addLibraryAudioToTimeline: (asset: LibraryAsset, trackType?: TrackType, startSec?: number) => void;
  applyPoseToScene: (sceneId: string, asset: LibraryAsset) => void;
  applyStylePreset: (style: ArtStyle, styleName: string, sceneId?: string) => void;
  commandHistory: CommandHistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  // Selection
  selectScene: (id: string) => void;
  selectCharacter: (id: string) => void;
  selectClip: (id: string) => void;
  selectProject: () => void;
  // Project operations
  updateScript: (newScript: string) => void;
  autoSplitScriptIntoScenes: (rawScript?: string) => void;
  importMasterAudio: (fileName: string, duration?: number) => void;
  splitAudioForScenes: () => void;
  replaceSceneAudio: (sceneId: string, fileName: string, durationSeconds: number, blobUrl?: string) => void;
  restoreMasterAudioForScene: (sceneId: string) => void;
  // Scenes & Characters
  updateScene: (sceneId: string, updates: Partial<Scene>, historyLabel?: string) => void;
  addScene: (title?: string) => void;
  deleteScene: (sceneId: string) => void;
  reorderScenes: (startIndex: number, endIndex: number) => void;
  updateCharacter: (charId: string, updates: Partial<Character>, historyLabel?: string) => void;
  addCharacter: (name?: string) => void;
  deleteCharacter: (charId: string) => void;
  // AI Operations
  startGenerateVisual: (sceneId: string, params: {
    prompt: string;
    style: ArtStyle;
    seed: number;
    characterIds: string[];
    cfgScale: number;
    steps: number;
  }) => void;
  animateScene: (sceneId: string, preset: CameraPreset) => void;
  lipSyncScene: (sceneId: string) => void;
  cancelAIJob: (jobId: string) => void;
  retryAIJob: (jobId: string) => void;
  // Timeline Operations
  updateClip: (clipId: string, updates: Partial<TimelineClip>, historyLabel?: string) => void;
  moveClip: (clipId: string, newStart: number, newTrackId?: TrackType) => void;
  trimClip: (clipId: string, newStart: number, newDuration: number) => void;
  commitClipMove: (clipId: string, newStart: number, newTrackId?: TrackType) => void;
  commitClipTrim: (clipId: string, newStart: number, newDuration: number) => void;
  splitClipAtPlayhead: (clipId?: string) => void;
  deleteSelectedClip: () => void;
  fitTimelineZoom: () => void;
  // Project Management
  createNewProject: (name: string, resolution: ResolutionPreset, fps: FrameRatePreset, style: ArtStyle) => void;
  switchProject: (projectId: string) => void;
  duplicateCurrentProject: () => void;
  deleteCurrentProject: (projectId: string) => void;
  resetToSampleProject: () => void;
  togglePlayPause: () => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProjects, setAllProjects] = useState<Project[]>(() => loadProjectsFromStorage());
  const [project, setProject] = useState<Project>(() => {
    const activeId = getActiveProjectId();
    const found = allProjects.find(p => p.id === activeId);
    return found || allProjects[0] || createDefaultProject();
  });

  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'scene',
    id: project.scenes[0]?.id || ''
  });

  const [activeLeftTab, setActiveLeftTab] = useState<'story' | 'scenes' | 'characters' | 'assets' | 'ai-jobs'>('scenes');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [timelineZoom, setTimelineZoom] = useState<number>(36); // px per second
  const [isTimelineExpanded, setIsTimelineExpanded] = useState<boolean>(false);

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [generateModalSceneId, setGenerateModalSceneId] = useState<string | null>(null);
  const [characterEditId, setCharacterEditId] = useState<string | null>(null);

  // 10,000+ Asset Library State
  const [assetLibraryInitialCategory, setAssetLibraryInitialCategory] = useState<AssetCategory>('characters');
  const [assetLibraryInitialQuery, setAssetLibraryInitialQuery] = useState<string>('');

  const openAssetLibrary = useCallback((category?: AssetCategory, query?: string) => {
    if (category) setAssetLibraryInitialCategory(category);
    if (query !== undefined) setAssetLibraryInitialQuery(query);
    setActiveModal('asset-library');
  }, []);

  // Undo / Redo stacks
  const undoStackRef = useRef<Project[]>([]);
  const redoStackRef = useRef<Project[]>([]);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryEntry[]>([
    { id: 'hist_init', label: 'Project Initialized', timestamp: Date.now() }
  ]);

  // Push to undo stack
  const pushUndo = useCallback((label: string, currentProj: Project) => {
    undoStackRef.current.push(JSON.parse(JSON.stringify(currentProj)));
    if (undoStackRef.current.length > 30) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
    setCommandHistory(prev => [
      { id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, label, timestamp: Date.now() },
      ...prev.slice(0, 25)
    ]);
  }, []);

  // Project ref to eliminate stale closures in high-frequency operations
  const projectRef = useRef<Project>(project);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Save changes to localStorage with debouncing for high-frequency operations
  const debounceSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Centralized Persistence Coordinator (Requirements 2 & 3)
  // Domain operations return a new Project. This coordinator updates React state once,
  // syncs allProjects, and executes debounced/immediate persistence without nested setProject calls.
  const persistProjectState = useCallback((
    updated: Project,
    options?: { immediate?: boolean; pushHistory?: string }
  ) => {
    if (options?.pushHistory) {
      pushUndo(options.pushHistory, projectRef.current);
    }
    projectRef.current = updated;
    setProject(updated);
    setAllProjects(prev => {
      const idx = prev.findIndex(p => p.id === updated.id);
      let nextList = [...prev];
      if (idx >= 0) {
        nextList[idx] = updated;
      } else {
        nextList.push(updated);
      }
      if (options?.immediate) {
        if (debounceSaveTimerRef.current) clearTimeout(debounceSaveTimerRef.current);
        saveProjectsToStorage(nextList);
      } else {
        if (debounceSaveTimerRef.current) clearTimeout(debounceSaveTimerRef.current);
        debounceSaveTimerRef.current = setTimeout(() => {
          saveProjectsToStorage(nextList);
        }, 250);
      }
      return nextList;
    });
    setActiveProjectId(updated.id);
  }, [pushUndo]);

  const persistProject = useCallback((updated: Project, immediate: boolean = false) => {
    persistProjectState(updated, { immediate });
  }, [persistProjectState]);

  // Sync selected item on scene list change
  useEffect(() => {
    if (selectedItem.type === 'scene' && !project.scenes.find(s => s.id === selectedItem.id)) {
      if (project.scenes.length > 0) {
        setSelectedItem({ type: 'scene', id: project.scenes[0].id });
      }
    }
  }, [project.scenes, selectedItem]);

  // Playhead simulation ticker
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTickTimeRef.current = performance.now();

    const loop = (now: number) => {
      const delta = (now - lastTickTimeRef.current) / 1000;
      lastTickTimeRef.current = now;

      setCurrentTime(prev => {
        const next = prev + delta * playbackSpeed;
        const totalDur = project.timeline.duration || 30;
        
        // Sync selected scene with current playhead time
        let accumulated = 0;
        for (const sc of project.scenes) {
          if (next >= accumulated && next < accumulated + sc.duration) {
            if (selectedItem.type === 'scene' && selectedItem.id !== sc.id) {
              setSelectedItem({ type: 'scene', id: sc.id });
            }
            break;
          }
          accumulated += sc.duration;
        }

        // Web Audio tick / cadence sound
        studioAudio.playTimelineTick(next, true);

        if (next >= totalDur) {
          setIsPlaying(false);
          return 0; // loop or reset to start
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, project.timeline.duration, project.scenes, selectedItem]);

  // AI Jobs Background Simulation Runner
  useEffect(() => {
    const interval = setInterval(() => {
      const prev = projectRef.current;
      const runningJobs = prev.aiJobs.filter(j => j.status === 'running');
      if (runningJobs.length === 0) return;

      let hasChanges = false;
      const updatedJobs = prev.aiJobs.map(job => {
        if (job.status !== 'running') return job;

        hasChanges = true;
        const newProgress = Math.min(100, job.progress + 15);

        if (newProgress >= 100) {
          // Completed job!
          return {
            ...job,
            status: 'done' as const,
            progress: 100,
            completedAt: Date.now()
          };
        }
        return {
          ...job,
          progress: newProgress
        };
      });

      if (!hasChanges) return;

      // Apply completed job results to project scenes
      let nextScenes = [...prev.scenes];
      let nextClips = [...prev.timeline.clips];

      updatedJobs.forEach(job => {
        const wasRunning = runningJobs.find(r => r.id === job.id);
        if (wasRunning && job.status === 'done') {
          if (job.type === 'image' && job.sceneId && job.result) {
            nextScenes = nextScenes.map(sc => {
              if (sc.id === job.sceneId) {
                return {
                  ...sc,
                  visualAsset: job.result
                };
              }
              return sc;
            });

            // Update visuals clip title
            nextClips = nextClips.map(clip => {
              if (clip.trackId === 'visuals' && clip.sceneId === job.sceneId) {
                return { ...clip, title: `🖼 ${job.result.title}` };
              }
              return clip;
            });
          } else if (job.type === 'video' && job.sceneId) {
            nextScenes = nextScenes.map(sc => {
              if (sc.id === job.sceneId) {
                return {
                  ...sc,
                  animationPreset: job.params.preset || 'pan-left',
                  cameraMoveDescription: `AI Camera Path: ${job.params.preset || 'Dynamic'}`
                };
              }
              return sc;
            });
          } else if (job.type === 'lip-sync' && job.sceneId) {
            nextScenes = nextScenes.map(sc => {
              if (sc.id === job.sceneId) {
                return {
                  ...sc,
                  lipSyncStatus: 'ready'
                };
              }
              return sc;
            });
          }
        }
      });

      const nextProject: Project = {
        ...prev,
        scenes: nextScenes,
        timeline: {
          ...prev.timeline,
          clips: nextClips
        },
        aiJobs: updatedJobs,
        updatedAt: Date.now()
      };

      persistProjectState(nextProject, { immediate: false });
    }, 800);

    return () => clearInterval(interval);
  }, [persistProjectState]);

  // Context getters
  const selectedScene = project.scenes.find(s => s.id === selectedItem.id) || project.scenes[0] || null;
  const selectedCharacter = project.characters.find(c => c.id === selectedItem.id) || null;
  const selectedClip = project.timeline.clips.find(c => c.id === selectedItem.id) || null;

  // Selection actions
  const selectScene = useCallback((id: string) => {
    setSelectedItem({ type: 'scene', id });
    // Move playhead to start of this scene
    let sceneStartTime = 0;
    for (const sc of project.scenes) {
      if (sc.id === id) {
        setCurrentTime(sceneStartTime);
        break;
      }
      sceneStartTime += sc.duration;
    }
  }, [project.scenes]);

  const selectCharacter = useCallback((id: string) => {
    setSelectedItem({ type: 'character', id });
    setActiveLeftTab('characters');
  }, []);

  const selectClip = useCallback((id: string) => {
    setSelectedItem({ type: 'clip', id });
    const clip = project.timeline.clips.find(c => c.id === id);
    if (clip) {
      setCurrentTime(clip.start);
      if (clip.sceneId) {
        const matchingScene = project.scenes.find(s => s.id === clip.sceneId);
        if (matchingScene) {
          // Keep canvas updated with corresponding scene
        }
      }
    }
  }, [project.timeline.clips, project.scenes]);

  const selectProject = useCallback(() => {
    setSelectedItem({ type: 'project', id: project.id });
  }, [project.id]);

  // Undo / Redo
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop()!;
    redoStackRef.current.push(JSON.parse(JSON.stringify(projectRef.current)));
    persistProjectState(previous, { immediate: true });
  }, [persistProjectState]);

  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(JSON.parse(JSON.stringify(projectRef.current)));
    persistProjectState(next, { immediate: true });
  }, [persistProjectState]);

  // Script editing & auto-split into scenes
  const updateScript = useCallback((newScript: string) => {
    const updated = { ...projectRef.current, script: newScript, updatedAt: Date.now() };
    persistProjectState(updated);
  }, [persistProjectState]);

  const autoSplitScriptIntoScenes = useCallback((rawScript?: string) => {
    const scriptToUse = rawScript !== undefined ? rawScript : projectRef.current.script;
    if (!scriptToUse || !scriptToUse.trim()) return;
    const updated = autoSplitScriptDomain(projectRef.current, scriptToUse);
    persistProjectState(updated, { pushHistory: 'Auto-split script into scenes', immediate: true });
    if (updated.scenes.length > 0) {
      setSelectedItem({ type: 'scene', id: updated.scenes[0].id });
    }
  }, [persistProjectState]);

  // Master Audio Pipeline (Requirements 4, 6, 7, 8)
  const importMasterAudio = useCallback((fileName: string, customDuration?: number) => {
    const updated = importMasterAudioDomain(projectRef.current, fileName, customDuration);
    persistProjectState(updated, { pushHistory: 'Import master audio', immediate: true });
  }, [persistProjectState]);

  const splitAudioForScenes = useCallback(() => {
    if (!projectRef.current.masterAudio) return;
    const updated = mapMasterAudioToScenesDomain(projectRef.current);
    persistProjectState(updated, { pushHistory: 'Re-slice audio for scenes', immediate: true });
  }, [persistProjectState]);

  const replaceSceneAudio = useCallback((sceneId: string, fileName: string, durationSeconds: number, blobUrl?: string) => {
    const updated = replaceSceneAudioDomain(projectRef.current, sceneId, fileName, durationSeconds, blobUrl);
    persistProjectState(updated, { pushHistory: 'Replace Scene Audio', immediate: true });
  }, [persistProjectState]);

  const restoreMasterAudioForScene = useCallback((sceneId: string) => {
    const updated = restoreMasterAudioForSceneDomain(projectRef.current, sceneId);
    persistProjectState(updated, { pushHistory: 'Restore Master Audio for Scene', immediate: true });
  }, [persistProjectState]);

  // Scene Operations (Delegated to Authoritative Scene Engine with Downstream Timeline Reflow)
  const updateScene = useCallback((sceneId: string, updates: Partial<Scene>, historyLabel?: string) => {
    const updated = updateSceneInProject(projectRef.current, sceneId, updates);
    persistProjectState(updated, { pushHistory: historyLabel, immediate: updates.duration === undefined });
  }, [persistProjectState]);

  const addScene = useCallback((title?: string) => {
    const { project: updated, newSceneId } = addSceneToProject(projectRef.current, title);
    persistProjectState(updated, { pushHistory: 'Add Scene', immediate: true });
    setSelectedItem({ type: 'scene', id: newSceneId });
  }, [persistProjectState]);

  const deleteScene = useCallback((sceneId: string) => {
    if (projectRef.current.scenes.length <= 1) return; // Keep at least 1 scene
    const updated = deleteSceneFromProject(projectRef.current, sceneId);
    persistProjectState(updated, { pushHistory: 'Delete Scene', immediate: true });
    if (selectedItem.type === 'scene' && selectedItem.id === sceneId) {
      setSelectedItem({ type: 'scene', id: updated.scenes[0]?.id || '' });
    }
  }, [persistProjectState, selectedItem]);

  const reorderScenes = useCallback((startIndex: number, endIndex: number) => {
    const updated = reorderScenesInProject(projectRef.current, startIndex, endIndex);
    persistProjectState(updated, { pushHistory: 'Reorder Scenes', immediate: true });
  }, [persistProjectState]);

  // Character Operations
  const updateCharacter = useCallback((charId: string, updates: Partial<Character>, historyLabel?: string) => {
    const nextChars = projectRef.current.characters.map(c => c.id === charId ? { ...c, ...updates } : c);
    const updated = { ...projectRef.current, characters: nextChars, updatedAt: Date.now() };
    persistProjectState(updated, { pushHistory: historyLabel });
  }, [persistProjectState]);

  const addCharacter = useCallback((name?: string) => {
    const charName = name || `Character ${projectRef.current.characters.length + 1}`;
    const id = `char_${Date.now()}`;
    const newChar: Character = {
      id,
      name: charName,
      role: 'Supporting',
      age: '25',
      bodyFaceHair: 'Athletic build, distinctive eyes, expressive features',
      clothing: 'Signature studio jacket, customized accessories',
      palette: ['#6c5ce7', '#00cec9', '#fdcb6e', '#2d3436'],
      artStyle: projectRef.current.settings.defaultStyle,
      referenceImage: generateCharacterAvatar(charName, projectRef.current.settings.defaultStyle, ['#6c5ce7', '#00cec9']),
      consistencyScore: 94,
      notes: 'Character seed locked.'
    };

    const updated: Project = {
      ...projectRef.current,
      characters: [...projectRef.current.characters, newChar],
      updatedAt: Date.now()
    };

    persistProjectState(updated, { pushHistory: 'Create Character', immediate: true });
    setSelectedItem({ type: 'character', id });
  }, [persistProjectState]);

  const deleteCharacter = useCallback((charId: string) => {
    const nextChars = projectRef.current.characters.filter(c => c.id !== charId);
    // Remove character from scene assignments
    const nextScenes = projectRef.current.scenes.map(s => ({
      ...s,
      characterIds: s.characterIds.filter(cid => cid !== charId)
    }));

    const updated: Project = {
      ...projectRef.current,
      characters: nextChars,
      scenes: nextScenes,
      updatedAt: Date.now()
    };

    persistProjectState(updated, { pushHistory: 'Delete Character', immediate: true });
    if (nextChars.length > 0) {
      setSelectedItem({ type: 'character', id: nextChars[0].id });
    }
  }, [persistProjectState]);

  // AI Operations & Job Queue
  const startGenerateVisual = useCallback((sceneId: string, params: {
    prompt: string;
    style: ArtStyle;
    seed: number;
    characterIds: string[];
    cfgScale: number;
    steps: number;
  }) => {
    const targetScene = projectRef.current.scenes.find(s => s.id === sceneId);
    if (!targetScene) return;

    const jobId = `job_gen_${Date.now()}`;
    const characterNames = params.characterIds
      .map(cid => projectRef.current.characters.find(c => c.id === cid)?.name || '')
      .filter(Boolean);

    // Pre-calculate generated visual
    const generatedAsset = {
      id: `vis_${Date.now()}`,
      title: `${targetScene.sceneNumber}: ${targetScene.title}`,
      aspectRatio: '16:9',
      imageUrl: generateSceneArtwork({
        title: targetScene.title,
        prompt: params.prompt,
        style: params.style,
        seed: params.seed,
        characterNames,
        cameraPreset: targetScene.animationPreset
      }),
      metadata: {
        prompt: params.prompt,
        style: params.style,
        seed: params.seed,
        model: 'CGH Procedural Scene Renderer',
        cfgScale: params.cfgScale,
        steps: params.steps,
        characterRefIds: params.characterIds,
        timestamp: new Date().toLocaleTimeString()
      }
    };

    const newJob: AIJob = {
      id: jobId,
      type: 'image',
      title: `Visual: Scene ${targetScene.sceneNumber} (${params.style})`,
      sceneId,
      status: 'running',
      progress: 10,
      params,
      result: generatedAsset,
      createdAt: Date.now(),
      startedAt: Date.now()
    };

    const updated = {
      ...projectRef.current,
      aiJobs: [newJob, ...projectRef.current.aiJobs],
      updatedAt: Date.now()
    };
    persistProjectState(updated);
    setActiveLeftTab('ai-jobs');
  }, [persistProjectState]);

  const animateScene = useCallback((sceneId: string, preset: CameraPreset) => {
    const sc = projectRef.current.scenes.find(s => s.id === sceneId);
    if (!sc) return;

    const jobId = `job_anim_${Date.now()}`;
    const newJob: AIJob = {
      id: jobId,
      type: 'video',
      title: `Camera Motion: Scene ${sc.sceneNumber} [${preset.toUpperCase()}]`,
      sceneId,
      status: 'running',
      progress: 20,
      params: { preset },
      createdAt: Date.now(),
      startedAt: Date.now()
    };

    const updated = {
      ...projectRef.current,
      aiJobs: [newJob, ...projectRef.current.aiJobs],
      updatedAt: Date.now()
    };
    persistProjectState(updated);
    setActiveLeftTab('ai-jobs');
  }, [persistProjectState]);

  const lipSyncScene = useCallback((sceneId: string) => {
    const sc = projectRef.current.scenes.find(s => s.id === sceneId);
    if (!sc) return;

    const jobId = `job_lipsync_${Date.now()}`;
    const newJob: AIJob = {
      id: jobId,
      type: 'lip-sync',
      title: `Audio Lip-Sync: Scene ${sc.sceneNumber}`,
      sceneId,
      status: 'running',
      progress: 15,
      params: { sceneNumber: sc.sceneNumber },
      createdAt: Date.now(),
      startedAt: Date.now()
    };

    const updated = {
      ...projectRef.current,
      scenes: projectRef.current.scenes.map(s => s.id === sceneId ? { ...s, lipSyncStatus: 'processing' as const } : s),
      aiJobs: [newJob, ...projectRef.current.aiJobs],
      updatedAt: Date.now()
    };
    persistProjectState(updated);
    setActiveLeftTab('ai-jobs');
  }, [persistProjectState]);

  const cancelAIJob = useCallback((jobId: string) => {
    const nextJobs = projectRef.current.aiJobs.map(j => j.id === jobId ? { ...j, status: 'failed' as const, errorMessage: 'Cancelled by user' } : j);
    const updated = { ...projectRef.current, aiJobs: nextJobs, updatedAt: Date.now() };
    persistProjectState(updated);
  }, [persistProjectState]);

  const retryAIJob = useCallback((jobId: string) => {
    const nextJobs = projectRef.current.aiJobs.map(j => j.id === jobId ? { ...j, status: 'running' as const, progress: 10, errorMessage: undefined } : j);
    const updated = { ...projectRef.current, aiJobs: nextJobs, updatedAt: Date.now() };
    persistProjectState(updated);
  }, [persistProjectState]);

  // 11,150+ CGH Procedural Asset Library Operations
  const applyAssetToScene = useCallback((sceneId: string, asset: LibraryAsset) => {
    const imageUrl = ensureAssetImage(asset);
    const prev = projectRef.current;

    const nextScenes = prev.scenes.map(sc => {
      if (sc.id !== sceneId) return sc;

      const visualAsset = {
        id: `vis_${asset.id}_${Date.now()}`,
        title: asset.title,
        imageUrl,
        aspectRatio: '16:9',
        metadata: {
          prompt: asset.prompt,
          style: asset.style,
          seed: asset.seed,
          model: asset.model,
          cfgScale: 7.5,
          steps: 30,
          characterRefIds: sc.characterIds,
          timestamp: new Date().toLocaleTimeString()
        }
      };

      const newPreset = asset.backgroundData?.cameraPreset || asset.poseData?.recommendedCamera || sc.animationPreset;
      const newCameraDesc = asset.backgroundData?.lighting || asset.poseData?.motionType || sc.cameraMoveDescription;

      return {
        ...sc,
        visualAsset,
        visualStyle: asset.style,
        animationPreset: newPreset,
        cameraMoveDescription: newCameraDesc
      };
    });

    // Synchronize timeline visual clip
    const nextClips = prev.timeline.clips.map(cl => {
      if (cl.sceneId === sceneId && cl.trackId === 'visuals') {
        return {
          ...cl,
          title: `🖼 ${asset.title}`,
          assetId: `vis_${asset.id}`
        };
      }
      return cl;
    });

    const updated: Project = {
      ...prev,
      scenes: nextScenes,
      timeline: {
        ...prev.timeline,
        clips: nextClips
      },
      updatedAt: Date.now()
    };

    persistProjectState(updated, { pushHistory: `Apply ${asset.title} to scene`, immediate: true });
    setSelectedItem({ type: 'scene', id: sceneId });
  }, [persistProjectState]);

  const addLibraryCharacterToProject = useCallback((asset: LibraryAsset) => {
    const avatarUrl = ensureAssetImage(asset);
    const charName = asset.title.split('—')[0].trim();
    const id = `char_cgh_${Date.now()}`;

    const newChar: Character = {
      id,
      name: charName,
      role: asset.characterData?.role || asset.subcategory || 'Lead',
      age: asset.characterData?.age || '22',
      bodyFaceHair: asset.characterData?.bodyFaceHair || asset.prompt,
      clothing: asset.characterData?.clothing || 'CGH Tailored Wardrobe',
      palette: asset.characterData?.palette || ['#6c5ce7', '#00cec9', '#fbbf24'],
      artStyle: asset.style,
      referenceImage: avatarUrl,
      consistencyScore: asset.characterData?.consistencyScore || 97,
      notes: `Imported from CGH Asset Vault (#${asset.seed}, ${asset.family || asset.subcategory})`
    };

    const updated: Project = {
      ...projectRef.current,
      characters: [...projectRef.current.characters, newChar],
      updatedAt: Date.now()
    };

    persistProjectState(updated, { pushHistory: `Import character: ${asset.title}`, immediate: true });
    setSelectedItem({ type: 'character', id });
    setActiveLeftTab('characters');
  }, [persistProjectState]);

  const addLibraryAudioToTimeline = useCallback((asset: LibraryAsset, trackType: TrackType = 'music', startSec?: number) => {
    const duration = asset.audioData?.duration || 15;
    const start = startSec !== undefined ? startSec : currentTime;
    const targetTrack = trackType === 'music' || trackType === 'sfx' ? trackType : (asset.audioData?.audioType || 'music');
    const color = targetTrack === 'music' ? '#10b981' : '#f59e0b';

    const newClip: TimelineClip = {
      id: `clip_ad_${asset.id}_${Date.now()}`,
      trackId: targetTrack,
      title: `${targetTrack === 'music' ? '🎵' : '🔊'} ${asset.title}`,
      start,
      duration,
      sourceIn: 0,
      sourceOut: duration,
      volume: 85,
      fadeIn: 0.3,
      fadeOut: 0.5,
      color,
      waveform: asset.audioData?.waveform || [0.3, 0.6, 0.9, 0.7, 0.4, 0.8, 0.5]
    };

    // Audition sound
    studioAudio.playNarrationBeep(asset.audioData?.toneHz || (targetTrack === 'music' ? 440 : 180), 0.25);

    // Register in project.assets if not present
    const existingAsset = projectRef.current.assets.find(a => a.id === asset.id);
    const nextAssets = existingAsset ? projectRef.current.assets : [
      ...projectRef.current.assets,
      {
        id: asset.id,
        name: asset.title,
        type: targetTrack,
        duration,
        url: '#',
        size: `${Math.round(duration * 32)} KB`,
        tags: asset.tags
      }
    ];

    const nextDuration = Math.max(projectRef.current.timeline.duration, start + duration);
    const updated: Project = {
      ...projectRef.current,
      assets: nextAssets,
      timeline: {
        ...projectRef.current.timeline,
        clips: [...projectRef.current.timeline.clips, newClip],
        duration: nextDuration
      },
      updatedAt: Date.now()
    };

    persistProjectState(updated, { pushHistory: `Add ${asset.title} to timeline`, immediate: true });
    setSelectedItem({ type: 'clip', id: newClip.id });
  }, [currentTime, persistProjectState]);

  const applyPoseToScene = useCallback((sceneId: string, asset: LibraryAsset) => {
    const preset = asset.poseData?.recommendedCamera || 'zoom-in';
    const desc = `${asset.title} - ${asset.poseData?.motionType || 'Action Control Rig'}`;

    updateScene(sceneId, {
      animationPreset: preset,
      cameraMoveDescription: desc,
      notes: (projectRef.current.scenes.find(s => s.id === sceneId)?.notes ? projectRef.current.scenes.find(s => s.id === sceneId)?.notes + '\n' : '') + `Pose: ${asset.title}`
    }, `Apply Pose ${asset.title}`);
  }, [updateScene]);

  const applyStylePreset = useCallback((style: ArtStyle, styleName: string, sceneId?: string) => {
    if (sceneId) {
      updateScene(sceneId, { visualStyle: style }, `Apply style ${styleName}`);
    } else {
      const updated: Project = {
        ...projectRef.current,
        settings: {
          ...projectRef.current.settings,
          defaultStyle: style
        },
        updatedAt: Date.now()
      };
      persistProjectState(updated, { pushHistory: `Apply style ${styleName}`, immediate: true });
    }
  }, [updateScene, persistProjectState]);

  // Timeline Clip Operations (Requirements 1, 12, 13)
  const updateClip = useCallback((clipId: string, updates: Partial<TimelineClip>, historyLabel?: string) => {
    const nextClips = projectRef.current.timeline.clips.map(c => c.id === clipId ? { ...c, ...updates } : c);
    const updated = {
      ...projectRef.current,
      timeline: { ...projectRef.current.timeline, clips: nextClips },
      updatedAt: Date.now()
    };
    persistProjectState(updated, { pushHistory: historyLabel });
  }, [persistProjectState]);

  // Immediate in-memory preview movement (e.g. for drag preview without storage write)
  const moveClip = useCallback((clipId: string, newStart: number, newTrackId?: TrackType) => {
    const nextClips = moveTimelineClip(projectRef.current.timeline.clips, clipId, newStart, newTrackId);
    const updated = {
      ...projectRef.current,
      timeline: { ...projectRef.current.timeline, clips: nextClips },
      updatedAt: Date.now()
    };
    projectRef.current = updated;
    setProject(updated);
  }, []);

  // Immediate in-memory preview trimming
  const trimClip = useCallback((clipId: string, newStart: number, newDuration: number) => {
    const targetClip = projectRef.current.timeline.clips.find(c => c.id === clipId);
    if (!targetClip) return;

    if (targetClip.trackId === 'scene' && targetClip.sceneId) {
      const safeDuration = Math.max(MIN_SCENE_DURATION, parseFloat(newDuration.toFixed(2)));
      const updated = updateSceneInProject(projectRef.current, targetClip.sceneId, { duration: safeDuration });
      projectRef.current = updated;
      setProject(updated);
    } else {
      const nextClips = trimIndependentClip(projectRef.current.timeline.clips, clipId, newStart, newDuration);
      const updated = {
        ...projectRef.current,
        timeline: { ...projectRef.current.timeline, clips: nextClips },
        updatedAt: Date.now()
      };
      projectRef.current = updated;
      setProject(updated);
    }
  }, []);

  // PointerUp Commit Hook for Clip Move (Requirement 1 & 13)
  const commitClipMove = useCallback((clipId: string, newStart: number, newTrackId?: TrackType) => {
    const nextClips = moveTimelineClip(projectRef.current.timeline.clips, clipId, newStart, newTrackId);
    let maxEnd = 0;
    for (const c of nextClips) {
      if (c.start + c.duration > maxEnd) maxEnd = c.start + c.duration;
    }
    const updated: Project = {
      ...projectRef.current,
      timeline: {
        ...projectRef.current.timeline,
        clips: nextClips,
        duration: Math.max(15, parseFloat(maxEnd.toFixed(2)))
      },
      updatedAt: Date.now()
    };
    persistProjectState(updated, { pushHistory: 'Move Clip', immediate: true });
  }, [persistProjectState]);

  // PointerUp Commit Hook for Clip Resize/Trim (Requirement 1 & 10)
  const commitClipTrim = useCallback((clipId: string, newStart: number, newDuration: number) => {
    const targetClip = projectRef.current.timeline.clips.find(c => c.id === clipId);
    if (!targetClip) return;

    if (targetClip.trackId === 'scene' && targetClip.sceneId) {
      const safeDuration = Math.max(MIN_SCENE_DURATION, parseFloat(newDuration.toFixed(2)));
      const updated = updateSceneInProject(projectRef.current, targetClip.sceneId, { duration: safeDuration });
      persistProjectState(updated, { pushHistory: 'Change Scene Duration', immediate: true });
    } else {
      const nextClips = trimIndependentClip(projectRef.current.timeline.clips, clipId, newStart, newDuration);
      let maxEnd = 0;
      for (const c of nextClips) {
        if (c.start + c.duration > maxEnd) maxEnd = c.start + c.duration;
      }
      const updated: Project = {
        ...projectRef.current,
        timeline: {
          ...projectRef.current.timeline,
          clips: nextClips,
          duration: Math.max(15, parseFloat(maxEnd.toFixed(2)))
        },
        updatedAt: Date.now()
      };
      persistProjectState(updated, { pushHistory: 'Trim Clip', immediate: true });
    }
  }, [persistProjectState]);

  const splitClipAtPlayhead = useCallback((targetClipId?: string) => {
    const clipToSplit = targetClipId
      ? projectRef.current.timeline.clips.find(c => c.id === targetClipId)
      : projectRef.current.timeline.clips.find(c => currentTime > c.start && currentTime < c.start + c.duration);
    if (!clipToSplit) return;

    const splitClips = splitClipAtTime(projectRef.current.timeline.clips, clipToSplit.id, currentTime);
    if (!splitClips) return;

    const updated = {
      ...projectRef.current,
      timeline: {
        ...projectRef.current.timeline,
        clips: splitClips
      },
      updatedAt: Date.now()
    };
    persistProjectState(updated, { pushHistory: 'Split Clip at Playhead', immediate: true });
  }, [currentTime, persistProjectState]);

  // Explicit semantic clip deletion (Requirement 12)
  // Delete Scene: deletes scene and all linked sequence clips
  // Delete Narration Clip: deletes narration clip only!
  // Delete Visual Clip: deletes visual clip only!
  // Delete Music/SFX Clip: deletes audio clip only!
  const deleteSelectedClip = useCallback(() => {
    if (selectedItem.type !== 'clip') return;
    const clip = projectRef.current.timeline.clips.find(c => c.id === selectedItem.id);
    if (!clip) return;

    if (clip.trackId === 'scene' && clip.sceneId) {
      // Delete Scene: delete scene and all linked sequence clips
      const updated = deleteSceneFromProject(projectRef.current, clip.sceneId);
      persistProjectState(updated, { pushHistory: 'Delete Scene', immediate: true });
      if (updated.scenes.length > 0) {
        setSelectedItem({ type: 'scene', id: updated.scenes[0].id });
      }
    } else {
      // Delete Narration, Visual, or Independent Audio Clip ONLY
      const result = deleteTimelineClip(
        projectRef.current.scenes,
        projectRef.current.timeline.clips,
        clip.id,
        projectRef.current.masterAudio
      );
      const updated: Project = {
        ...projectRef.current,
        timeline: {
          ...projectRef.current.timeline,
          clips: result.clips,
          duration: result.totalDuration
        },
        updatedAt: Date.now()
      };
      persistProjectState(updated, { pushHistory: `Delete ${clip.trackId} Clip`, immediate: true });
      if (projectRef.current.scenes.length > 0) {
        setSelectedItem({ type: 'scene', id: projectRef.current.scenes[0].id });
      }
    }
  }, [selectedItem, persistProjectState]);

  const fitTimelineZoom = useCallback(() => {
    // Fits entire project duration to typical timeline container width (~800px)
    const dur = Math.max(10, project.timeline.duration);
    const optimalZoom = Math.max(16, Math.min(70, Math.floor(760 / dur)));
    setTimelineZoom(optimalZoom);
  }, [project.timeline.duration]);

  // Project Management Actions
  const createNewProject = useCallback((
    name: string,
    resolution: ResolutionPreset,
    fps: FrameRatePreset,
    style: ArtStyle
  ) => {
    const newId = `proj_${Date.now()}`;
    const initialScene: Scene = {
      id: `sc_${newId}_1`,
      sceneNumber: 1,
      title: 'Opening Shot',
      scriptText: 'The morning sun pierces through the morning mist...',
      duration: 6,
      characterIds: [],
      visualAsset: {
        id: `vis_${newId}_1`,
        title: 'Opening Shot Concept',
        aspectRatio: '16:9',
        imageUrl: generateSceneArtwork({
          title: 'Opening Shot',
          prompt: 'Golden morning light over cinematic horizon',
          style,
          seed: 101,
          cameraPreset: 'zoom-in'
        })
      },
      animationPreset: 'zoom-in',
      lipSyncStatus: 'none',
      cameraMoveDescription: 'Slow majestic push-in',
      visualStyle: style,
      notes: ''
    };

    const newClips: TimelineClip[] = [
      {
        id: `clip_sc_${initialScene.id}`,
        trackId: 'scene',
        sceneId: initialScene.id,
        title: 'Scene 1: Opening Shot',
        start: 0,
        duration: 6,
        sourceIn: 0,
        sourceOut: 6,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.1,
        color: '#6c5ce7'
      },
      {
        id: `clip_nar_${initialScene.id}`,
        trackId: 'narration',
        sceneId: initialScene.id,
        title: '🎙 VO_Scene_01.m4a',
        start: 0,
        duration: 6,
        sourceIn: 0,
        sourceOut: 6,
        volume: 100,
        fadeIn: 0.1,
        fadeOut: 0.15,
        color: '#06b6d4',
        waveform: generateSpeechWaveform(40, 555)
      },
      {
        id: `clip_vis_${initialScene.id}`,
        trackId: 'visuals',
        sceneId: initialScene.id,
        assetId: initialScene.visualAsset?.id,
        title: '🖼 Opening Shot Concept',
        start: 0,
        duration: 6,
        sourceIn: 0,
        sourceOut: 6,
        volume: 100,
        fadeIn: 0.2,
        fadeOut: 0.2,
        color: '#8b5cf6'
      }
    ];

    const newProject: Project = {
      id: newId,
      name: name || 'Untitled Animation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        resolution,
        fps,
        defaultStyle: style,
        aspectRatio: resolution === '9:16' ? '9:16' : '16:9'
      },
      script: 'SCENE 1: OPENING SHOT\nThe morning sun pierces through the morning mist...',
      masterAudio: null,
      scenes: [initialScene],
      characters: [],
      assets: [],
      timeline: {
        clips: newClips,
        duration: 6
      },
      aiJobs: []
    };

    setAllProjects(prev => {
      const next = [newProject, ...prev];
      saveProjectsToStorage(next);
      return next;
    });

    setProject(newProject);
    setActiveProjectId(newId);
    setSelectedItem({ type: 'scene', id: initialScene.id });
    setCurrentTime(0);
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  const switchProject = useCallback((projectId: string) => {
    const found = allProjects.find(p => p.id === projectId);
    if (!found) return;
    setProject(found);
    setActiveProjectId(projectId);
    setSelectedItem({ type: 'scene', id: found.scenes[0]?.id || '' });
    setCurrentTime(0);
    setIsPlaying(false);
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, [allProjects]);

  const duplicateCurrentProject = useCallback(() => {
    const dup: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setAllProjects(prev => {
      const next = [dup, ...prev];
      saveProjectsToStorage(next);
      return next;
    });
    setProject(dup);
    setActiveProjectId(dup.id);
  }, [project]);

  const deleteCurrentProject = useCallback((projectId: string) => {
    if (allProjects.length <= 1) return;
    const remaining = allProjects.filter(p => p.id !== projectId);
    setAllProjects(remaining);
    saveProjectsToStorage(remaining);
    const nextActive = remaining[0];
    setProject(nextActive);
    setActiveProjectId(nextActive.id);
    setSelectedItem({ type: 'scene', id: nextActive.scenes[0]?.id || '' });
  }, [allProjects]);

  const resetToSampleProject = useCallback(() => {
    const demo = createDefaultProject();
    setAllProjects(prev => {
      const next = [demo, ...prev.filter(p => p.id !== demo.id)];
      saveProjectsToStorage(next);
      return next;
    });
    setProject(demo);
    setActiveProjectId(demo.id);
    setSelectedItem({ type: 'scene', id: demo.scenes[0].id });
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Keyboard Shortcuts listener (Space = play/pause, S = split, Ctrl+Z, Ctrl+Y, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in input / textarea / select
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        splitClipAtPlayhead();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedItem.type === 'clip') {
          e.preventDefault();
          deleteSelectedClip();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, splitClipAtPlayhead, deleteSelectedClip, undo, redo, selectedItem]);

  return (
    <StudioContext.Provider
      value={{
        project,
        allProjects,
        selectedItem,
        selectedScene,
        selectedCharacter,
        selectedClip,
        activeLeftTab,
        setActiveLeftTab,
        currentTime,
        setCurrentTime,
        isPlaying,
        setIsPlaying,
        playbackSpeed,
        setPlaybackSpeed,
        timelineZoom,
        setTimelineZoom,
        isTimelineExpanded,
        setIsTimelineExpanded,
        activeModal,
        setActiveModal,
        generateModalSceneId,
        setGenerateModalSceneId,
        characterEditId,
        setCharacterEditId,
        // 10,000+ Asset Library
        assetLibraryInitialCategory,
        setAssetLibraryInitialCategory,
        assetLibraryInitialQuery,
        setAssetLibraryInitialQuery,
        openAssetLibrary,
        applyAssetToScene,
        addLibraryCharacterToProject,
        addLibraryAudioToTimeline,
        applyPoseToScene,
        applyStylePreset,
        commandHistory,
        canUndo: undoStackRef.current.length > 0,
        canRedo: redoStackRef.current.length > 0,
        undo,
        redo,
        selectScene,
        selectCharacter,
        selectClip,
        selectProject,
        updateScript,
        autoSplitScriptIntoScenes,
        importMasterAudio,
        splitAudioForScenes,
        updateScene,
        addScene,
        deleteScene,
        reorderScenes,
        updateCharacter,
        addCharacter,
        deleteCharacter,
        startGenerateVisual,
        animateScene,
        lipSyncScene,
        cancelAIJob,
        retryAIJob,
        updateClip,
        moveClip,
        trimClip,
        commitClipMove,
        commitClipTrim,
        splitClipAtPlayhead,
        deleteSelectedClip,
        replaceSceneAudio,
        restoreMasterAudioForScene,
        fitTimelineZoom,
        createNewProject,
        switchProject,
        duplicateCurrentProject,
        deleteCurrentProject,
        resetToSampleProject,
        togglePlayPause
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
