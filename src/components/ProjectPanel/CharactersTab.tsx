import React from 'react';
import { Plus, User, ShieldCheck, Palette, Sparkles, Trash2, Edit3 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const CharactersTab: React.FC = () => {
  const {
    project,
    selectedCharacter,
    selectCharacter,
    addCharacter,
    deleteCharacter,
    setCharacterEditId,
    setActiveModal,
    openAssetLibrary
  } = useStudio();

  const handleEdit = (charId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    selectCharacter(charId);
    setCharacterEditId(charId);
    setActiveModal('character-edit');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 gap-2">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2a2a31]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <User className="w-3.5 h-3.5 text-[#6c5ce7]" />
          <span>Characters ({project.characters.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openAssetLibrary('characters')}
            className="flex items-center gap-1 text-[11px] bg-[#6c5ce7]/15 hover:bg-[#6c5ce7]/30 text-[#a29bfe] px-2 py-1 rounded border border-[#6c5ce7]/40 transition-colors"
            title="Browse 2,500+ Consistent Character Archetypes in CGH Asset Vault"
          >
            <Sparkles className="w-3 h-3 text-[#a29bfe]" />
            <span>Vault (2.5k+)</span>
          </button>
          <button
            onClick={() => addCharacter()}
            className="flex items-center gap-1 text-[11px] bg-[#22222b] hover:bg-[#2c2c38] text-slate-200 px-2 py-1 rounded border border-[#2e2e38] transition-colors"
          >
            <Plus className="w-3 h-3 text-[#6c5ce7]" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Characters List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {project.characters.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#2e2e38] rounded-lg">
            <User className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-300 font-medium">No characters added yet</p>
            <p className="text-[11px] text-slate-400 mt-1 mb-3">
              Add characters to lock visual consistency across all generated storyboard frames.
            </p>
            <button
              onClick={() => addCharacter()}
              className="text-xs bg-[#6c5ce7] hover:bg-[#5849d4] text-white px-3 py-1.5 rounded font-medium"
            >
              + Create Character
            </button>
          </div>
        ) : (
          project.characters.map((char) => {
            const isSelected = selectedCharacter?.id === char.id;
            const appearanceScenes = project.scenes.filter(s => s.characterIds.includes(char.id));

            return (
              <div
                key={char.id}
                onClick={() => selectCharacter(char.id)}
                className={`rounded-lg border p-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#22222b] border-[#6c5ce7] shadow-md shadow-[#6c5ce7]/10'
                    : 'bg-[#18181f] border-[#26262f] hover:border-[#3a3a46]'
                }`}
              >
                <div className="flex gap-3 items-start">
                  {/* Avatar Frame */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#121216] border border-[#2e2e38] shrink-0">
                    <img
                      src={char.referenceImage}
                      alt={char.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-xs text-white truncate">
                        {char.name}
                      </div>
                      {/* AI Consistency Score Badge */}
                      <div
                        className="flex items-center gap-1 text-[9px] bg-emerald-950/70 border border-emerald-700/40 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-medium"
                        title="Simulated Consistency Lock: Facial features & style locked across diffusion passes"
                      >
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{char.consistencyScore}% Lock</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#a29bfe] font-medium mt-0.5">
                      {char.role || 'Character'} • {char.age ? `${char.age} yrs` : 'Age N/A'}
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                      {char.bodyFaceHair}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <Palette className="w-3 h-3 text-slate-400" />
                      <div className="flex items-center gap-1">
                        {char.palette.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="w-3 h-3 rounded-full border border-black/40 shadow-xs"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-slate-400 ml-auto">
                        In {appearanceScenes.length} {appearanceScenes.length === 1 ? 'scene' : 'scenes'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="mt-2.5 pt-2 border-t border-[#262630] flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 uppercase tracking-wider font-mono text-[9px]">
                    Style: {char.artStyle}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleEdit(char.id, e)}
                      className="p-1 text-slate-400 hover:text-slate-200 hover:bg-[#2c2c38] rounded transition-colors"
                      title="Edit Character Details"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCharacter(char.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-[#2c2c38] rounded transition-colors"
                      title="Delete Character"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
