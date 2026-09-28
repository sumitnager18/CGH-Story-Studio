import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Search,
  Sparkles,
  Layers,
  User,
  Image as ImageIcon,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Volume2,
  Film,
  Smile,
  ShieldCheck,
  Flame,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Move
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { AssetCategory, LibraryAsset } from '../../types/assets';
import { ArtStyle, TrackType } from '../../types';
import { searchAssetLibrary, ensureAssetImage } from '../../data/assetLibrary';
import { studioAudio } from '../../utils/mockAudio';

export const AssetLibraryModal: React.FC = () => {
  const {
    project,
    selectedScene,
    activeModal,
    setActiveModal,
    assetLibraryInitialCategory,
    assetLibraryInitialQuery,
    applyAssetToScene,
    addLibraryCharacterToProject,
    addLibraryAudioToTimeline,
    applyPoseToScene,
    applyStylePreset
  } = useStudio();

  // Filters and state
  const [searchQuery, setSearchQuery] = useState(assetLibraryInitialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>(assetLibraryInitialCategory || 'all');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'consistency' | 'name' | 'newest'>('trending');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 32;

  // Selected asset for Inspector Drawer
  const [inspectedAsset, setInspectedAsset] = useState<LibraryAsset | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Audio preview state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update category if initial changed
  useEffect(() => {
    if (assetLibraryInitialCategory) {
      setSelectedCategory(assetLibraryInitialCategory);
    }
    if (assetLibraryInitialQuery) {
      setSearchQuery(assetLibraryInitialQuery);
    }
  }, [assetLibraryInitialCategory, assetLibraryInitialQuery]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStyle, selectedTag, sortBy]);

  // Execute fast search across all 11,000+ assets
  const searchResults = useMemo(() => {
    return searchAssetLibrary({
      query: selectedTag !== 'all' ? `${searchQuery} ${selectedTag}`.trim() : searchQuery,
      category: selectedCategory,
      style: selectedStyle,
      sortBy,
      page: currentPage,
      pageSize
    });
  }, [searchQuery, selectedCategory, selectedStyle, selectedTag, sortBy, currentPage]);

  const { items, totalCount, totalPages, categoryCounts } = searchResults;

  // Handle hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (inspectedAsset) {
          setInspectedAsset(null);
        } else {
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedAsset, setActiveModal]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApplyToActiveScene = (asset: LibraryAsset) => {
    const sceneId = selectedScene?.id || project.scenes[0]?.id;
    if (!sceneId) return;

    applyAssetToScene(sceneId, asset);
    setAppliedNotice(`Applied "${asset.title}" to Scene 0${selectedScene?.sceneNumber || 1}!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleAddCharacter = (asset: LibraryAsset) => {
    addLibraryCharacterToProject(asset);
    setAppliedNotice(`Added character "${asset.title.split('—')[0].trim()}" to project!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleAddAudio = (asset: LibraryAsset, trackType: TrackType = 'music') => {
    addLibraryAudioToTimeline(asset, trackType);
    setAppliedNotice(`Added audio "${asset.title}" to ${trackType.toUpperCase()} track!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleApplyPose = (asset: LibraryAsset) => {
    const sceneId = selectedScene?.id || project.scenes[0]?.id;
    if (!sceneId) return;

    applyPoseToScene(sceneId, asset);
    setAppliedNotice(`Applied Action Pose "${asset.title}" to Scene 0${selectedScene?.sceneNumber || 1}!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const handleApplyStyle = (asset: LibraryAsset) => {
    const sceneId = selectedScene?.id;
    applyStylePreset(asset.style, asset.title, sceneId);
    setAppliedNotice(`Applied Style Preset "${asset.title}"!`);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  const toggleAudioAudition = (asset: LibraryAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === asset.id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(asset.id);
      studioAudio.playNarrationBeep(asset.audioData?.toneHz || 320, 0.4);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 2000);
    }
  };

  const downloadAssetSvg = (asset: LibraryAsset) => {
    const svgUrl = ensureAssetImage(asset);
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `${asset.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.svg`;
    link.click();
  };

  const popularTags = [
    { label: 'All Tags', value: 'all' },
    { label: '🔥 Trending', value: 'hero' },
    { label: '🧑‍🏫 Teachers & Academics', value: 'teacher' },
    { label: '🩺 Doctors & Medical', value: 'doctor' },
    { label: '🏫 Classrooms & Labs', value: 'classroom' },
    { label: '🇮🇳 Indian Heritage', value: 'indian' },
    { label: '🐅 Animals & Creatures', value: 'animal' },
    { label: '⚔️ Combat & Swords', value: 'sword' },
    { label: '🏃 Action Poses', value: 'running' },
    { label: '🌆 Cyberpunk & Sci-Fi', value: 'cyberpunk' },
    { label: '☕ Cozy Interiors', value: 'cozy' },
    { label: '🗣️ Lip-Sync Visemes', value: 'lip-sync' }
  ];

  const categories: { id: AssetCategory | 'all'; label: string; icon: any; count: number }[] = [
    { id: 'all', label: 'All Vault', icon: Sparkles, count: categoryCounts.all },
    { id: 'characters', label: 'Characters', icon: User, count: categoryCounts.characters },
    { id: 'backgrounds', label: 'Backgrounds', icon: ImageIcon, count: categoryCounts.backgrounds },
    { id: 'poses', label: 'Poses & Actions', icon: Move, count: categoryCounts.poses },
    { id: 'expressions', label: 'Expressions & Visemes', icon: Smile, count: categoryCounts.expressions },
    { id: 'props', label: 'Props & VFX', icon: Layers, count: categoryCounts.props },
    { id: 'audio', label: 'SFX & Music', icon: Volume2, count: categoryCounts.audio },
    { id: 'styles', label: 'Style Models', icon: Film, count: categoryCounts.styles }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-7xl h-[94vh] bg-[#141418] border border-[#2b2b36] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="px-5 py-3 border-b border-[#252530] bg-[#101014] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6c5ce7] via-[#8e7df5] to-[#06b6d4] flex items-center justify-center text-white shadow-md shadow-[#6c5ce7]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">
                  CGH ASSET VAULT
                </h2>
                <span className="text-[10px] bg-[#6c5ce7]/25 text-[#a29bfe] font-mono px-2 py-0.5 rounded-full border border-[#6c5ce7]/40 font-semibold">
                  11,150+ indexed procedural prototype assets • 246 Families
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Procedurally generated across 246 families: characters, backgrounds, action rigs, facial visemes, props & audio.
              </p>
            </div>
          </div>

          {/* Quick Notification Toast */}
          {appliedNotice && (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{appliedNotice}</span>
            </div>
          )}

          {/* Search bar & Close */}
          <div className="flex items-center gap-2">
            <div className="relative w-64 sm:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 10,000+ assets, tags, prompts (Press /)..."
                className="w-full bg-[#1b1b22] border border-[#2e2e3a] rounded-lg pl-8.5 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252530] transition-colors"
              title="Close Vault (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 py-2 bg-[#121216] border-b border-[#23232c] flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#6c5ce7] text-white shadow-sm shadow-[#6c5ce7]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a1a22]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#1f1f2a] text-slate-400'
                }`}>
                  {cat.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters and Subcategories Bar */}
        <div className="px-5 py-2 bg-[#101014] border-b border-[#202028] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-2xl scrollbar-none">
            {popularTags.map(tag => (
              <button
                key={tag.value}
                onClick={() => setSelectedTag(tag.value)}
                className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors border ${
                  selectedTag === tag.value
                    ? 'bg-[#6c5ce7]/20 border-[#6c5ce7] text-[#a29bfe] font-medium'
                    : 'bg-[#171720] border-[#262632] text-slate-400 hover:text-slate-200 hover:border-[#353545]'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Style Dropdown & Sort */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#171720] px-2 py-1 rounded-lg border border-[#272733]">
              <span className="text-[11px] text-slate-400">Style:</span>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as ArtStyle | 'all')}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#171720]">All Styles</option>
                <option value="anime" className="bg-[#171720]">Anime</option>
                <option value="cyberpunk" className="bg-[#171720]">Cyberpunk</option>
                <option value="3D" className="bg-[#171720]">3D Hypertoon</option>
                <option value="cartoon" className="bg-[#171720]">Cartoon</option>
                <option value="realistic" className="bg-[#171720]">Realistic Film</option>
                <option value="comic" className="bg-[#171720]">Comic Halftone</option>
                <option value="oil-painting" className="bg-[#171720]">Oil Painting</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#171720] px-2 py-1 rounded-lg border border-[#272733]">
              <span className="text-[11px] text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="trending" className="bg-[#171720]">Trending / Most Used</option>
                <option value="consistency" className="bg-[#171720]">Highest Consistency (98%+)</option>
                <option value="name" className="bg-[#171720]">Name A-Z</option>
                <option value="newest" className="bg-[#171720]">Newest Seeds</option>
              </select>
            </div>

            <div className="text-[11px] font-mono text-slate-400 pl-1 border-l border-[#272733]">
              <span className="text-white font-semibold">{totalCount.toLocaleString()}</span> assets
            </div>
          </div>
        </div>

        {/* Main Content Area: Asset Cards Grid + Optional Inspector Drawer */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Cards Grid Container */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#2b2b36] rounded-xl my-8">
                <Search className="w-10 h-10 text-slate-600 mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">No assets match your search</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Try clearing tag filters, checking another category, or searching for broader terms like "anime", "cyberpunk", "katana", "skyline", or "hero".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedStyle('all');
                    setSelectedTag('all');
                  }}
                  className="mt-4 text-xs bg-[#6c5ce7] hover:bg-[#5849d4] text-white px-3 py-1.5 rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {items.map((asset) => {
                  const isSelected = inspectedAsset?.id === asset.id;
                  const isAudio = asset.category === 'audio';

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setInspectedAsset(asset)}
                      className={`group bg-[#17171e] border rounded-xl overflow-hidden flex flex-col transition-all cursor-pointer hover:shadow-xl hover:shadow-black/50 ${
                        isSelected
                          ? 'border-[#6c5ce7] ring-1 ring-[#6c5ce7]'
                          : 'border-[#262632] hover:border-[#3d3d4e]'
                      }`}
                    >
                      {/* Asset Visual Thumbnail */}
                      <div className="relative aspect-video w-full bg-[#0a0a0f] overflow-hidden">
                        <img
                          src={ensureAssetImage(asset)}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Category & Style Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="text-[10px] bg-black/75 backdrop-blur-xs text-slate-200 px-2 py-0.5 rounded font-mono font-medium border border-white/10">
                            {asset.category.toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-[#6c5ce7]/80 text-white px-1.5 py-0.5 rounded font-mono">
                            {asset.style}
                          </span>
                        </div>

                        {/* Consistency or Duration Badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          {asset.characterData?.consistencyScore ? (
                            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>{asset.characterData.consistencyScore}% Lock</span>
                            </span>
                          ) : asset.audioData ? (
                            <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 px-1.5 py-0.5 rounded font-mono">
                              {asset.audioData.duration}s
                            </span>
                          ) : (
                            <span className="text-[10px] bg-black/60 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                              #{asset.seed}
                            </span>
                          )}
                        </div>

                        {/* Audio Play Overlay if Audio Asset */}
                        {isAudio && (
                          <button
                            onClick={(e) => toggleAudioAudition(asset, e)}
                            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/70 hover:bg-[#6c5ce7] text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                            title="Audition Sound"
                          >
                            {playingAudioId === asset.id ? (
                              <Pause className="w-4 h-4 fill-current text-white" />
                            ) : (
                              <Play className="w-4 h-4 fill-current text-white translate-x-0.5" />
                            )}
                          </button>
                        )}

                        {/* Hover Quick Action Toolbar */}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (asset.category === 'characters') {
                                handleAddCharacter(asset);
                              } else if (asset.category === 'audio') {
                                handleAddAudio(asset, asset.audioData?.audioType || 'music');
                              } else if (asset.category === 'poses') {
                                handleApplyPose(asset);
                              } else if (asset.category === 'styles') {
                                handleApplyStyle(asset);
                              } else {
                                handleApplyToActiveScene(asset);
                              }
                            }}
                            className="text-[11px] bg-[#6c5ce7] hover:bg-[#5849d4] text-white font-semibold px-2.5 py-1 rounded shadow-md transition-all flex items-center gap-1"
                          >
                            <span>
                              {asset.category === 'characters'
                                ? '+ Add Character'
                                : asset.category === 'audio'
                                ? '+ To Timeline'
                                : asset.category === 'poses'
                                ? 'Apply Pose'
                                : asset.category === 'styles'
                                ? 'Use Style'
                                : 'Use in Scene'}
                            </span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectedAsset(asset);
                            }}
                            className="text-[10px] bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white px-2 py-1 rounded border border-white/20"
                          >
                            Details
                          </button>
                        </div>
                      </div>

                      {/* Card Info Area */}
                      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 line-clamp-1 group-hover:text-[#a29bfe] transition-colors">
                            {asset.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {asset.subcategory}
                          </p>
                        </div>

                        {/* Bottom Metadata: Prototype Relevance & Usage Score */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#23232e] text-[10px] text-slate-400">
                          <span className="font-mono text-cyan-400/90">
                            Relevance: {asset.prototypeRelevance || 95}%
                          </span>
                          <span className="font-mono text-slate-400">
                            Score: {asset.prototypeUsageScore || 80}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 pb-2 flex items-center justify-between border-t border-[#23232c] text-xs text-slate-400">
                <div className="flex items-center gap-1 font-mono">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span className="text-slate-600">({totalCount.toLocaleString()} total items)</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs ${
                      currentPage <= 1
                        ? 'border-[#22222a] text-slate-600 cursor-not-allowed'
                        : 'border-[#2f2f3c] text-slate-200 hover:bg-[#20202a]'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  {/* Page Jump pills */}
                  <div className="hidden sm:flex items-center gap-1 mx-2">
                    {[1, 2, 3, 4, 5].filter(p => p <= totalPages).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-mono transition-colors ${
                          currentPage === p
                            ? 'bg-[#6c5ce7] text-white font-bold'
                            : 'text-slate-400 hover:bg-[#20202a] hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    {totalPages > 5 && (
                      <span className="text-slate-600 px-1">...</span>
                    )}
                  </div>

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs ${
                      currentPage >= totalPages
                        ? 'border-[#22222a] text-slate-600 cursor-not-allowed'
                        : 'border-[#2f2f3c] text-slate-200 hover:bg-[#20202a]'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Asset Inspector Detail Drawer (Slide-in) */}
          {inspectedAsset && (
            <div className="w-96 border-l border-[#262633] bg-[#121217] flex flex-col shrink-0 animate-in slide-in-from-right duration-200 overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-4 border-b border-[#23232e] flex items-center justify-between bg-[#101014]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Asset Inspector
                  </span>
                  <span className="text-[10px] font-mono text-[#a29bfe] bg-[#6c5ce7]/20 px-1.5 py-0.5 rounded">
                    {inspectedAsset.category}
                  </span>
                </div>
                <button
                  onClick={() => setInspectedAsset(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#22222c]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Large Preview */}
              <div className="relative aspect-video w-full bg-black border-b border-[#202028]">
                <img
                  src={ensureAssetImage(inspectedAsset)}
                  alt={inspectedAsset.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => downloadAssetSvg(inspectedAsset)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-slate-200 hover:text-white rounded-md border border-white/20 transition-colors"
                  title="Download SVG Vector"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Detail Content */}
              <div className="p-4 space-y-4 text-xs">
                {/* Title and Subtitle */}
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {inspectedAsset.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    {inspectedAsset.family && (
                      <span className="text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        Family: {inspectedAsset.family}
                      </span>
                    )}
                    <span>{inspectedAsset.subcategory}</span>
                    <span>•</span>
                    <span className="text-[#a29bfe] font-mono">{inspectedAsset.style}</span>
                  </div>
                </div>

                {/* 4 Dedicated Action Buttons: Use, Variants, Related, Close (Requirement 21 & 22) */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (inspectedAsset.category === 'characters') {
                        handleAddCharacter(inspectedAsset);
                      } else if (inspectedAsset.category === 'audio') {
                        handleAddAudio(inspectedAsset, inspectedAsset.audioData?.audioType || 'music');
                      } else if (inspectedAsset.category === 'poses') {
                        handleApplyPose(inspectedAsset);
                      } else if (inspectedAsset.category === 'styles') {
                        handleApplyStyle(inspectedAsset);
                      } else {
                        handleApplyToActiveScene(inspectedAsset);
                      }
                    }}
                    className="w-full py-2.5 bg-[#6c5ce7] hover:bg-[#5849d4] text-white font-semibold rounded-lg shadow-md shadow-[#6c5ce7]/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {inspectedAsset.category === 'characters'
                        ? 'Use: Add Character to Project'
                        : inspectedAsset.category === 'audio'
                        ? 'Use: Add Sound to Timeline'
                        : inspectedAsset.category === 'poses'
                        ? `Use: Apply Pose to Scene 0${selectedScene?.sceneNumber || 1}`
                        : inspectedAsset.category === 'styles'
                        ? 'Use: Apply Style Preset'
                        : `Use: Apply to Scene 0${selectedScene?.sceneNumber || 1}`}
                    </span>
                  </button>

                  <div className="grid grid-cols-3 gap-1.5">
                    {/* Variants Button */}
                    <button
                      onClick={() => {
                        setSearchQuery(inspectedAsset.family || inspectedAsset.title.split('—')[0].trim());
                        setCurrentPage(1);
                      }}
                      className="py-1.5 bg-[#1c1c24] hover:bg-[#252530] text-slate-200 rounded-lg border border-[#2d2d3c] flex items-center justify-center gap-1 text-[11px] transition-colors"
                      title="View all variants in this family"
                    >
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <span>Variants</span>
                    </button>

                    {/* Related Button */}
                    <button
                      onClick={() => {
                        setSearchQuery(inspectedAsset.subcategory || inspectedAsset.tags[0] || '');
                        setCurrentPage(1);
                      }}
                      className="py-1.5 bg-[#1c1c24] hover:bg-[#252530] text-slate-200 rounded-lg border border-[#2d2d3c] flex items-center justify-center gap-1 text-[11px] transition-colors"
                      title="Search related category assets"
                    >
                      <Search className="w-3 h-3 text-[#a29bfe]" />
                      <span>Related</span>
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={() => setInspectedAsset(null)}
                      className="py-1.5 bg-[#1c1c24] hover:bg-[#252530] text-slate-300 hover:text-white rounded-lg border border-[#2d2d3c] flex items-center justify-center gap-1 text-[11px] transition-colors"
                      title="Close Preview Drawer"
                    >
                      <X className="w-3 h-3 text-slate-400" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>

                {/* Semantic Description (Requirement 21) */}
                {inspectedAsset.semanticProfile && (
                  <div className="bg-[#181820] p-2.5 rounded-lg border border-[#252532] space-y-1 text-[11px]">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase tracking-wider">Semantic Profile</span>
                    <p className="text-slate-200 leading-snug">
                      {inspectedAsset.semanticProfile.useCase || inspectedAsset.semanticProfile.roleOrSubject}
                    </p>
                    {inspectedAsset.semanticProfile.actionOrPose && (
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400">
                        <span>Pose: <strong className="text-slate-300 font-mono">{inspectedAsset.semanticProfile.actionOrPose}</strong></span>
                        {inspectedAsset.semanticProfile.ageOrEra && (
                          <span>• Age: <strong className="text-slate-300 font-mono">{inspectedAsset.semanticProfile.ageOrEra}</strong></span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Prompt Recipe */}
                <div className="space-y-1.5 bg-[#181820] p-3 rounded-lg border border-[#252532]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <span>Prompt Recipe</span>
                    </span>
                    <button
                      onClick={() => handleCopy(inspectedAsset.prompt, 'prompt')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {copiedField === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedField === 'prompt' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-300 leading-relaxed bg-[#101015] p-2 rounded border border-[#22222d]">
                    {inspectedAsset.prompt}
                  </p>
                </div>

                {/* Asset Family & Semantic Archetype */}
                {inspectedAsset.family && (
                  <div className="bg-[#181820] p-2.5 rounded-lg border border-[#252532] flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Procedural Family</span>
                      <span className="text-cyan-300 font-semibold">{inspectedAsset.family}</span>
                    </div>
                    {inspectedAsset.archetype && (
                      <span className="text-[10px] bg-cyan-950/80 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-700/50">
                        Archetype: {inspectedAsset.archetype}
                      </span>
                    )}
                  </div>
                )}

                {/* Authoritative Inspector: Prototype Asset, Provider, Renderer, Status (Requirement 23) */}
                <div className="bg-[#181820] p-3 rounded-lg border border-[#252532] space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Prototype Asset Engine</span>
                      <span className="text-slate-200 font-semibold">{inspectedAsset.provider || 'CGH Procedural Asset Engine'}</span>
                    </div>
                    <span className="text-[10px] bg-[#6c5ce7]/20 text-[#a29bfe] font-mono px-2 py-0.5 rounded border border-[#6c5ce7]/35 font-medium">
                      Prototype
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#23232f]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Authoritative Renderer</span>
                      <span className="font-mono text-cyan-300 text-[11px] font-semibold truncate block">
                        {inspectedAsset.rendererKey || inspectedAsset.archetype || 'cgh-renderer'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Renderer Status</span>
                      <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                        inspectedAsset.qualityStatus === 'pass'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          : inspectedAsset.qualityStatus === 'review'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                      }`}>
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {(inspectedAsset.qualityStatus || 'pass').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#23232f]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Prototype Relevance</span>
                      <span className="font-mono text-white text-[11px]">
                        {inspectedAsset.prototypeRelevance || 95}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Consistency Seed</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          #{inspectedAsset.seed}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(String(inspectedAsset.seed), 'seed')}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy Seed"
                      >
                        {copiedField === 'seed' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Character Specific Data */}
                {inspectedAsset.characterData && (
                  <div className="space-y-2 bg-[#181820] p-3 rounded-lg border border-[#252532]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Character Rigs & Palette</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                        {inspectedAsset.characterData.consistencyScore}% Lock
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div><strong className="text-slate-400">Role:</strong> {inspectedAsset.characterData.role} (Age: {inspectedAsset.characterData.age})</div>
                      <div><strong className="text-slate-400">Outfit:</strong> {inspectedAsset.characterData.clothing}</div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {inspectedAsset.characterData.palette.map((color, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-md border border-white/20"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Specific Data */}
                {inspectedAsset.backgroundData && (
                  <div className="space-y-2 bg-[#181820] p-3 rounded-lg border border-[#252532]">
                    <span className="font-semibold text-slate-200">Environment Details</span>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div><strong className="text-slate-400">Setting:</strong> {inspectedAsset.backgroundData.setting}</div>
                      <div><strong className="text-slate-400">Lighting:</strong> {inspectedAsset.backgroundData.lighting}</div>
                      <div><strong className="text-slate-400">Camera Preset:</strong> {inspectedAsset.backgroundData.cameraPreset}</div>
                    </div>
                  </div>
                )}

                {/* Pose Specific Data */}
                {inspectedAsset.poseData && (
                  <div className="space-y-2 bg-[#181820] p-3 rounded-lg border border-[#252532]">
                    <span className="font-semibold text-slate-200">Pose Action Rig</span>
                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div><strong className="text-slate-400">Motion:</strong> {inspectedAsset.poseData.motionType}</div>
                      <div><strong className="text-slate-400">Framing:</strong> {inspectedAsset.poseData.framing}</div>
                      <div><strong className="text-slate-400">Rig:</strong> {inspectedAsset.poseData.rigName}</div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 block font-semibold">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedAsset.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] bg-[#1a1a24] text-slate-300 px-2 py-0.5 rounded border border-[#2a2a38]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
