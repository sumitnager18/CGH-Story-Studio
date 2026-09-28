import React, { useRef } from 'react';
import {
  Sliders,
  Film,
  User,
  Volume2,
  Settings,
  Sparkles,
  Camera,
  ShieldCheck,
  Palette,
  Clock,
  Split,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Mic,
  FileAudio,
  Radio,
  Upload
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ArtStyle, CameraPreset, ResolutionPreset, FrameRatePreset } from '../../types';

export const InspectorPanel: React.FC = () => {
  const {
    project,
    selectedItem,
    selectedScene,
    selectedCharacter,
    selectedClip,
    updateScene,
    updateCharacter,
    updateClip,
    splitClipAtPlayhead,
    deleteSelectedClip,
    replaceSceneAudio,
    restoreMasterAudioForScene,
    setActiveModal,
    setGenerateModalSceneId,
    openAssetLibrary
  } = useStudio();

  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Compute Overall Audio Mode (Requirements 7 & 8)
  const hasMaster = Boolean(project.masterAudio);
  const customScenesCount = project.scenes.filter(s => s.audioMode === 'custom').length;
  const masterScenesCount = project.scenes.filter(s => s.audioMode === 'master' || (hasMaster && s.audioMode !== 'custom')).length;

  let overallAudioMode: 'Master' | 'Scene' | 'Mixed' = 'Scene';
  if (hasMaster) {
    if (customScenesCount > 0 && masterScenesCount > 0) {
      overallAudioMode = 'Mixed';
    } else if (customScenesCount === 0) {
      overallAudioMode = 'Master';
    } else {
      overallAudioMode = 'Scene';
    }
  }

  // Handle custom audio file selection
  const handleCustomAudioFile = (sceneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const blobUrl = URL.createObjectURL(file);
    const audioObj = new Audio(blobUrl);

    audioObj.onloadedmetadata = () => {
      const dur = parseFloat(audioObj.duration.toFixed(2)) || (selectedScene?.duration ?? 6);
      replaceSceneAudio(sceneId, fileName, dur, blobUrl);
    };

    audioObj.onerror = () => {
      // Fallback duration if browser cannot decode blob
      replaceSceneAudio(sceneId, fileName, selectedScene?.duration ?? 6, blobUrl);
    };

    e.target.value = '';
  };

  return (
    <aside className="w-[300px] 2xl:w-[340px] h-full bg-[#1a1a1e] border-l border-[#2a2a31] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Inspector Header */}
      <div className="h-10 bg-[#16161a] border-b border-[#2a2a31] px-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Sliders className="w-3.5 h-3.5 text-[#6c5ce7]" />
          <span>INSPECTOR</span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-[#212128]">
          {selectedItem.type}
        </span>
      </div>

      {/* Inspector Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* ================= SCENE INSPECTOR ================= */}
        {selectedItem.type === 'scene' && selectedScene && (
          <div className="space-y-3.5">
            {/* Scene Header Info */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Scene Title</label>
              <input
                type="text"
                value={selectedScene.title}
                onChange={(e) => updateScene(selectedScene.id, { title: e.target.value })}
                className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Duration (Seconds)</label>
                <span className="font-mono text-cyan-400 font-semibold">{selectedScene.duration}s</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={0.5}
                value={selectedScene.duration}
                onChange={(e) => updateScene(selectedScene.id, { duration: parseFloat(e.target.value) }, 'Change Scene Duration')}
                className="w-full accent-[#6c5ce7] cursor-pointer"
              />
            </div>

            {/* Script Text Description */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Script & Narration</label>
              <textarea
                rows={3}
                value={selectedScene.scriptText}
                onChange={(e) => updateScene(selectedScene.id, { scriptText: e.target.value })}
                className="w-full bg-[#141418] border border-[#2a2a34] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7] resize-none leading-relaxed"
              />
            </div>

            {/* Visual Style & Camera Preset Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Art Style</label>
                <select
                  value={selectedScene.visualStyle}
                  onChange={(e) => updateScene(selectedScene.id, { visualStyle: e.target.value as ArtStyle }, 'Change Visual Style')}
                  className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="anime">Anime</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="realistic">Realistic 35mm</option>
                  <option value="3D">3D Stylized Cinema</option>
                  <option value="comic">Graphic Comic</option>
                  <option value="oil-painting">Oil Painting</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Camera Motion</label>
                <select
                  value={selectedScene.animationPreset}
                  onChange={(e) => updateScene(selectedScene.id, { animationPreset: e.target.value as CameraPreset }, 'Change Camera Motion')}
                  className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="none">None (Static)</option>
                  <option value="pan-left">Pan Left</option>
                  <option value="pan-right">Pan Right</option>
                  <option value="zoom-in">Zoom In</option>
                  <option value="zoom-out">Zoom Out</option>
                  <option value="orbit">3D Orbit</option>
                  <option value="shake">Action Shake</option>
                  <option value="dolly-zoom">Dolly Zoom</option>
                </select>
              </div>
            </div>

            {/* Character Assignment Checklist */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
                <span>Cast in Scene</span>
                <span className="text-[9px] text-slate-400">Locks Visual Consistency</span>
              </label>
              <div className="bg-[#141418] border border-[#25252e] rounded p-2 space-y-1.5">
                {project.characters.length === 0 ? (
                  <span className="text-[11px] text-slate-400 italic">No characters created yet</span>
                ) : (
                  project.characters.map((char) => {
                    const isAssigned = selectedScene.characterIds.includes(char.id);
                    return (
                      <label
                        key={char.id}
                        className="flex items-center justify-between p-1 rounded hover:bg-[#1e1e26] cursor-pointer text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...selectedScene.characterIds, char.id]
                                : selectedScene.characterIds.filter(id => id !== char.id);
                              updateScene(selectedScene.id, { characterIds: nextIds }, 'Update Character Assignment');
                            }}
                            className="rounded bg-[#20202a] border-[#3a3a48] text-[#6c5ce7] focus:ring-0"
                          />
                          <span className="text-slate-200">{char.name}</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-mono">
                          {char.consistencyScore}% Lock
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI Generation Metadata Display */}
            {selectedScene.visualAsset?.metadata && (
              <div className="bg-[#131317] border border-[#262632] rounded p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-[#a29bfe] font-semibold border-b border-[#22222a] pb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#6c5ce7]" />
                    AI Metadata
                  </span>
                  <span className="font-mono text-slate-400">
                    Seed: #{selectedScene.visualAsset.metadata.seed}
                  </span>
                </div>
                <div className="text-[10px] space-y-1 font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-slate-300">{selectedScene.visualAsset.metadata.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guidance (CFG):</span>
                    <span className="text-slate-300">{selectedScene.visualAsset.metadata.cfgScale}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Steps:</span>
                    <span className="text-slate-300">{selectedScene.visualAsset.metadata.steps}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene Audio & Voiceover (Requirements 7 & 8: Master, Scene, Mixed Mode) */}
            <div className="bg-[#131317] border border-[#262632] rounded p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-semibold pb-1 border-b border-[#22222a]">
                <div className="flex items-center gap-1 text-slate-300">
                  <Mic className="w-3 h-3 text-cyan-400" />
                  <span>Scene Audio & Voiceover</span>
                </div>
                {/* Global Project Audio Mode Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                    overallAudioMode === 'Master'
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                      : overallAudioMode === 'Mixed'
                      ? 'bg-violet-950/60 text-violet-300 border border-violet-800/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  }`}
                  title={`Project Audio Mode: ${overallAudioMode}`}
                >
                  Mode: {overallAudioMode}
                </span>
              </div>

              {/* Active Audio Source Display */}
              <div className="space-y-1 text-[11px]">
                {selectedScene.audioMode === 'custom' ? (
                  <div className="bg-amber-950/20 border border-amber-800/30 rounded p-2 space-y-1">
                    <div className="flex items-center justify-between text-amber-400 text-[10px] font-semibold">
                      <span className="flex items-center gap-1">
                        <FileAudio className="w-3 h-3" />
                        <span>Custom Audio Override</span>
                      </span>
                      <span className="font-mono">{selectedScene.customAudioDuration || selectedScene.duration}s</span>
                    </div>
                    <div className="text-slate-300 text-[11px] font-medium truncate">
                      {selectedScene.customAudioName || 'Custom VO File'}
                    </div>
                    <p className="text-[9px] text-slate-400">
                      This scene overrides the master audio track. Other scenes remain synchronized.
                    </p>
                  </div>
                ) : project.masterAudio ? (
                  <div className="bg-cyan-950/20 border border-cyan-800/30 rounded p-2 space-y-1">
                    <div className="flex items-center justify-between text-cyan-400 text-[10px] font-semibold">
                      <span className="flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        <span>Master Audio Segment</span>
                      </span>
                      <span className="font-mono">
                        {project.masterAudio.segments.find(s => s.sceneId === selectedScene.id)?.sourceIn ?? 0}s –{' '}
                        {project.masterAudio.segments.find(s => s.sceneId === selectedScene.id)?.sourceOut ?? selectedScene.duration}s
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px] font-medium truncate">
                      {project.masterAudio.fileName} [Scene 0{selectedScene.sceneNumber}]
                    </div>
                    <p className="text-[9px] text-slate-400">
                      Sliced from continuous master narration track.
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#1a1a22] border border-[#282834] rounded p-2 space-y-1 text-slate-400">
                    <div className="text-[10px] font-semibold text-slate-300">Standard Scene Audio</div>
                    <p className="text-[9px]">
                      Using procedural timeline narration clip ({selectedScene.duration}s).
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden file input for custom audio replacement */}
              <input
                type="file"
                ref={audioFileInputRef}
                accept="audio/*,.mp3,.m4a,.wav,.ogg"
                onChange={(e) => handleCustomAudioFile(selectedScene.id, e)}
                className="hidden"
              />

              {/* Action Buttons: Replace Scene Audio & Restore Master Audio (Requirement 7) */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => audioFileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#20202a] hover:bg-[#2c2c3a] text-cyan-300 border border-cyan-800/40 text-[11px] font-medium transition-colors"
                  title="Upload or pick custom voiceover for this scene"
                >
                  <Upload className="w-3 h-3" />
                  <span>Replace Audio</span>
                </button>

                {project.masterAudio && (
                  <button
                    onClick={() => restoreMasterAudioForScene(selectedScene.id)}
                    disabled={selectedScene.audioMode !== 'custom'}
                    className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-[11px] font-medium border transition-colors ${
                      selectedScene.audioMode === 'custom'
                        ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-700/50 cursor-pointer'
                        : 'bg-[#1a1a22] text-slate-600 border-[#282832] cursor-not-allowed'
                    }`}
                    title="Restore Master Audio segment (Original master remains untouched)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restore Master</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => {
                  setGenerateModalSceneId(selectedScene.id);
                  setActiveModal('generate-visual');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Keyframe Art</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => openAssetLibrary('backgrounds')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#1e1e28] hover:bg-[#282836] text-cyan-300 border border-cyan-800/40 text-[11px] font-medium transition-colors"
                  title="Swap background artwork from 10,000+ library"
                >
                  <span>🖼 10k+ Backgrounds</span>
                </button>
                <button
                  onClick={() => openAssetLibrary('poses')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#1e1e28] hover:bg-[#282836] text-[#a29bfe] border border-[#6c5ce7]/40 text-[11px] font-medium transition-colors"
                  title="Apply character action pose from 1,000+ poses"
                >
                  <span>🏃 Action Poses</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CHARACTER INSPECTOR ================= */}
        {selectedItem.type === 'character' && selectedCharacter && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 bg-[#141418] p-2.5 rounded border border-[#262632]">
              <img
                src={selectedCharacter.referenceImage}
                alt={selectedCharacter.name}
                className="w-12 h-12 rounded object-cover border border-[#343444]"
              />
              <div className="min-w-0">
                <div className="font-bold text-white text-sm truncate">{selectedCharacter.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{selectedCharacter.consistencyScore}% Visual Consistency Lock</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Name</label>
              <input
                type="text"
                value={selectedCharacter.name}
                onChange={(e) => updateCharacter(selectedCharacter.id, { name: e.target.value })}
                className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Role</label>
                <input
                  type="text"
                  value={selectedCharacter.role || ''}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { role: e.target.value })}
                  placeholder="Protagonist"
                  className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Age</label>
                <input
                  type="text"
                  value={selectedCharacter.age || ''}
                  onChange={(e) => updateCharacter(selectedCharacter.id, { age: e.target.value })}
                  placeholder="24"
                  className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Body, Face & Hair</label>
              <textarea
                rows={2}
                value={selectedCharacter.bodyFaceHair}
                onChange={(e) => updateCharacter(selectedCharacter.id, { bodyFaceHair: e.target.value })}
                placeholder="Facial structure, eye color, hairstyle..."
                className="w-full bg-[#141418] border border-[#2a2a34] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Clothing & Attire</label>
              <textarea
                rows={2}
                value={selectedCharacter.clothing}
                onChange={(e) => updateCharacter(selectedCharacter.id, { clothing: e.target.value })}
                placeholder="Signature outfit, accessories..."
                className="w-full bg-[#141418] border border-[#2a2a34] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7] resize-none"
              />
            </div>

            {/* Color Palette */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
                <span>Color Palette</span>
                <span className="text-[9px] text-slate-400 font-mono">Theme Swatches</span>
              </label>
              <div className="flex items-center gap-2 bg-[#141418] p-2 rounded border border-[#2a2a34]">
                {selectedCharacter.palette.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        const newPalette = [...selectedCharacter.palette];
                        newPalette[idx] = e.target.value;
                        updateCharacter(selectedCharacter.id, { palette: newPalette }, 'Update Color Palette');
                      }}
                      className="w-7 h-7 rounded border border-black cursor-pointer bg-transparent"
                    />
                    <span className="text-[8px] font-mono text-slate-400">{color.slice(0, 6)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Audit Box */}
            <div className="bg-[#121217] border border-emerald-900/30 rounded p-2.5 space-y-1">
              <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>AI Consistency Engine Audit</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Character embeddings and IP-Adapter weights are saved in localStorage and injected into all future image & lip-sync diffusion passes.
              </p>
            </div>

            {/* 10,000+ Character Vault button */}
            <button
              onClick={() => openAssetLibrary('characters')}
              className="w-full py-1.5 px-2 rounded bg-[#1e1e28] hover:bg-[#282836] text-[#a29bfe] border border-[#6c5ce7]/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#a29bfe]" />
              <span>Browse 2,500+ Character Models</span>
            </button>
          </div>
        )}

        {/* ================= TIMELINE CLIP INSPECTOR ================= */}
        {selectedItem.type === 'clip' && selectedClip && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Clip Title</label>
              <input
                type="text"
                value={selectedClip.title}
                onChange={(e) => updateClip(selectedClip.id, { title: e.target.value })}
                className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Track</label>
                <div className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-slate-300 uppercase font-mono">
                  {selectedClip.trackId}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Duration</label>
                <div className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono font-semibold">
                  {selectedClip.duration}s
                </div>
              </div>
            </div>

            {/* Narration Source Ranges & Mixed-Mode Controls (Requirements 4, 7, 8) */}
            {selectedClip.trackId === 'narration' && (
              <div className="space-y-2 bg-[#141418] p-2.5 rounded border border-[#25252e]">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 pb-1 border-b border-[#22222a]">
                  <span className="flex items-center gap-1">
                    <Mic className="w-3 h-3 text-cyan-400" />
                    <span>Narration Audio Mapping</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                      selectedClip.audioMode === 'custom'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                    }`}
                  >
                    {selectedClip.audioMode === 'custom' ? 'Custom VO' : 'Master VO'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-[#1c1c24] p-1.5 rounded border border-[#2b2b36]">
                    <span className="text-slate-400 block text-[9px]">Source In</span>
                    <span className="text-cyan-400 font-semibold">{selectedClip.sourceIn}s</span>
                  </div>
                  <div className="bg-[#1c1c24] p-1.5 rounded border border-[#2b2b36]">
                    <span className="text-slate-400 block text-[9px]">Source Out</span>
                    <span className="text-cyan-400 font-semibold">{selectedClip.sourceOut}s</span>
                  </div>
                </div>

                {selectedClip.sceneId && (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => audioFileInputRef.current?.click()}
                      className="flex items-center justify-center gap-1 py-1 px-2 rounded bg-[#20202a] hover:bg-[#2c2c3a] text-cyan-300 border border-cyan-800/40 text-[10px] font-medium transition-colors"
                      title="Replace this scene's audio with custom file"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Replace</span>
                    </button>

                    {project.masterAudio && (
                      <button
                        onClick={() => selectedClip.sceneId && restoreMasterAudioForScene(selectedClip.sceneId)}
                        disabled={selectedClip.audioMode !== 'custom'}
                        className={`flex items-center justify-center gap-1 py-1 px-2 rounded text-[10px] font-medium border transition-colors ${
                          selectedClip.audioMode === 'custom'
                            ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border-amber-700/50 cursor-pointer'
                            : 'bg-[#1a1a22] text-slate-600 border-[#282832] cursor-not-allowed'
                        }`}
                        title="Restore master audio segment for this scene"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore Master</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Audio Settings (Volume, Fades) */}
            <div className="space-y-2 bg-[#141418] p-2.5 rounded border border-[#25252e]">
              <div className="text-[10px] font-bold text-slate-300 uppercase flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-[#06b6d4]" />
                <span>Audio Levels & Fades</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Volume</span>
                  <span className="font-mono text-cyan-400">{selectedClip.volume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={selectedClip.volume}
                  onChange={(e) => updateClip(selectedClip.id, { volume: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Fade In (s)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={5}
                    value={selectedClip.fadeIn}
                    onChange={(e) => updateClip(selectedClip.id, { fadeIn: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1c1c24] border border-[#2d2d38] rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400">Fade Out (s)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={0}
                    max={5}
                    value={selectedClip.fadeOut}
                    onChange={(e) => updateClip(selectedClip.id, { fadeOut: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1c1c24] border border-[#2d2d38] rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Clip Operations */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => splitClipAtPlayhead(selectedClip.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#252530] hover:bg-[#323242] text-slate-200 text-xs border border-[#353545] transition-colors"
              >
                <Split className="w-3.5 h-3.5 text-cyan-400" />
                <span>Split at Playhead (S)</span>
              </button>

              <button
                onClick={deleteSelectedClip}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs border border-rose-800/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Clip (Del)</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PROJECT SETTINGS INSPECTOR ================= */}
        {selectedItem.type === 'project' && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Project Name</label>
              <input
                type="text"
                value={project.name}
                readOnly
                className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Resolution</label>
              <div className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono">
                {project.settings.resolution} (1920×1080)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Frame Rate</label>
              <div className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono">
                {project.settings.fps} FPS (Cinematic standard)
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Default Art Style</label>
              <div className="w-full bg-[#141418] border border-[#2a2a34] rounded px-2.5 py-1.5 text-xs text-slate-200 uppercase font-mono">
                {project.settings.defaultStyle}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
