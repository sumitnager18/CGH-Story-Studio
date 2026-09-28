import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  RefreshCw,
  Film,
  Check,
  Sparkles
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ResolutionPreset, FrameRatePreset, ArtStyle } from '../../types';

export const ProjectManagerModal: React.FC = () => {
  const {
    project,
    allProjects,
    switchProject,
    createNewProject,
    duplicateCurrentProject,
    deleteCurrentProject,
    resetToSampleProject,
    setActiveModal
  } = useStudio();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRes, setNewRes] = useState<ResolutionPreset>('1080p');
  const [newFps, setNewFps] = useState<FrameRatePreset>(24);
  const [newStyle, setNewStyle] = useState<ArtStyle>('anime');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createNewProject(newTitle.trim(), newRes, newFps, newStyle);
    setIsCreatingNew(false);
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <FolderOpen className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Project Manager</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          {!isCreatingNew ? (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Saved Projects ({allProjects.length})
                </span>
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="flex items-center gap-1 text-xs bg-[#6c5ce7] hover:bg-[#5849d4] text-white px-2.5 py-1 rounded font-semibold transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-2">
                {allProjects.map((p) => {
                  const isActive = p.id === project.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        switchProject(p.id);
                        setActiveModal(null);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#22222e] border-[#6c5ce7] shadow-sm'
                          : 'bg-[#141418] border-[#252530] hover:border-[#353545] hover:bg-[#191922]'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs truncate">{p.name}</span>
                          {isActive && (
                            <span className="text-[9px] bg-[#6c5ce7]/30 text-[#a29bfe] font-mono px-1.5 py-0.2 rounded border border-[#6c5ce7]/50">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2 font-mono">
                          <span>{p.scenes.length} scenes</span>
                          <span>•</span>
                          <span>{p.settings.resolution} @ {p.settings.fps}fps</span>
                          <span>•</span>
                          <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => duplicateCurrentProject()}
                          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#252530] rounded"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {allProjects.length > 1 && (
                          <button
                            onClick={() => deleteCurrentProject(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#252530] rounded"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset to Demo Project button */}
              <div className="pt-2 border-t border-[#262632] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Restore preloaded demo script & assets
                </span>
                <button
                  onClick={() => {
                    resetToSampleProject();
                    setActiveModal(null);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#22222a] hover:bg-[#2c2c36] text-cyan-300 text-xs border border-[#313140] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Story</span>
                </button>
              </div>
            </>
          ) : (
            /* New Project Form */
            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase">Project Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Alchemist's Apprentice"
                  className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase">Resolution</label>
                  <select
                    value={newRes}
                    onChange={(e) => setNewRes(e.target.value as ResolutionPreset)}
                    className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value="1080p">1080p (1920×1080)</option>
                    <option value="4K">4K UHD (3840×2160)</option>
                    <option value="720p">720p (1280×720)</option>
                    <option value="9:16">9:16 Vertical (1080×1920)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase">Frame Rate</label>
                  <select
                    value={newFps}
                    onChange={(e) => setNewFps(parseInt(e.target.value) as FrameRatePreset)}
                    className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value={24}>24 FPS (Cinematic standard)</option>
                    <option value={30}>30 FPS (Digital video)</option>
                    <option value={60}>60 FPS (High smooth)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase">Default Art Style</label>
                <select
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value as ArtStyle)}
                  className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="anime">Anime / Manga Cinema</option>
                  <option value="cyberpunk">Cyberpunk Neon</option>
                  <option value="cartoon">Stylized Animation</option>
                  <option value="realistic">Realistic Film</option>
                  <option value="3D">3D Render</option>
                  <option value="comic">Graphic Novel</option>
                  <option value="oil-painting">Oil Painting</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-md shadow-[#6c5ce7]/30 transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
