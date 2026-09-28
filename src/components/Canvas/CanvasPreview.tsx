import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  Camera,
  Grid,
  Subtitles,
  Film,
  Eye,
  Sliders
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { CameraPreset } from '../../types';

export const CanvasPreview: React.FC = () => {
  const {
    project,
    selectedScene,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    playbackSpeed,
    setPlaybackSpeed,
    updateScene,
    setActiveModal,
    setGenerateModalSceneId,
    openAssetLibrary
  } = useStudio();

  const [showSafeGrid, setShowSafeGrid] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isCinematicFullscreen, setIsCinematicFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Format timecode (MM:SS:FF)
  const formatTimecode = (seconds: number) => {
    const fps = project.settings.fps || 24;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * fps);

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const totalDuration = project.timeline.duration || 30;

  // Camera preset animation class
  const getCameraAnimationClass = (preset?: CameraPreset) => {
    if (!isPlaying) return '';
    switch (preset) {
      case 'pan-left': return 'anim-pan-left';
      case 'pan-right': return 'anim-pan-right';
      case 'zoom-in': return 'anim-zoom-in';
      case 'zoom-out': return 'anim-zoom-out';
      case 'orbit': return 'anim-orbit';
      case 'shake': return 'anim-shake';
      case 'dolly-zoom': return 'anim-dolly-zoom';
      default: return '';
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(totalDuration, seconds)));
  };

  const stepFrames = (framesDelta: number) => {
    const fps = project.settings.fps || 24;
    handleSeek(currentTime + framesDelta / fps);
  };

  const assignedCharacters = selectedScene?.characterIds.map(cid =>
    project.characters.find(c => c.id === cid)
  ).filter(Boolean) || [];

  return (
    <div className={`flex-1 flex flex-col min-w-0 bg-[#121215] overflow-hidden select-none ${
      isCinematicFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
    }`}>
      {/* Canvas Top Bar */}
      <div className="h-10 bg-[#16161b] border-b border-[#25252e] px-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-[#6c5ce7]" />
            CANVAS MONITOR
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300 font-mono text-[11px]">
            {selectedScene ? `Scene 0${selectedScene.sceneNumber}: ${selectedScene.title}` : 'No Scene Selected'}
          </span>
          {selectedScene && (
            <span className="text-[10px] bg-[#22222c] text-cyan-300 px-1.5 py-0.5 rounded border border-[#2e2e3a] font-mono">
              {selectedScene.visualStyle.toUpperCase()}
            </span>
          )}
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Camera preset quick changer */}
          {selectedScene && (
            <div className="flex items-center gap-1 mr-2 bg-[#1b1b22] px-2 py-0.5 rounded border border-[#2a2a34]">
              <Camera className="w-3 h-3 text-[#6c5ce7]" />
              <select
                value={selectedScene.animationPreset}
                onChange={(e) => updateScene(selectedScene.id, { animationPreset: e.target.value as CameraPreset }, 'Change Camera Motion')}
                className="bg-transparent text-[11px] text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="none" className="bg-[#1a1a20]">Static Frame</option>
                <option value="pan-left" className="bg-[#1a1a20]">Pan Left</option>
                <option value="pan-right" className="bg-[#1a1a20]">Pan Right</option>
                <option value="zoom-in" className="bg-[#1a1a20]">Slow Push In</option>
                <option value="zoom-out" className="bg-[#1a1a20]">Slow Pull Out</option>
                <option value="orbit" className="bg-[#1a1a20]">3D Orbit</option>
                <option value="shake" className="bg-[#1a1a20]">Action Shake</option>
                <option value="dolly-zoom" className="bg-[#1a1a20]">Dolly Zoom</option>
              </select>
            </div>
          )}

          <button
            onClick={() => setShowSafeGrid(!showSafeGrid)}
            className={`p-1.5 rounded transition-colors ${showSafeGrid ? 'text-[#8e7df5] bg-[#6c5ce7]/20' : 'text-slate-400 hover:text-slate-200'}`}
            title="Toggle Rule-of-Thirds & Safe Area Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowSubtitles(!showSubtitles)}
            className={`p-1.5 rounded transition-colors ${showSubtitles ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'}`}
            title="Toggle Subtitles Teleprompter"
          >
            <Subtitles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsCinematicFullscreen(!isCinematicFullscreen)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#25252e] transition-colors"
            title="Toggle Fullscreen Preview"
          >
            {isCinematicFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-4 overflow-hidden relative bg-[#0d0d10]">
        {/* Aspect Ratio Box (16:9 standard preview container) */}
        <div className="relative w-full max-w-[960px] aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-[#23232c] flex items-center justify-center group">
          {/* Visual Artwork Layer */}
          {selectedScene?.visualAsset?.imageUrl ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={selectedScene.visualAsset.imageUrl}
                alt={selectedScene.title}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${getCameraAnimationClass(selectedScene.animationPreset)}`}
              />
              {/* Cinematic subtle film grain */}
              <div className="absolute inset-0 pointer-events-none film-grain opacity-40" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#1e1e28] flex items-center justify-center border border-[#333344] text-[#6c5ce7]">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">No Keyframe Visual Generated</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Generate an AI storyboard illustration from this scene's script text and character consistency locks.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    if (selectedScene) {
                      setGenerateModalSceneId(selectedScene.id);
                      setActiveModal('generate-visual');
                    }
                  }}
                  className="text-xs bg-[#6c5ce7] hover:bg-[#5849d4] text-white px-3.5 py-2 rounded-md font-semibold flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate with AI</span>
                </button>
                <button
                  onClick={() => openAssetLibrary('backgrounds')}
                  className="text-xs bg-[#1a1a24] hover:bg-[#252532] text-cyan-300 border border-cyan-800/50 hover:border-cyan-600 px-3.5 py-2 rounded-md font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>✨ Pick from 10k+ Assets</span>
                </button>
              </div>
            </div>
          )}

          {/* Safe Area & Rule of Thirds Grid Overlay */}
          {showSafeGrid && (
            <div className="absolute inset-0 pointer-events-none border border-white/10 m-6">
              {/* 90% Safe Title Margin */}
              <div className="w-full h-full border border-white/15 relative">
                {/* Horizontal grid lines */}
                <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/10" />
                {/* Vertical grid lines */}
                <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/10" />
                <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/10" />
                {/* Center Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30" />
                </div>
              </div>
            </div>
          )}

          {/* Character Overlays Floating Pill */}
          {assignedCharacters.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
              {assignedCharacters.map(char => (
                <div
                  key={char!.id}
                  className="bg-black/80 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-2 shadow-lg"
                >
                  <img
                    src={char!.referenceImage}
                    alt={char!.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/30"
                  />
                  <span className="text-[11px] font-semibold text-white">{char!.name}</span>
                  <span className="text-[9px] text-emerald-400 font-mono">
                    {char!.consistencyScore}% Lock
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Active Camera Movement Badge */}
          {selectedScene && selectedScene.animationPreset !== 'none' && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xs border border-[#6c5ce7]/50 text-white text-[10px] font-mono px-2 py-1 rounded flex items-center gap-1.5 pointer-events-none">
              <Camera className="w-3 h-3 text-[#a29bfe]" />
              <span className="uppercase tracking-wider">
                {selectedScene.animationPreset}
              </span>
              {isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </div>
          )}

          {/* Subtitle / Script Teleprompter Overlay */}
          {showSubtitles && selectedScene && (
            <div className="absolute bottom-6 left-8 right-8 text-center pointer-events-none">
              <div className="inline-block bg-black/85 backdrop-blur-md px-4 py-2 rounded-lg border border-white/15 max-w-2xl shadow-xl">
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug drop-shadow-md">
                  {selectedScene.scriptText}
                </p>
              </div>
            </div>
          )}

          {/* Live Watermark / Frame Code */}
          <div className="absolute bottom-2 left-3 text-[9px] font-mono text-white/50 pointer-events-none">
            {formatTimecode(currentTime)} • {project.settings.resolution} • {project.settings.fps}FPS
          </div>
        </div>
      </div>

      {/* Canvas Transport Controls Bar */}
      <div className="h-12 bg-[#17171c] border-t border-[#25252e] px-4 flex items-center justify-between select-none">
        {/* Timecode Readouts */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#101014] px-2.5 py-1 rounded border border-[#262632] text-white font-semibold">
            {formatTimecode(currentTime)}
          </div>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400 text-[11px]">
            {formatTimecode(totalDuration)}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => stepFrames(-1)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#252530] transition-colors"
            title="Previous Frame (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-[#6c5ce7] hover:bg-[#5849d4] shadow-[#6c5ce7]/30 scale-105'
            }`}
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => stepFrames(1)}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-[#252530] transition-colors"
            title="Next Frame (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & Volume Controls */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#1c1c24] px-2 py-0.5 rounded border border-[#2a2a36]">
            <span className="text-[10px] text-slate-400">Speed:</span>
            {[1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`text-[10px] px-1 rounded font-mono ${
                  playbackSpeed === spd
                    ? 'bg-[#6c5ce7] text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Audio Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#24242e]"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
