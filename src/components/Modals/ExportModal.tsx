import React, { useState, useEffect } from 'react';
import { X, Download, Film, CheckCircle2, Loader2, Sparkles, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudio } from '../../context/StudioContext';

export const ExportModal: React.FC = () => {
  const { project, setActiveModal } = useStudio();

  const [format, setFormat] = useState<'mp4' | 'webm' | 'prores'>('mp4');
  const [resolution, setResolution] = useState<'1080p' | '4k' | '720p' | '9:16'>('1080p');
  const [quality, setQuality] = useState<'high' | 'lossless' | 'draft'>('high');
  const [burnSubtitles, setBurnSubtitles] = useState(true);

  // Export progress state
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalFrames = (project.timeline.duration || 30) * (project.settings.fps || 24);

  const startExport = () => {
    setIsExporting(true);
    setProgress(0);
    setCurrentFrame(0);
    setIsCompleted(false);

    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setCurrentFrame(Math.floor(totalFrames));
        setIsExporting(false);
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore confetti catch
        }
      } else {
        setProgress(p);
        setCurrentFrame(Math.floor((p / 100) * totalFrames));
      }
    }, 120);
  };

  const handleDownload = () => {
    // Generate a production master bundle summary text file for creator download
    const bundleText = `=== CGH STORY STUDIO PRODUCTION MASTER ===
Project: ${project.name}
Export Timestamp: ${new Date().toISOString()}
Format: ${format.toUpperCase()}
Resolution: ${resolution.toUpperCase()} (1920x1080 equivalent)
Frame Rate: ${project.settings.fps} FPS
Total Duration: ${project.timeline.duration}s
Total Scenes: ${project.scenes.length}
Cast: ${project.characters.map(c => c.name).join(', ')}

--- SCENE BREAKDOWN ---
${project.scenes.map(s => `Scene ${s.sceneNumber}: [${s.title}] (${s.duration}s)
Camera Move: ${s.animationPreset}
Script: ${s.scriptText}
`).join('\n')}

=== AUTO DRAFT RENDER METRICS ===
Status: PASS (100% complete)
Consistency Lock Score: 96.8%
Audio Master: ${project.masterAudio?.fileName || 'Synchronized AI Stems'}
Generated with CGH Story Studio Prototype.
`;

    const blob = new Blob([bundleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_production_master.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-[#1a1a20] border border-[#2e2e38] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#282832] flex items-center justify-between bg-[#16161b]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe]">
              <Film className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white">Export Final Animation Video</h2>
          </div>
          {!isExporting && (
            <button
              onClick={() => setActiveModal(null)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252530]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {!isExporting && !isCompleted ? (
            <>
              {/* Settings Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value="mp4">MP4 (H.264 / AAC High)</option>
                    <option value="webm">WebM (VP9 Cinematic)</option>
                    <option value="prores">Apple ProRes 422 HQ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Resolution
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value as any)}
                    className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value="1080p">1080p Full HD (1920×1080)</option>
                    <option value="4k">4K Ultra HD (3840×2160)</option>
                    <option value="720p">720p HD (1280×720)</option>
                    <option value="9:16">9:16 Vertical (1080×1920)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Quality Preset
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                  >
                    <option value="high">High Bitrate (24 Mbps)</option>
                    <option value="lossless">Lossless Master</option>
                    <option value="draft">Fast Draft (8 Mbps)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                    Frame Rate
                  </label>
                  <div className="w-full bg-[#121216] border border-[#2c2c38] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono">
                    {project.settings.fps} FPS (Cinematic standard)
                  </div>
                </div>
              </div>

              {/* Subtitles Option */}
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121216] border border-[#252530] cursor-pointer hover:border-[#353545]">
                <input
                  type="checkbox"
                  checked={burnSubtitles}
                  onChange={(e) => setBurnSubtitles(e.target.checked)}
                  className="rounded bg-[#20202a] border-[#3a3a48] text-[#6c5ce7] focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-white">Burn-in Subtitles Overlay</div>
                  <div className="text-[10px] text-slate-400">
                    Renders dynamic timed teleprompter dialogue directly into video stream
                  </div>
                </div>
              </label>

              {/* Project summary card */}
              <div className="bg-[#141419] p-3 rounded-lg border border-[#24242e] text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Duration:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{project.timeline.duration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scenes to Render:</span>
                  <span className="font-mono text-white">{project.scenes.length} scenes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Frames:</span>
                  <span className="font-mono text-white">{Math.floor(totalFrames)} frames</span>
                </div>
              </div>
            </>
          ) : (
            /* Render Progress Display */
            <div className="py-6 space-y-4 text-center">
              {isExporting ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-[#6c5ce7]/20 border border-[#6c5ce7]/50 flex items-center justify-center text-[#a29bfe] mx-auto animate-pulse">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Rendering Animation Stream...</h3>
                    <p className="text-xs font-mono text-cyan-400 mt-1">
                      Frame {currentFrame} of {Math.floor(totalFrames)} ({progress}%)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Compositing camera moves, AI keyframes, and audio waveforms...
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-[#121217] rounded-full h-2 overflow-hidden border border-[#262632]">
                    <div
                      className="bg-gradient-to-r from-[#6c5ce7] to-cyan-400 h-full transition-all duration-150 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                /* Finished State */
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Render Completed Successfully!</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Your master animation sequence is assembled and ready.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#262630] bg-[#16161b] flex items-center justify-end gap-2">
          {!isExporting && !isCompleted && (
            <>
              <button
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startExport}
                className="px-4 py-1.5 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] text-white text-xs font-semibold shadow-md shadow-[#6c5ce7]/30 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Start Render</span>
              </button>
            </>
          )}

          {isCompleted && (
            <>
              <button
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 text-xs transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Production Package</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
