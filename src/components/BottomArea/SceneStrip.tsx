import React, { useRef } from 'react';
import { Plus, Play, Clock, Sparkles, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const SceneStrip: React.FC = () => {
  const {
    project,
    selectedScene,
    selectScene,
    addScene,
    setCurrentTime
  } = useStudio();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleCardClick = (sceneId: string) => {
    selectScene(sceneId);
  };

  return (
    <div className="h-24 bg-[#151519] border-b border-[#24242d] flex items-center px-2 relative select-none shrink-0">
      {/* Label / Strip Icon */}
      <div className="flex flex-col items-center justify-center px-2 py-1 border-r border-[#262630] mr-2 text-slate-400">
        <Film className="w-4 h-4 text-[#6c5ce7]" />
        <span className="text-[9px] uppercase font-bold tracking-wider mt-1">Strip</span>
      </div>

      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        className="p-1 rounded-full bg-[#1e1e26] hover:bg-[#282834] text-slate-400 hover:text-white border border-[#2e2e3a] absolute left-12 z-10 shadow-md"
        title="Scroll Left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Horizontally Scrolling Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-2 overflow-x-auto py-1 px-8 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {project.scenes.map((scene) => {
          const isSelected = selectedScene?.id === scene.id;

          return (
            <div
              key={scene.id}
              onClick={() => handleCardClick(scene.id)}
              className={`group flex items-center gap-2.5 h-20 px-2.5 rounded-lg border cursor-pointer transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#22222d] border-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/15 ring-1 ring-[#6c5ce7]'
                  : 'bg-[#191920] border-[#262632] hover:border-[#383848] hover:bg-[#1e1e27]'
              }`}
              style={{ width: '190px' }}
            >
              {/* Thumbnail */}
              <div className="relative w-18 h-14 rounded overflow-hidden bg-black/60 border border-[#2a2a36] shrink-0 flex items-center justify-center">
                {scene.visualAsset?.imageUrl ? (
                  <img
                    src={scene.visualAsset.imageUrl}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Sparkles className="w-4 h-4 text-slate-600" />
                )}
                <div className="absolute top-0.5 left-0.5 bg-black/80 text-white font-mono text-[8px] px-1 rounded">
                  {String(scene.sceneNumber).padStart(2, '0')}
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <div className="font-semibold text-xs text-white truncate group-hover:text-[#a29bfe] transition-colors">
                    {scene.title}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{scene.duration}s</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 uppercase font-mono truncate">
                  {scene.animationPreset !== 'none' ? `Cam: ${scene.animationPreset}` : 'Static'}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Scene Card */}
        <button
          onClick={() => addScene()}
          className="flex flex-col items-center justify-center gap-1 h-20 w-28 rounded-lg border border-dashed border-[#2f2f3d] hover:border-[#6c5ce7] bg-[#17171e] hover:bg-[#1f1f2a] text-slate-400 hover:text-slate-200 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#6c5ce7]" />
          <span className="text-[11px] font-medium">+ Add Scene</span>
        </button>
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="p-1 rounded-full bg-[#1e1e26] hover:bg-[#282834] text-slate-400 hover:text-white border border-[#2e2e3a] absolute right-2 z-10 shadow-md"
        title="Scroll Right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
