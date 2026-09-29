import React, { useState, useRef, useMemo } from 'react';
import {
  Upload,
  Music,
  Mic,
  Volume2,
  FileAudio,
  Scissors,
  Play,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Move,
  User,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { studioAudio } from '../../utils/mockAudio';
import { searchAssetLibrary, ensureAssetImage } from '../../data/assetLibrary';
import { AssetCategory, LibraryAsset } from '../../types/assets';

export const AssetsTab: React.FC = () => {
  const {
    project,
    selectedScene,
    importMasterAudio,
    splitAudioForScenes,
    openAssetLibrary,
    applyAssetToScene,
    addLibraryCharacterToProject,
    addLibraryAudioToTimeline,
    applyPoseToScene
  } = useStudio();

  // Sub-tab: 'vault' (11,150+ CGH Procedural Prototype Assets) vs 'project-audio' (Narration & Media)
  const [subTab, setSubTab] = useState<'vault' | 'project-audio'>('vault');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarCategory, setSidebarCategory] = useState<AssetCategory | 'all'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeDuration = Math.max(20, Math.min(120, Math.round(file.size / 1024 / 45)));
      importMasterAudio(file.name, fakeDuration);
    }
  };

  const handleLoadSampleVO = () => {
    importMasterAudio('master_narration_cinematic_take1.m4a', 34);
  };

  const playVoiceSample = () => {
    studioAudio.playNarrationBeep(220, 0.3, 0.15);
  };

  // Preview search in sidebar (top 20 items)
  const sidebarResults = useMemo(() => {
    return searchAssetLibrary({
      query: sidebarSearch,
      category: sidebarCategory,
      pageSize: 20
    });
  }, [sidebarSearch, sidebarCategory]);

  const handleQuickUse = (asset: LibraryAsset) => {
    const sc = selectedScene || project.scenes[0];
    if (asset.category === 'characters') {
      addLibraryCharacterToProject(asset);
      setActionFeedback(`Added ${asset.title.split('—')[0]} to Characters`);
    } else if (asset.category === 'audio') {
      addLibraryAudioToTimeline(asset, asset.audioData?.audioType || 'music');
      setActionFeedback(`Added ${asset.title} to Timeline`);
    } else if (asset.category === 'poses') {
      if (sc) applyPoseToScene(sc.id, asset);
      setActionFeedback(`Applied pose to Scene 0${sc?.sceneNumber || 1}`);
    } else {
      if (sc) applyAssetToScene(sc.id, asset);
      setActionFeedback(`Applied to Scene 0${sc?.sceneNumber || 1}`);
    }

    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 gap-2.5">
      {/* Hidden File Input for Audio */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".m4a,.mp3,.wav,.aac,.ogg"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Sub-Tab Navigation Switch */}
      <div className="grid grid-cols-2 p-1 bg-[#14141a] rounded-lg border border-[#262632] gap-1 shrink-0">
        <button
          onClick={() => setSubTab('vault')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            subTab === 'vault'
              ? 'bg-[#6c5ce7] text-white shadow-sm shadow-[#6c5ce7]/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Asset Vault (11k+)</span>
        </button>

        <button
          onClick={() => setSubTab('project-audio')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            subTab === 'project-audio'
              ? 'bg-[#282834] text-white border border-[#383848]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a24]'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-[#06b6d4]" />
          <span>Master VO & Media</span>
        </button>
      </div>

      {actionFeedback && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">{actionFeedback}</span>
        </div>
      )}

      {/* VIEW 1: CGH ASSET VAULT (11,150+ ASSETS ACROSS 246 FAMILIES) */}
      {subTab === 'vault' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5 overflow-hidden">
          {/* Big Explore Banner */}
          <div className="bg-gradient-to-br from-[#6c5ce7]/20 via-[#181824] to-[#06b6d4]/15 border border-[#6c5ce7]/40 rounded-xl p-3 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white tracking-wide">11,150+ ASSETS ACTIVE</span>
              </div>
              <span className="text-[10px] font-mono text-[#a29bfe] bg-[#6c5ce7]/20 px-1.5 py-0.5 rounded border border-[#6c5ce7]/40">
                CGH Story Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Explore 246 families: 2,500 characters, 3,200 environments, 1,800 poses, visemes, props & audio.
            </p>
            <button
              onClick={() => useStudio().setActiveModal('local-asset-vault')}
              className="w-full py-1.5 bg-[#1d2924] hover:bg-[#263b32] text-emerald-300 font-semibold rounded-lg text-xs border border-emerald-700/40 flex items-center justify-center gap-1.5"
            >
              <HardDrive className="w-3.5 h-3.5" />
              Open Offline Local Vault
            </button>
            <button
              onClick={() => openAssetLibrary()}
              className="w-full py-1.5 bg-[#6c5ce7] hover:bg-[#5849d4] text-white font-semibold rounded-lg text-xs shadow-md shadow-[#6c5ce7]/30 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Full Asset Vault (246 Families)</span>
            </button>
          </div>

          {/* Quick Search and Category Chips */}
          <div className="space-y-1.5 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Search 11,150+ assets across 246 families..."
                className="w-full bg-[#16161e] border border-[#282836] rounded-lg pl-7.5 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            {/* Mini Category Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
              {(['all', 'characters', 'backgrounds', 'poses', 'audio'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setSidebarCategory(c)}
                  className={`px-2 py-0.5 rounded-full capitalize whitespace-nowrap border transition-colors ${
                    sidebarCategory === c
                      ? 'bg-[#6c5ce7]/25 border-[#6c5ce7] text-[#a29bfe] font-semibold'
                      : 'bg-[#181822] border-[#262632] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c === 'all' ? 'All (10k+)' : c}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Assets List */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5">
            {sidebarResults.items.map(asset => (
              <div
                key={asset.id}
                className="bg-[#171720] border border-[#242432] hover:border-[#3a3a4c] rounded-lg p-2 flex items-center justify-between gap-2 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={ensureAssetImage(asset)}
                    alt={asset.title}
                    className="w-10 h-7 rounded object-cover shrink-0 bg-black"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-200 truncate group-hover:text-[#a29bfe] transition-colors">
                      {asset.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="uppercase font-mono text-[9px] text-[#a29bfe]">
                        {asset.category.slice(0, 4)}
                      </span>
                      <span>•</span>
                      <span className="truncate">{asset.subcategory}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleQuickUse(asset)}
                    className="text-[10px] bg-[#22222e] hover:bg-[#6c5ce7] text-slate-300 hover:text-white px-2 py-1 rounded transition-colors font-medium"
                    title="Quick Use"
                  >
                    + Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MASTER NARRATION & PROJECT MEDIA */}
      {subTab === 'project-audio' && (
        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
          {/* Master Audio Box */}
          <div className="bg-[#18181f] border border-[#2a2a34] rounded-lg p-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                <Mic className="w-3.5 h-3.5 text-[#06b6d4]" />
                <span>Master Narration (M4A)</span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] bg-[#22222c] hover:bg-[#2e2e3a] text-slate-200 px-2 py-1 rounded border border-[#343444] transition-colors"
              >
                <Upload className="w-3 h-3 text-[#06b6d4]" />
                <span>Import Audio</span>
              </button>
            </div>

            {project.masterAudio ? (
              <div className="bg-[#121216] p-2.5 rounded-md border border-[#23232c] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileAudio className="w-4 h-4 text-[#06b6d4] shrink-0" />
                    <span className="text-xs font-mono text-slate-200 truncate">
                      {project.masterAudio.fileName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                    {project.masterAudio.duration}s Master
                  </span>
                </div>

                {/* Waveform Canvas Visualization */}
                <div className="h-10 bg-[#09090d] rounded border border-[#1e1e26] p-1 flex items-center justify-between gap-[2px] overflow-hidden">
                  {project.masterAudio.waveformPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-[#06b6d4]/80 hover:bg-cyan-300 rounded-xs transition-colors"
                      style={{ height: `${Math.max(10, pt * 100)}%` }}
                    />
                  ))}
                </div>

                {/* Audio actions */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => playVoiceSample()}
                    className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-[#1e1e26] hover:bg-[#282834]"
                  >
                    <Play className="w-3 h-3 fill-current text-cyan-400" />
                    <span>Audition</span>
                  </button>

                  <button
                    onClick={splitAudioForScenes}
                    className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-700/50 px-2 py-1 rounded transition-colors"
                    title="Splits master audio non-destructively across all scenes in timeline"
                  >
                    <Scissors className="w-3 h-3" />
                    <span>Slice to Scenes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 bg-[#131317] rounded-md border border-dashed border-[#262630] space-y-2">
                <FileAudio className="w-6 h-6 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-300 font-medium">No Master Audio File</p>
                <p className="text-[11px] text-slate-400 px-3">
                  Import one continuous master voiceover track to slice non-destructively per scene.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs bg-[#06b6d4] hover:bg-cyan-500 text-black font-semibold px-3 py-1.5 rounded transition-colors"
                  >
                    Browse M4A / MP3
                  </button>
                  <button
                    onClick={handleLoadSampleVO}
                    className="text-xs bg-[#24242e] hover:bg-[#2e2e3c] text-slate-300 px-3 py-1.5 rounded border border-[#343444] transition-colors"
                  >
                    Load Demo Voiceover
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Project Media Clips */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#6c5ce7]" />
                <span>Project Audio Tracks ({project.assets.length})</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {project.assets.map(asset => (
                <div
                  key={asset.id}
                  className="bg-[#18181f] border border-[#262630] hover:border-[#3a3a46] rounded-lg p-2 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                      asset.type === 'music'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                    }`}>
                      {asset.type === 'music' ? <Music className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">{asset.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{asset.duration}s</span>
                        <span>•</span>
                        <span>{asset.size}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => studioAudio.playNarrationBeep(asset.type === 'music' ? 440 : 180, 0.2)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-[#252530] rounded transition-colors"
                    title="Audition"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
