import React, { useState, useEffect } from 'react';
import { X, User, Palette, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ArtStyle } from '../../types';
import { generateCharacterAvatar } from '../../utils/artworkGenerator';

export const CharacterEditModal: React.FC = () => {
  const {
    project,
    characterEditId,
    updateCharacter,
    setActiveModal
  } = useStudio();

  const targetChar = project.characters.find(c => c.id === characterEditId);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');
  const [bodyFaceHair, setBodyFaceHair] = useState('');
  const [clothing, setClothing] = useState('');
  const [artStyle, setArtStyle] = useState<ArtStyle>('anime');
  const [palette, setPalette] = useState<string[]>(['#6c5ce7', '#00cec9', '#fdcb6e']);

  useEffect(() => {
    if (targetChar) {
      setName(targetChar.name);
      setRole(targetChar.role || '');
      setAge(targetChar.age || '');
      setBodyFaceHair(targetChar.bodyFaceHair);
      setClothing(targetChar.clothing);
      setArtStyle(targetChar.artStyle);
      setPalette(targetChar.palette || ['#6c5ce7', '#00cec9', '#fdcb6e']);
    }
  }, [targetChar]);

  if (!targetChar) return null;

  const handleRegenerateAvatar = () => {
    const newAvatar = generateCharacterAvatar(name || 'Character', artStyle, palette);
    updateCharacter(targetChar.id, { referenceImage: newAvatar }, 'Regenerate Character Avatar');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAvatar = generateCharacterAvatar(name || 'Character', artStyle, palette);
    updateCharacter(targetChar.id, {
      name,
      role,
      age,
      bodyFaceHair,
      clothing,
      artStyle,
      palette,
      referenceImage: updatedAvatar
    }, 'Update Character Profile');
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Edit Character Profile & IP-Adapter</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5 text-xs overflow-y-auto max-h-[75vh]">
          <div className="flex items-center gap-4 bg-[#141418] p-3 rounded-lg border border-[#262632]">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#3a3a4c] shrink-0 bg-[#0c0c10]">
              <img
                src={targetChar.referenceImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">{name || 'Unnamed'}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {targetChar.consistencyScore}% Lock
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Visual identity features and palette are embedded into all prompt generations.
              </p>
              <button
                type="button"
                onClick={handleRegenerateAvatar}
                className="mt-2 text-[10px] text-cyan-300 hover:text-cyan-100 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Reroll Reference Avatar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-semibold text-slate-300 uppercase">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121216] border border-[#2c2c38] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-300 uppercase">Age</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="24"
                className="w-full bg-[#121216] border border-[#2c2c38] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-300 uppercase">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Protagonist / Rebel"
                className="w-full bg-[#121216] border border-[#2c2c38] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-300 uppercase">Art Style</label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                className="w-full bg-[#121216] border border-[#2c2c38] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              >
                <option value="cyberpunk">Cyberpunk</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="realistic">Realistic 35mm</option>
                <option value="3D">3D Render</option>
                <option value="comic">Graphic Comic</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-300 uppercase">Body, Face & Hair</label>
            <textarea
              rows={2}
              value={bodyFaceHair}
              onChange={(e) => setBodyFaceHair(e.target.value)}
              placeholder="Facial contours, eye color, distinctive markings..."
              className="w-full bg-[#121216] border border-[#2c2c38] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7] resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-300 uppercase">Clothing & Signature Attire</label>
            <textarea
              rows={2}
              value={clothing}
              onChange={(e) => setClothing(e.target.value)}
              placeholder="Jacket, footwear, props, color scheme..."
              className="w-full bg-[#121216] border border-[#2c2c38] rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#6c5ce7] resize-none"
            />
          </div>

          {/* Palette Picker */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-slate-300 uppercase flex items-center justify-between">
              <span>Color Palette Swatches</span>
              <span className="text-[9px] text-slate-400 font-mono">3 Colors</span>
            </label>
            <div className="flex items-center gap-3 bg-[#121216] p-2 rounded border border-[#262630]">
              {palette.map((hex, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => {
                      const next = [...palette];
                      next[idx] = e.target.value;
                      setPalette(next);
                    }}
                    className="w-7 h-7 rounded border border-black cursor-pointer bg-transparent"
                  />
                  <span className="font-mono text-[10px] text-slate-300">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#262630]">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-3 py-1.5 rounded bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-md shadow-[#6c5ce7]/30 transition-all"
            >
              Save Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
