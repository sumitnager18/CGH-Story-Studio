import React from 'react';
import {
  Film,
  FolderOpen,
  Undo2,
  Redo2,
  Sparkles,
  Download,
  History,
  Keyboard,
  Settings,
  Layers,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { HardDrive, Wrench } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    project,
    canUndo,
    canRedo,
    undo,
    redo,
    setActiveModal,
    setActiveLeftTab,
    selectProject,
    openAssetLibrary
  } = useStudio();

  const runningJobsCount = project.aiJobs.filter(j => j.status === 'running').length;

  return (
    <header className="h-12 bg-[#16161a] border-b border-[#2a2a31] px-3 flex items-center justify-between z-30 select-none">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 pr-3 border-r border-[#2a2a31]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#8e7df5] flex items-center justify-center text-white shadow-sm shadow-[#6c5ce7]/30">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-wider text-white flex items-center gap-1.5">
              CGH STORY STUDIO
              <span className="text-[9px] bg-[#6c5ce7]/20 text-[#a29bfe] px-1.5 py-0.5 rounded font-mono font-normal">
                v1.2 PROTOTYPE
              </span>
            </span>
          </div>
        </div>

        {/* Current Project Dropdown Trigger */}
        <button
          onClick={() => setActiveModal('projects')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1e1e24] hover:bg-[#282832] border border-[#2e2e38] text-xs text-slate-200 transition-colors"
          title="Switch or manage projects"
        >
          <FolderOpen className="w-3.5 h-3.5 text-[#6c5ce7]" />
          <span className="font-medium truncate max-w-[200px]">{project.name}</span>
          <span className="text-[10px] text-slate-400 bg-[#141418] px-1.5 py-0.2 rounded font-mono">
            {project.settings.resolution} • {project.settings.fps}fps
          </span>
        </button>

        {/* Project Inspector Trigger */}
        <button
          onClick={selectProject}
          className="p-1.5 rounded hover:bg-[#25252e] text-slate-400 hover:text-slate-200 transition-colors"
          title="Project Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Tools: Undo / Redo & History */}
      <div className="flex items-center gap-1 bg-[#1a1a20] p-0.5 rounded-lg border border-[#2a2a31]">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-1.5 rounded flex items-center gap-1 text-xs transition-colors ${
            canUndo
              ? 'text-slate-200 hover:bg-[#282832] active:bg-[#323240]'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-1.5 rounded flex items-center gap-1 text-xs transition-colors ${
            canRedo
              ? 'text-slate-200 hover:bg-[#282832] active:bg-[#323240]'
              : 'text-slate-600 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-[#2a2a31] my-auto mx-0.5" />

        <button
          onClick={() => setActiveModal('history')}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#282832] transition-colors"
          title="Command History"
        >
          <History className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setActiveModal('shortcuts')}
          className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#282832] transition-colors"
          title="Keyboard Shortcuts"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Actions: 10,000+ Assets Vault + AI Queue + Export */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* 10,000+ Asset Vault Trigger */}
        <button
          onClick={() => openAssetLibrary()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-[#6c5ce7]/30 via-[#8e7df5]/25 to-[#06b6d4]/25 hover:from-[#6c5ce7]/50 hover:to-[#06b6d4]/40 border border-[#6c5ce7]/60 text-white shadow-sm shadow-[#6c5ce7]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Browse 11,000+ Production Assets (Characters, Backgrounds, Poses, Expressions, Props, SFX)"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#a29bfe] animate-pulse" />
          <span className="hidden md:inline">10,000+ Assets</span>
          <span className="md:hidden">Assets</span>
          <span className="text-[9px] bg-[#6c5ce7] text-white px-1.5 py-0.2 rounded font-mono font-bold">
            VAULT
          </span>
        </button>

        <button
          onClick={() => setActiveModal('local-asset-vault')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#1e1e24] hover:bg-[#282832] border border-[#2e2e38] text-slate-200 transition-colors"
          title="Open the local offline asset vault"
        >
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Offline Vault</span>
        </button>

        <button
          onClick={() => setActiveModal('components')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-[#1e1e24] hover:bg-[#282832] border border-[#2e2e38] text-slate-200 transition-colors"
          title="Manage optional native engines"
        >
          <Wrench className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden lg:inline">Components</span>
        </button>

        {/* Saved indicator */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-emerald-400/80 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved</span>
        </div>

        {/* AI Jobs Queue Button */}
        <button
          onClick={() => setActiveLeftTab('ai-jobs')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            runningJobsCount > 0
              ? 'bg-[#6c5ce7]/15 border-[#6c5ce7] text-[#a29bfe]'
              : 'bg-[#1e1e24] border-[#2e2e38] text-slate-300 hover:bg-[#282832]'
          }`}
          title="Open AI Generation Queue"
        >
          {runningJobsCount > 0 ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8e7df5]" />
              <span>AI Jobs ({runningJobsCount})</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-[#6c5ce7]" />
              <span>AI Queue</span>
            </>
          )}
        </button>

        {/* Export Modal Trigger */}
        <button
          onClick={() => setActiveModal('export')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-sm shadow-[#6c5ce7]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};
