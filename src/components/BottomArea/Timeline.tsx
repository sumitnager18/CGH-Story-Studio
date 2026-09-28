import React, { useState, useRef, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Magnet,
  Scissors,
  Undo2,
  Redo2,
  ArrowRightToLine,
  ArrowLeftToLine,
  Trash2,
  Volume2,
  VolumeX,
  Music,
  Mic,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { TimelineClip, TrackType } from '../../types';
import {
  timeToPixels,
  pixelsToTime,
  snapTimeToGrid,
  DEFAULT_SNAP_INTERVAL
} from '../../domain/timelineCoordinates';

// Supported interaction states strictly adhering to Specification Item 1
type InteractionState =
  | { mode: 'idle' }
  | {
      mode: 'draggingClip';
      clipId: string;
      initialStart: number;
      duration: number;
      trackId: TrackType;
      sceneId?: string;
      pointerId: number;
      startClientX: number;
      currentStart: number;
    }
  | {
      mode: 'resizingLeft';
      clipId: string;
      initialStart: number;
      initialDuration: number;
      trackId: TrackType;
      pointerId: number;
      startClientX: number;
      currentStart: number;
      currentDuration: number;
    }
  | {
      mode: 'resizingRight';
      clipId: string;
      initialStart: number;
      initialDuration: number;
      trackId: TrackType;
      sceneId?: string;
      pointerId: number;
      startClientX: number;
      currentDuration: number;
    }
  | {
      mode: 'draggingPlayhead';
      pointerId: number;
      startClientX: number;
    }
  | {
      mode: 'draggingSceneCard';
      sceneId: string;
      pointerId: number;
      startClientX: number;
      targetIndex: number;
    };

export const Timeline: React.FC = () => {
  const {
    project,
    selectedClip,
    selectClip,
    currentTime,
    setCurrentTime,
    timelineZoom,
    setTimelineZoom,
    isTimelineExpanded,
    setIsTimelineExpanded,
    commitClipMove,
    commitClipTrim,
    splitClipAtPlayhead,
    deleteSelectedClip,
    fitTimelineZoom,
    selectScene,
    canUndo,
    canRedo,
    undo,
    redo,
    selectedItem
  } = useStudio();

  const [snapEnabled, setSnapEnabled] = useState(true);
  const [mutedTracks, setMutedTracks] = useState<Record<string, boolean>>({});
  const [interaction, setInteraction] = useState<InteractionState>({ mode: 'idle' });

  const containerRef = useRef<HTMLDivElement>(null);
  const tracksScrollRef = useRef<HTMLDivElement>(null);

  const totalDuration = Math.max(15, project.timeline.duration);
  const timelinePixelWidth = Math.max(1000, timeToPixels(totalDuration, timelineZoom));

  // Track definitions
  const tracks: { id: TrackType; label: string; icon: any; color: string }[] = [
    { id: 'scene', label: '🎬 Scenes', icon: Film, color: '#6c5ce7' },
    { id: 'narration', label: '🎙 Narration', icon: Mic, color: '#06b6d4' },
    { id: 'visuals', label: '🖼 Visuals', icon: ImageIcon, color: '#8b5cf6' },
    { id: 'music', label: '🎵 Music', icon: Music, color: '#10b981' },
    { id: 'sfx', label: '🔊 SFX', icon: Volume2, color: '#f59e0b' }
  ];

  // =========================================================================
  // 1. TIMELINE INTERACTION & POINTER EVENTS ARCHITECTURE
  // =========================================================================

  // Handle Playhead Scrubbing from Time Ruler / Needle
  const handlePlayheadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!tracksScrollRef.current) return;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const rect = tracksScrollRef.current.getBoundingClientRect();
    const scrollLeft = tracksScrollRef.current.scrollLeft;
    const rawTime = pixelsToTime(e.clientX, timelineZoom, scrollLeft, rect.left);
    const snappedTime = snapTimeToGrid(rawTime, snapEnabled, e.shiftKey, DEFAULT_SNAP_INTERVAL);
    const boundedTime = Math.min(totalDuration, Math.max(0, snappedTime));

    setCurrentTime(boundedTime);
    setInteraction({
      mode: 'draggingPlayhead',
      pointerId: e.pointerId,
      startClientX: e.clientX
    });
  };

  // Start clip dragging (move)
  const handleClipBodyPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    clip: TimelineClip
  ) => {
    e.preventDefault();
    e.stopPropagation();
    selectClip(clip.id);
    if (clip.sceneId) {
      selectScene(clip.sceneId);
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setInteraction({
      mode: 'draggingClip',
      clipId: clip.id,
      initialStart: clip.start,
      duration: clip.duration,
      trackId: clip.trackId,
      sceneId: clip.sceneId,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      currentStart: clip.start
    });
  };

  // Start clip trim left
  const handleClipTrimLeftPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    clip: TimelineClip
  ) => {
    e.preventDefault();
    e.stopPropagation();
    selectClip(clip.id);
    if (clip.sceneId) {
      selectScene(clip.sceneId);
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setInteraction({
      mode: 'resizingLeft',
      clipId: clip.id,
      initialStart: clip.start,
      initialDuration: clip.duration,
      trackId: clip.trackId,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      currentStart: clip.start,
      currentDuration: clip.duration
    });
  };

  // Start clip trim right
  const handleClipTrimRightPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    clip: TimelineClip
  ) => {
    e.preventDefault();
    e.stopPropagation();
    selectClip(clip.id);
    if (clip.sceneId) {
      selectScene(clip.sceneId);
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    setInteraction({
      mode: 'resizingRight',
      clipId: clip.id,
      initialStart: clip.start,
      initialDuration: clip.duration,
      trackId: clip.trackId,
      sceneId: clip.sceneId,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      currentDuration: clip.duration
    });
  };

  // Pointer Move: Update LOCAL state ONLY (No persistence, no undo push, no zoom changes)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interaction.mode === 'idle') return;

    if (interaction.mode === 'draggingPlayhead') {
      if (!tracksScrollRef.current) return;
      const rect = tracksScrollRef.current.getBoundingClientRect();
      const scrollLeft = tracksScrollRef.current.scrollLeft;
      const rawTime = pixelsToTime(e.clientX, timelineZoom, scrollLeft, rect.left);
      const snappedTime = snapTimeToGrid(rawTime, snapEnabled, e.shiftKey, DEFAULT_SNAP_INTERVAL);
      const boundedTime = Math.min(totalDuration, Math.max(0, snappedTime));
      setCurrentTime(boundedTime);
      return;
    }

    const deltaX = e.clientX - interaction.startClientX;
    const deltaSeconds = deltaX / timelineZoom;

    if (interaction.mode === 'draggingClip') {
      const rawStart = interaction.initialStart + deltaSeconds;
      const snappedStart = snapTimeToGrid(rawStart, snapEnabled, e.shiftKey, DEFAULT_SNAP_INTERVAL);
      setInteraction(prev =>
        prev.mode === 'draggingClip' ? { ...prev, currentStart: snappedStart } : prev
      );
    } else if (interaction.mode === 'resizingLeft') {
      const rawStart = interaction.initialStart + deltaSeconds;
      const snappedStart = snapTimeToGrid(rawStart, snapEnabled, e.shiftKey, DEFAULT_SNAP_INTERVAL);
      const minDur = interaction.trackId === 'scene' ? 2.0 : 0.5;
      const maxStart = interaction.initialStart + interaction.initialDuration - minDur;
      const safeStart = Math.min(maxStart, Math.max(0, snappedStart));
      const safeDuration = parseFloat((interaction.initialDuration - (safeStart - interaction.initialStart)).toFixed(2));
      setInteraction(prev =>
        prev.mode === 'resizingLeft'
          ? { ...prev, currentStart: safeStart, currentDuration: safeDuration }
          : prev
      );
    } else if (interaction.mode === 'resizingRight') {
      const rawDuration = interaction.initialDuration + deltaSeconds;
      const minDur = interaction.trackId === 'scene' ? 2.0 : 0.5;
      const snappedDuration = Math.max(minDur, snapTimeToGrid(rawDuration, snapEnabled, e.shiftKey, DEFAULT_SNAP_INTERVAL));
      setInteraction(prev =>
        prev.mode === 'resizingRight'
          ? { ...prev, currentDuration: snappedDuration }
          : prev
      );
    }
  };

  // Pointer Up / Cancel: Commit EXACTLY ONE project mutation, validate, push history, and autosave
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interaction.mode === 'idle') return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(interaction.pointerId);
    } catch (_) {}

    if (interaction.mode === 'draggingClip') {
      commitClipMove(interaction.clipId, interaction.currentStart);
    } else if (interaction.mode === 'resizingLeft') {
      commitClipTrim(interaction.clipId, interaction.currentStart, interaction.currentDuration);
    } else if (interaction.mode === 'resizingRight') {
      commitClipTrim(interaction.clipId, interaction.initialStart, interaction.currentDuration);
    }

    setInteraction({ mode: 'idle' });
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    setInteraction({ mode: 'idle' });
  };

  // =========================================================================
  // 18. TIMELINE TOOLBAR (Icon-First Buttons, Shortcut Only In Tooltips)
  // =========================================================================

  const handleSetInPoint = useCallback(() => {
    if (selectedClip && currentTime > selectedClip.start && currentTime < selectedClip.start + selectedClip.duration) {
      const newStart = currentTime;
      const newDuration = parseFloat((selectedClip.duration - (currentTime - selectedClip.start)).toFixed(2));
      commitClipTrim(selectedClip.id, newStart, newDuration);
    }
  }, [selectedClip, currentTime, commitClipTrim]);

  const handleSetOutPoint = useCallback(() => {
    if (selectedClip && currentTime > selectedClip.start && currentTime < selectedClip.start + selectedClip.duration) {
      const newDuration = parseFloat((currentTime - selectedClip.start).toFixed(2));
      commitClipTrim(selectedClip.id, selectedClip.start, newDuration);
    }
  }, [selectedClip, currentTime, commitClipTrim]);

  const toggleTrackMute = (trackId: string) => {
    setMutedTracks(prev => ({ ...prev, [trackId]: !prev[trackId] }));
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`bg-[#141418] border-t border-[#25252e] flex flex-col select-none transition-all duration-200 ${
        isTimelineExpanded ? 'h-72 2xl:h-80' : 'h-48 2xl:h-54'
      }`}
    >
      {/* Timeline Controls Toolbar — Icon-First Buttons (Requirement 18) */}
      <div className="h-8 bg-[#18181f] border-b border-[#25252e] px-3 flex items-center justify-between text-xs text-slate-300 shrink-0">
        <div className="flex items-center gap-1">
          {/* Split at Playhead (Scissors Icon) */}
          <button
            onClick={() => splitClipAtPlayhead()}
            className="p-1.5 rounded bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 border border-[#2e2e3a] transition-colors"
            title="Split Clip at Playhead (S)"
            aria-label="Split Clip at Playhead (S)"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Undo Button (Undo Icon) */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded border transition-colors ${
              canUndo
                ? 'bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 border-[#2e2e3a]'
                : 'bg-[#1a1a20] text-slate-600 border-[#222228] cursor-not-allowed'
            }`}
            title="Undo (Cmd+Z / Ctrl+Z)"
            aria-label="Undo (Cmd+Z / Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          {/* Redo Button (Redo Icon) */}
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded border transition-colors ${
              canRedo
                ? 'bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 border-[#2e2e3a]'
                : 'bg-[#1a1a20] text-slate-600 border-[#222228] cursor-not-allowed'
            }`}
            title="Redo (Cmd+Y / Ctrl+Y)"
            aria-label="Redo (Cmd+Y / Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-[#2a2a34] mx-1" />

          {/* Set In Point (In-point Icon) */}
          <button
            onClick={handleSetInPoint}
            disabled={!selectedClip}
            className={`p-1.5 rounded border transition-colors ${
              selectedClip
                ? 'bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 border-[#2e2e3a]'
                : 'bg-[#1a1a20] text-slate-600 border-[#222228] cursor-not-allowed'
            }`}
            title="Set In Point at Playhead (I)"
            aria-label="Set In Point at Playhead (I)"
          >
            <ArrowRightToLine className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Set Out Point (Out-point Icon) */}
          <button
            onClick={handleSetOutPoint}
            disabled={!selectedClip}
            className={`p-1.5 rounded border transition-colors ${
              selectedClip
                ? 'bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 border-[#2e2e3a]'
                : 'bg-[#1a1a20] text-slate-600 border-[#222228] cursor-not-allowed'
            }`}
            title="Set Out Point at Playhead (O)"
            aria-label="Set Out Point at Playhead (O)"
          >
            <ArrowLeftToLine className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Delete Clip (Trash Icon) */}
          <button
            onClick={deleteSelectedClip}
            disabled={selectedItem.type !== 'clip'}
            className={`p-1.5 rounded border transition-colors ${
              selectedItem.type === 'clip'
                ? 'bg-[#22222b] hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 border-[#2e2e3a] hover:border-rose-800'
                : 'bg-[#1a1a20] text-slate-600 border-[#222228] cursor-not-allowed'
            }`}
            title="Delete Selected Clip (Del / Backspace)"
            aria-label="Delete Selected Clip (Del / Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3.5 bg-[#2a2a34] mx-1" />

          {/* Snapping Toggle (Magnet Icon) */}
          <button
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`p-1.5 rounded border transition-colors ${
              snapEnabled
                ? 'bg-[#6c5ce7]/20 border-[#6c5ce7] text-[#a29bfe]'
                : 'bg-[#1e1e24] border-[#2e2e38] text-slate-500'
            }`}
            title={`Toggle Snapping 0.25s (N) [${snapEnabled ? 'Enabled' : 'Disabled'}]`}
            aria-label="Toggle Snapping 0.25s (N)"
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom & Expansion Controls */}
        <div className="flex items-center gap-3">
          {/* FIT Button (Fit Icon) */}
          <button
            onClick={fitTimelineZoom}
            className="p-1.5 rounded bg-[#22222c] hover:bg-[#2e2e3a] text-cyan-300 border border-[#2d2d3a] transition-colors"
            title="Fit Entire Timeline to Window (F)"
            aria-label="Fit Entire Timeline to Window (F)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Controls (Requirements 17: Zoom changes only through slider / buttons) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTimelineZoom(prev => Math.max(16, prev - 8))}
              className="text-slate-400 hover:text-white p-0.5"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={16}
              max={80}
              value={timelineZoom}
              onChange={(e) => setTimelineZoom(parseInt(e.target.value))}
              className="w-20 accent-[#6c5ce7] cursor-pointer h-1 bg-[#252530]"
              title={`Zoom: ${timelineZoom} px/sec`}
            />
            <button
              onClick={() => setTimelineZoom(prev => Math.min(80, prev + 8))}
              className="text-slate-400 hover:text-white p-0.5"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-[1px] h-3.5 bg-[#2a2a34]" />

          {/* Expand / Compact View Toggle */}
          <button
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
            title={isTimelineExpanded ? 'Compact Timeline' : 'Expand Timeline'}
            aria-label={isTimelineExpanded ? 'Compact Timeline' : 'Expand Timeline'}
          >
            {isTimelineExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Timeline Workspace: Left Track Headers & Right Lanes */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left Track Headers Column (Fixed Width — Excluded from timeline coordinate calculations) */}
        <div className="w-32 2xl:w-36 bg-[#17171d] border-r border-[#262632] flex flex-col shrink-0 z-20 shadow-md select-none">
          {/* Top ruler placeholder aligner */}
          <div className="h-6 bg-[#1a1a22] border-b border-[#262632] px-2 flex items-center text-[10px] text-slate-400 font-mono">
            TRACKS
          </div>

          {/* Track Labels */}
          {tracks.map(t => (
            <div
              key={t.id}
              className="h-8 2xl:h-9 border-b border-[#23232c] px-2 flex items-center justify-between text-[11px] font-medium text-slate-300 hover:bg-[#1f1f28] transition-colors"
            >
              <span className="truncate">{t.label}</span>
              <button
                onClick={() => toggleTrackMute(t.id)}
                className="p-1 text-slate-500 hover:text-slate-300"
                title="Mute Track"
              >
                {mutedTracks[t.id] ? (
                  <VolumeX className="w-3 h-3 text-rose-400" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Right Scrollable Timeline Viewport — Authoritative Media Lane (Requirement 15) */}
        <div
          ref={tracksScrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#121216]"
        >
          <div
            className="relative h-full"
            style={{ width: `${timelinePixelWidth}px` }}
          >
            {/* Top Time Ruler */}
            <div
              onPointerDown={handlePlayheadPointerDown}
              className="h-6 bg-[#181820] border-b border-[#262632] cursor-pointer relative select-none"
            >
              {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => {
                const isMajor = sec % 5 === 0;
                return (
                  <div
                    key={sec}
                    className="absolute top-0 bottom-0 pointer-events-none"
                    style={{ left: `${timeToPixels(sec, timelineZoom)}px` }}
                  >
                    <div
                      className={`w-[1px] ${
                        isMajor ? 'h-full bg-slate-500' : 'h-2 bg-slate-700'
                      }`}
                    />
                    {isMajor && (
                      <span className="absolute top-1 left-1 font-mono text-[9px] text-slate-400">
                        {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Track Lanes */}
            {tracks.map(t => {
              const isMuted = mutedTracks[t.id];
              const clipsOnTrack = project.timeline.clips.filter(c => c.trackId === t.id);

              return (
                <div
                  key={t.id}
                  className={`h-8 2xl:h-9 border-b border-[#1e1e26] relative transition-opacity ${
                    isMuted ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  {/* Subtle 5-second vertical guides */}
                  {Array.from({ length: Math.ceil(totalDuration / 5) + 1 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 w-[1px] bg-white/[0.03] pointer-events-none"
                      style={{ left: `${timeToPixels(i * 5, timelineZoom)}px` }}
                    />
                  ))}

                  {/* Render Clips with Local Visual Interaction State (Requirement 1) */}
                  {clipsOnTrack.map(clip => {
                    const isSelected = selectedClip?.id === clip.id;

                    // Compute dynamic visual coordinates from local interaction state during drag
                    let displayStart = clip.start;
                    let displayDuration = clip.duration;

                    if (interaction.mode === 'draggingClip' && interaction.clipId === clip.id) {
                      displayStart = interaction.currentStart;
                    } else if (interaction.mode === 'resizingLeft' && interaction.clipId === clip.id) {
                      displayStart = interaction.currentStart;
                      displayDuration = interaction.currentDuration;
                    } else if (interaction.mode === 'resizingRight' && interaction.clipId === clip.id) {
                      displayDuration = interaction.currentDuration;
                    }

                    const clipLeft = timeToPixels(displayStart, timelineZoom);
                    const clipWidth = timeToPixels(displayDuration, timelineZoom);

                    return (
                      <div
                        key={clip.id}
                        onPointerDown={(e) => handleClipBodyPointerDown(e, clip)}
                        className={`absolute top-1 bottom-1 rounded overflow-hidden cursor-grab active:cursor-grabbing border text-[10px] select-none flex items-center px-1.5 transition-shadow ${
                          isSelected
                            ? 'ring-2 ring-white shadow-lg z-10'
                            : 'border-black/40 shadow-xs'
                        }`}
                        style={{
                          left: `${clipLeft}px`,
                          width: `${clipWidth}px`,
                          backgroundColor: clip.color || t.color
                        }}
                      >
                        {/* Left Trim Handle (Pointer Capture Resize) */}
                        <div
                          onPointerDown={(e) => handleClipTrimLeftPointerDown(e, clip)}
                          className="absolute left-0 top-0 bottom-0 w-2.5 hover:w-3 bg-black/30 hover:bg-white/40 cursor-ew-resize transition-all z-10"
                          title="Trim Left Edge"
                        />

                        {/* Clip Waveform visual (if audio) */}
                        {clip.waveform && clip.waveform.length > 0 && (
                          <div className="absolute inset-0 flex items-center gap-[1px] px-2 opacity-35 pointer-events-none">
                            {clip.waveform.map((val, wIdx) => (
                              <div
                                key={wIdx}
                                className="flex-1 bg-white rounded-xs"
                                style={{ height: `${Math.max(15, val * 85)}%` }}
                              />
                            ))}
                          </div>
                        )}

                        {/* Title text */}
                        <span className="relative z-0 font-medium text-white drop-shadow truncate pr-2">
                          {clip.title}
                        </span>

                        {/* Right Trim Handle (Pointer Capture Resize) */}
                        <div
                          onPointerDown={(e) => handleClipTrimRightPointerDown(e, clip)}
                          className="absolute right-0 top-0 bottom-0 w-2.5 hover:w-3 bg-black/30 hover:bg-white/40 cursor-ew-resize transition-all z-10"
                          title="Trim Right Edge"
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Movable Playhead Indicator (Strictly bounded to media area — Requirement 16) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-30"
              style={{ left: `${timeToPixels(currentTime, timelineZoom)}px` }}
            >
              {/* Playhead Head (Triangle & Grabber) */}
              <div
                onPointerDown={handlePlayheadPointerDown}
                className="relative -left-2.5 top-0 w-5 h-6 flex flex-col items-center pointer-events-auto cursor-ew-resize"
                title="Scrub Playhead"
              >
                <div className="w-3.5 h-3.5 bg-rose-500 rotate-45 rounded-xs shadow-md shadow-rose-500/50" />
              </div>
              {/* Playhead Vertical Needle Line */}
              <div className="w-[2px] h-full bg-rose-500 shadow-sm shadow-rose-500/80 -ml-[1px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
