import React from 'react';
import {
  Plus,
  Sparkles,
  Video,
  Mic2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Film,
  Camera
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { CameraPreset } from '../../types';

export const ScenesTab: React.FC = () => {
  const {
    project,
    selectedScene,
    selectScene,
    addScene,
    deleteScene,
    reorderScenes,
    animateScene,
    lipSyncScene,
    setActiveModal,
    setGenerateModalSceneId
  } = useStudio();

  const handleOpenGenerate = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGenerateModalSceneId(sceneId);
    setActiveModal('generate-visual');
  };

  const handleAnimate = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const presets: CameraPreset[] = ['pan-left', 'pan-right', 'zoom-in', 'zoom-out', 'orbit', 'shake', 'dolly-zoom'];
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    animateScene(sceneId, randomPreset);
  };

  const handleLipSync = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    lipSyncScene(sceneId);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 gap-2">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2a2a31]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Film className="w-3.5 h-3.5 text-[#6c5ce7]" />
          <span>Scenes ({project.scenes.length})</span>
        </div>
        <button
          onClick={() => addScene()}
          className="flex items-center gap-1 text-[11px] bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 px-2 py-1 rounded border border-[#2e2e38] transition-colors"
        >
          <Plus className="w-3 h-3 text-[#6c5ce7]" />
          <span>New Scene</span>
        </button>
      </div>

      {/* Scenes List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {project.scenes.map((scene, index) => {
          const isSelected = selectedScene?.id === scene.id;
          const assignedCharacters = scene.characterIds.map(cid =>
            project.characters.find(c => c.id === cid)
          ).filter(Boolean);

          return (
            <div
              key={scene.id}
              onClick={() => selectScene(scene.id)}
              className={`group relative rounded-lg border p-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#22222b] border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/10'
                  : 'bg-[#18181f] border-[#26262f] hover:border-[#3a3a46]'
              }`}
            >
              <div className="flex gap-2.5">
                {/* Thumbnail Preview Frame */}
                <div className="relative w-24 h-14 rounded-md overflow-hidden bg-black/60 shrink-0 border border-[#2e2e38] flex items-center justify-center">
                  {scene.visualAsset?.imageUrl ? (
                    <img
                      src={scene.visualAsset.imageUrl}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-600 gap-1">
                      <Sparkles className="w-4 h-4 text-slate-600" />
                      <span className="text-[9px]">No visual</span>
                    </div>
                  )}

                  {/* Scene number badge */}
                  <div className="absolute top-1 left-1 bg-black/80 text-white font-mono text-[9px] px-1 py-0.2 rounded">
                    {String(scene.sceneNumber).padStart(2, '0')}
                  </div>

                  {/* Camera preset icon */}
                  {scene.animationPreset !== 'none' && (
                    <div className="absolute bottom-1 right-1 bg-[#6c5ce7]/90 text-white text-[8px] font-semibold px-1 rounded flex items-center gap-0.5">
                      <Camera className="w-2 h-2" />
                      <span>{scene.animationPreset}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <div className="font-semibold text-xs text-white truncate">
                      {scene.title}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{scene.duration}s</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                    "{scene.scriptText}"
                  </p>

                  {/* Character Badges & LipSync Status */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {assignedCharacters.map(char => (
                      <span
                        key={char!.id}
                        className="text-[9px] bg-[#2b2b36] text-slate-300 px-1.5 py-0.5 rounded border border-[#383846] flex items-center gap-1"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: char!.palette[0] || '#6c5ce7' }}
                        />
                        {char!.name}
                      </span>
                    ))}

                    {scene.lipSyncStatus === 'ready' && (
                      <span className="text-[9px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Mic2 className="w-2 h-2 text-emerald-400" />
                        <span>Lip-Sync OK</span>
                      </span>
                    )}

                    {scene.lipSyncStatus === 'processing' && (
                      <span className="text-[9px] bg-amber-950/60 text-amber-300 border border-amber-800/40 px-1.5 py-0.5 rounded animate-pulse">
                        Syncing...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-2.5 pt-2 border-t border-[#2a2a33] flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenGenerate(scene.id, e)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#2a2a36] hover:bg-[#6c5ce7] hover:text-white text-slate-200 border border-[#383848] transition-colors"
                    title="Generate AI Keyframe Visual"
                  >
                    <Sparkles className="w-3 h-3 text-[#a29bfe] group-hover:text-white" />
                    <span>Visual</span>
                  </button>

                  <button
                    onClick={(e) => handleAnimate(scene.id, e)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#2a2a36] hover:bg-[#6c5ce7] hover:text-white text-slate-200 border border-[#383848] transition-colors"
                    title="Queue Camera Motion Animation"
                  >
                    <Video className="w-3 h-3 text-cyan-400" />
                    <span>Animate</span>
                  </button>

                  <button
                    onClick={(e) => handleLipSync(scene.id, e)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-[#2a2a36] hover:bg-[#6c5ce7] hover:text-white text-slate-200 border border-[#383848] transition-colors"
                    title="Queue Facial Lip-Sync with Narration"
                  >
                    <Mic2 className="w-3 h-3 text-pink-400" />
                    <span>Lip-Sync</span>
                  </button>
                </div>

                {/* Reorder and delete */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) reorderScenes(index, index - 1);
                    }}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                    title="Move Scene Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < project.scenes.length - 1) reorderScenes(index, index + 1);
                    }}
                    disabled={index === project.scenes.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                    title="Move Scene Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  {project.scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteScene(scene.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 ml-1 transition-colors"
                      title="Delete Scene"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
