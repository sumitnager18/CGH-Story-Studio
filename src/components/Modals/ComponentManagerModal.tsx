import React, { useEffect, useState } from 'react';
import { CheckCircle2, Download, HardDrive, Loader2, X, Wrench } from 'lucide-react';

type ComponentStatus = {
  id: string;
  installed: boolean;
  path?: string;
  version?: string;
};

const isDesktop = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export const ComponentManagerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [components, setComponents] = useState<ComponentStatus[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const refresh = async () => {
    if (!isDesktop()) {
      setComponents([{ id: 'ffmpeg', installed: false }]);
      setMessage('Desktop mode is required for native components.');
      return;
    }

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke<ComponentStatus[]>('get_component_status');
      setComponents(result);
      setMessage('');
    } catch (error) {
      setMessage(String(error));
    }
  };

  useEffect(() => { void refresh(); }, []);

  const prepare = async (id: string) => {
    if (!isDesktop()) return;
    setBusy(true);
    setMessage('Preparing managed component directory...');
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const path = await invoke<string>('prepare_component_directory', { component: id });
      setMessage(`Component directory ready: ${path}`);
      await refresh();
    } catch (error) {
      setMessage(String(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#18181d] border border-[#30303a] rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#292932] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-white font-bold">
              <Wrench className="w-4 h-4 text-cyan-300" />
              Component Manager
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Optional native engines used by CGH Story Studio.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#292932] text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-[11px] text-slate-300">
            Components are kept separate from the core application. This keeps the installer smaller and lets the studio update engines independently.
          </div>

          <div className="rounded-xl border border-[#2c2c35] bg-[#121216] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#20202a] flex items-center justify-center text-cyan-300">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">FFmpeg Media Engine</div>
                <div className="text-[10px] text-slate-400">
                  Transcoding, thumbnails, audio extraction and final media rendering.
                </div>
                {components[0]?.version && <div className="text-[10px] text-emerald-300 mt-1">{components[0].version}</div>}
              </div>
            </div>
            {components[0]?.installed ? (
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Ready
              </div>
            ) : (
              <button
                disabled={busy}
                onClick={() => void prepare('ffmpeg')}
                className="px-3 py-2 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Prepare
              </button>
            )}
          </div>

          {message && <div className="text-[10px] text-slate-400 font-mono break-all">{message}</div>}

          <div className="text-[10px] text-slate-500">
            Native component downloads will be signature/hash verified before activation in the production desktop build.
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#292932] flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#26262f] hover:bg-[#30303a] text-slate-200 text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
