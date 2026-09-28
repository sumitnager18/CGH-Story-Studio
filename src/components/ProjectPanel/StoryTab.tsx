import React, { useState, useEffect } from 'react';
import { Sparkles, Scissors, FileText, Clock, AlignLeft, RefreshCw } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const StoryTab: React.FC = () => {
  const { project, updateScript, autoSplitScriptIntoScenes } = useStudio();
  const [localScript, setLocalScript] = useState(project.script);

  useEffect(() => {
    setLocalScript(project.script);
  }, [project.script]);

  const wordCount = localScript.trim() ? localScript.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round(wordCount / 2.3);
  const minutes = Math.floor(estimatedSeconds / 60);
  const seconds = estimatedSeconds % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalScript(val);
    updateScript(val);
  };

  const insertSceneHeader = () => {
    const nextNum = project.scenes.length + 1;
    const header = `\n\nSCENE ${nextNum}: NEW SEQUENCE\nEnter description and dialogue here...\n`;
    const updated = localScript + header;
    setLocalScript(updated);
    updateScript(updated);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 gap-3">
      {/* Header stats & auto-split button */}
      <div className="flex items-center justify-between bg-[#1f1f26] p-2.5 rounded-lg border border-[#2a2a33]">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-[#6c5ce7]" />
            <span className="font-semibold text-white">{wordCount}</span>
            <span className="text-slate-400">words</span>
          </div>
          <div className="w-[1px] h-3 bg-[#33333d]" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-white">{timeFormatted}</span>
            <span className="text-slate-400">est. voiceover</span>
          </div>
        </div>

        <button
          onClick={insertSceneHeader}
          className="text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-[#272732] hover:bg-[#323240] border border-[#373746] transition-colors"
        >
          + Add Scene Tag
        </button>
      </div>

      {/* Script Text Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#141418] rounded-lg border border-[#26262e] overflow-hidden focus-within:border-[#6c5ce7] transition-colors">
        <div className="bg-[#191920] px-3 py-1.5 border-b border-[#26262e] flex items-center justify-between text-[11px] text-slate-400">
          <span>Master Script / Storyboard Prompt</span>
          <span className="text-[10px] text-slate-400">Splits on blank lines or SCENE tags</span>
        </div>
        <textarea
          value={localScript}
          onChange={handleScriptChange}
          placeholder="Paste or write your narration script here...&#10;&#10;SCENE 1: THE DISCOVERY&#10;In the heart of the neon city...&#10;&#10;SCENE 2: THE REVELATION&#10;She looked into the cybernetic mirror..."
          className="flex-1 w-full bg-transparent p-3 text-xs text-slate-200 placeholder-slate-600 resize-none font-mono focus:outline-none leading-relaxed overflow-y-auto"
        />
      </div>

      {/* Action button: Auto-split into scenes */}
      <div className="pt-1">
        <button
          onClick={() => autoSplitScriptIntoScenes(localScript)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#6c5ce7] to-[#7d6cf0] hover:from-[#5849d4] hover:to-[#6c5ce7] text-white text-xs font-semibold shadow-md shadow-[#6c5ce7]/20 transition-all active:scale-[0.99]"
        >
          <Scissors className="w-4 h-4" />
          <span>Auto-Split Script into Scenes</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-1.5">
          Analyzes paragraphs & automatically generates scene cards, durations, and timeline clips
        </p>
      </div>
    </div>
  );
};
