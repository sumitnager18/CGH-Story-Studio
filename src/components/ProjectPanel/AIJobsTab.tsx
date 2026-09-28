import React from 'react';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RotateCw,
  Video,
  Mic2,
  Image as ImageIcon,
  Clock
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { AIJobType } from '../../types';

export const AIJobsTab: React.FC = () => {
  const { project, cancelAIJob, retryAIJob } = useStudio();

  const getJobIcon = (type: AIJobType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-[#6c5ce7]" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-cyan-400" />;
      case 'lip-sync':
        return <Mic2 className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 gap-2">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2a2a31]">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#6c5ce7]" />
          <span>AI Task Queue ({project.aiJobs.length})</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Simulated GPU Engine
        </span>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {project.aiJobs.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#2e2e38] rounded-lg">
            <Sparkles className="w-7 h-7 text-slate-600 mb-2" />
            <p className="text-xs text-slate-300 font-medium">No Active AI Operations</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Trigger "Generate Visual", "Animate", or "Lip-Sync" on any scene to queue background processing jobs.
            </p>
          </div>
        ) : (
          project.aiJobs.map(job => {
            const isRunning = job.status === 'running';
            const isDone = job.status === 'done';
            const isFailed = job.status === 'failed';

            return (
              <div
                key={job.id}
                className={`rounded-lg border p-2.5 transition-all ${
                  isRunning
                    ? 'bg-[#1b1b24] border-[#6c5ce7]/60 shadow-xs'
                    : isDone
                    ? 'bg-[#16161b] border-[#262630]'
                    : 'bg-[#1e1518] border-rose-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-[#1f1f2a] flex items-center justify-center shrink-0 border border-[#2e2e38]">
                      {getJobIcon(job.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {job.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="uppercase font-mono text-[9px] text-slate-400">
                          {job.type}
                        </span>
                        <span>•</span>
                        <Clock className="w-2.5 h-2.5" />
                        <span>{new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isRunning && (
                      <span className="text-[9px] bg-[#6c5ce7]/20 border border-[#6c5ce7]/50 text-[#a29bfe] px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        <span>{job.progress}%</span>
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[9px] bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Done</span>
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-[9px] bg-rose-950/60 border border-rose-800/40 text-rose-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                        <span>Failed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5 w-full bg-[#121217] rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isDone
                        ? 'bg-emerald-500'
                        : isFailed
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-[#6c5ce7] to-cyan-400'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>

                {/* Error message or Parameters snippet */}
                {isFailed && (
                  <p className="text-[10px] text-rose-400/90 mt-1.5 italic">
                    {job.errorMessage || 'Generation timeout or interrupted'}
                  </p>
                )}

                {/* Action buttons */}
                <div className="mt-2 flex items-center justify-between text-[10px] pt-1 border-t border-[#22222c]">
                  <span className="text-[9px] text-slate-400 font-mono truncate max-w-[150px]">
                    {job.params?.style ? `Style: ${job.params.style}` : job.params?.preset ? `Move: ${job.params.preset}` : 'Batch Worker #1'}
                  </span>

                  <div className="flex items-center gap-1">
                    {isRunning && (
                      <button
                        onClick={() => cancelAIJob(job.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 px-1.5 py-0.5 rounded transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {isFailed && (
                      <button
                        onClick={() => retryAIJob(job.id)}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/30 px-1.5 py-0.5 rounded transition-colors"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    )}
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
