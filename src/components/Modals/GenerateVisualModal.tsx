import React, { useState, useEffect } from 'react';
import { X, Sparkles, Dices, Layers, ShieldCheck, Check } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ArtStyle } from '../../types';

export const GenerateVisualModal: React.FC = () => {
  const {
    project,
    generateModalSceneId,
    startGenerateVisual,
    setActiveModal,
    openAssetLibrary
  } = useStudio();

  const targetScene = project.scenes.find(s => s.id === generateModalSceneId) || project.scenes[0];

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>(project.settings.defaultStyle);
  const [seed, setSeed] = useState(1420);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [steps, setSteps] = useState(30);

  useEffect(() => {
    if (targetScene) {
      setPrompt(targetScene.scriptText || 'Cinematic high fantasy environment shot');
      setStyle(targetScene.visualStyle || project.settings.defaultStyle);
      setSelectedCharacterIds(targetScene.characterIds || []);
      setSeed(Math.floor(Math.random() * 9000) + 1000);
    }
  }, [targetScene, project.settings.defaultStyle]);

  if (!targetScene) return null;

  const randomizeSeed = () => {
    setSeed(Math.floor(Math.random() * 9000) + 1000);
  };

  const handleConfirm = () => {
    startGenerateVisual(targetScene.id, {
      prompt,
      style,
      seed,
      characterIds: selectedCharacterIds,
      cfgScale,
      steps
    });
    setActiveModal(null);
  };

  const toggleCharacter = (charId: string) => {
    setSelectedCharacterIds(prev =>
      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Generate Scene Visual
                <span className="text-xs font-mono font-normal text-slate-400">
                  Scene 0{targetScene.sceneNumber}
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
          {/* 10,000+ Asset Vault Alternative Banner */}
          <div className="bg-gradient-to-r from-[#6c5ce7]/20 to-[#06b6d4]/15 border border-[#6c5ce7]/40 rounded-lg p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-[#a29bfe] shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate">
                  Want instant keyframe artwork?
                </span>
                <span className="text-[10px] text-slate-300 block truncate">
                  Browse 11,150+ ready-to-use backgrounds, characters, and poses from CGH Asset Vault.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveModal(null);
                openAssetLibrary('backgrounds');
              }}
              className="px-2.5 py-1.5 bg-[#6c5ce7] hover:bg-[#5849d4] text-white font-semibold rounded text-[11px] whitespace-nowrap shadow-sm transition-colors"
            >
              Browse 11k+ Vault
            </button>
          </div>

          {/* Prompt Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Visual Prompt Description
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe lighting, camera angle, character action, and environmental mood..."
              className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#6c5ce7] leading-relaxed resize-none font-mono"
            />
          </div>

          {/* Style & Seed Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                Art Style Model
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as ArtStyle)}
                className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              >
                <option value="cyberpunk">Cyberpunk Neo-Tokyo</option>
                <option value="anime">Anime / Shonen Cinema</option>
                <option value="cartoon">Stylized Cartoon</option>
                <option value="realistic">Realistic 35mm Film</option>
                <option value="3D">3D Stylized / CGI Render</option>
                <option value="comic">Graphic Novel & Ink</option>
                <option value="oil-painting">Classical Impasto Oil</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Seed Number</span>
                <button
                  type="button"
                  onClick={randomizeSeed}
                  className="text-[10px] text-[#a29bfe] hover:text-white flex items-center gap-1"
                >
                  <Dices className="w-3 h-3" />
                  <span>Random</span>
                </button>
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(parseInt(e.target.value) || 1)}
                className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>
          </div>

          {/* Character Consistency References */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Lock Character Consistency</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>CGH Identity Lock</span>
              </span>
            </label>

            {project.characters.length === 0 ? (
              <div className="p-3 bg-[#121216] border border-[#24242e] rounded-lg text-slate-400 text-center">
                No characters in project cast. Create characters in the Cast tab to lock facial features.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {project.characters.map(char => {
                  const isChecked = selectedCharacterIds.includes(char.id);
                  return (
                    <div
                      key={char.id}
                      onClick={() => toggleCharacter(char.id)}
                      className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#22222e] border-[#6c5ce7]'
                          : 'bg-[#121216] border-[#252530] hover:border-[#353545]'
                      }`}
                    >
                      <img
                        src={char.referenceImage}
                        alt={char.name}
                        className="w-8 h-8 rounded object-cover border border-[#383848]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{char.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          {char.consistencyScore}% Lock
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isChecked ? 'bg-[#6c5ce7] border-[#6c5ce7] text-white' : 'border-[#3f3f50]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CFG & Sampling Steps */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Prompt Guidance (CFG)</span>
                <span className="font-mono text-white">{cfgScale}</span>
              </div>
              <input
                type="range"
                min={3}
                max={15}
                step={0.5}
                value={cfgScale}
                onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                className="w-full accent-[#6c5ce7] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Diffusion Steps</span>
                <span className="font-mono text-white">{steps}</span>
              </div>
              <input
                type="range"
                min={15}
                max={50}
                step={1}
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                className="w-full accent-[#6c5ce7] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#262630] bg-[#16161b] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Est. Generation: ~4.5s (Simulated GPU)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-3 py-1.5 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-md shadow-[#6c5ce7]/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Queue Generation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
