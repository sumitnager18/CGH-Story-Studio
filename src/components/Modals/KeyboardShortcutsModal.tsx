import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const { setActiveModal } = useStudio();

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Animation Playback' },
    { key: 'S', desc: 'Split timeline clip at current playhead position' },
    { key: 'Delete / Backspace', desc: 'Delete currently selected clip' },
    { key: 'Ctrl + Z', desc: 'Undo last project change' },
    { key: 'Ctrl + Y / Ctrl+Shift+Z', desc: 'Redo previously undone change' },
    { key: 'Left / Right Arrow', desc: 'Step playhead backward / forward by 1 frame' },
    { key: 'Drag Playhead / Ruler', desc: 'Scrub timeline audio & scene preview' },
    { key: 'Clip Edges', desc: 'Drag left/right trim handles for non-destructive edits' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <Keyboard className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-2.5 text-xs">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-[#141418] border border-[#23232d]"
            >
              <span className="text-slate-300 font-medium">{sc.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#20202a] border border-[#353545] font-mono text-[11px] text-cyan-300 shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-[#262630] bg-[#16161b] flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-1.5 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
