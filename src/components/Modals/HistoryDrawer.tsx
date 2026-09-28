import React from 'react';
import { X, History, Undo2, Redo2, Clock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const HistoryDrawer: React.FC = () => {
  const { commandHistory, canUndo, canRedo, undo, redo, setActiveModal } = useStudio();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Command History</h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="p-3 bg-[#15151b] border-b border-[#24242e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                canUndo ? 'bg-[#242430] hover:bg-[#2e2e3e] text-white' : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                canRedo ? 'bg-[#242430] hover:bg-[#2e2e3e] text-white' : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>Redo</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {commandHistory.length} recorded events
          </span>
        </div>

        {/* History List */}
        <div className="p-4 space-y-1.5 text-xs overflow-y-auto max-h-[60vh]">
          {commandHistory.map((item, idx) => (
            <div
              key={item.id}
              className={`p-2 rounded-lg border flex items-center justify-between ${
                idx === 0
                  ? 'bg-[#22222e] border-[#6c5ce7]/50 text-white font-medium'
                  : 'bg-[#141418] border-[#22222b] text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7]" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
