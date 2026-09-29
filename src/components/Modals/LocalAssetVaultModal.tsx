import React, { useEffect, useMemo, useState } from 'react';
import { X, FolderOpen, RefreshCw, Search, Trash2, ShieldCheck, Database, HardDrive, AlertTriangle } from 'lucide-react';
import { clearAssets, formatBytes, loadAssets, scanVault, supportsLocalVault, LocalAsset } from '../../utils/localAssetVault';
import { useStudio } from '../../context/StudioContext';

export const LocalAssetVaultModal: React.FC = () => {
  const { setActiveModal } = useStudio();
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all'|'video'|'image'|'audio'|'model'>('all');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { loadAssets().then(setAssets).catch(e => setError(String(e))); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return assets.filter(a => (type === 'all' || a.type === type) && (!q || (a.name+' '+a.path+' '+a.tags.join(' ')).toLowerCase().includes(q)));
  }, [assets, query, type]);

  const openFolder = async () => {
    setError('');
    if (!supportsLocalVault()) {
      setError('This browser does not expose the local folder API. Use a Chromium-based desktop browser.');
      return;
    }
    try {
      setScanning(true); setProgress(0);
      const root = await (window as any).showDirectoryPicker({ mode: 'read' });
      const result = await scanVault(root, setProgress);
      setAssets(result);
    } catch (e:any) {
      if (e?.name !== 'AbortError') setError(e?.message || String(e));
    } finally { setScanning(false); }
  };

  const reset = async () => { await clearAssets(); setAssets([]); };

  const totalSize = assets.reduce((n,a)=>n+a.size,0);
  const counts = {
    video:assets.filter(a=>a.type==='video').length,
    image:assets.filter(a=>a.type==='image').length,
    audio:assets.filter(a=>a.type==='audio').length,
    model:assets.filter(a=>a.type==='model').length
  };

  return <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
    <div className="w-full max-w-6xl h-[90vh] bg-[#141418] border border-[#2b2b36] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-3 border-b border-[#282832] flex items-center justify-between bg-[#101014]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#6c5ce7]/20 flex items-center justify-center"><Database className="w-5 h-5 text-[#a29bfe]"/></div>
          <div><h2 className="text-sm font-bold text-white">CGH OFFLINE ASSET VAULT</h2><p className="text-[11px] text-slate-400">Local-first index • no asset files are uploaded</p></div>
        </div>
        <button onClick={()=>setActiveModal(null)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
      </div>
      <div className="p-4 border-b border-[#252530] grid grid-cols-2 md:grid-cols-5 gap-2">
        {[['TOTAL', assets.length], ['VIDEO', counts.video], ['IMAGES', counts.image], ['AUDIO', counts.audio], ['SIZE', formatBytes(totalSize)]].map(([label,value])=><div key={String(label)} className="bg-[#1b1b22] border border-[#2a2a34] rounded-lg px-3 py-2"><div className="text-[9px] text-slate-500 font-mono">{label}</div><div className="text-sm font-bold text-white">{value}</div></div>)}
      </div>
      <div className="px-4 py-3 border-b border-[#252530] flex flex-wrap gap-2">
        <button onClick={openFolder} disabled={scanning} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] disabled:opacity-50 text-white text-xs font-semibold">
          {scanning ? <RefreshCw className="w-4 h-4 animate-spin"/> : <FolderOpen className="w-4 h-4"/>}
          {scanning ? `Scanning ${progress} files…` : 'Choose / Scan Vault Folder'}
        </button>
        <div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search local assets…" className="w-full bg-[#1b1b22] border border-[#2e2e3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#6c5ce7]"/></div>
        <select value={type} onChange={e=>setType(e.target.value as any)} className="bg-[#1b1b22] border border-[#2e2e3a] rounded-lg px-3 py-2 text-xs text-slate-200"><option value="all">All types</option><option value="video">Video</option><option value="image">Images</option><option value="audio">Audio</option><option value="model">3D Models</option></select>
        <button onClick={reset} className="p-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10" title="Clear index"><Trash2 className="w-4 h-4"/></button>
      </div>
      {error && <div className="mx-4 mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0"/>{error}</div>}
      <div className="px-4 py-2 bg-[#101014] text-[10px] text-slate-500 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/> License-aware index: local files remain on your machine. Verify the original license before commercial redistribution.</div>
      <div className="flex-1 overflow-auto p-4">
        {filtered.length === 0 ? <div className="h-full flex items-center justify-center text-center"><div><HardDrive className="w-10 h-10 text-slate-600 mx-auto mb-3"/><p className="text-sm text-slate-300">No indexed local assets.</p><p className="text-xs text-slate-500 mt-1">Create a vault folder, put your licensed assets inside it, then scan it.</p></div></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">{filtered.map(a=><div key={a.id} className="bg-[#1a1a20] border border-[#2a2a34] rounded-lg p-3 hover:border-[#6c5ce7]/60">
          <div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="text-xs font-semibold text-white truncate">{a.name}</div><div className="text-[10px] text-slate-500 truncate">{a.path}</div></div><span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#252530] text-slate-300">{a.type}</span></div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500"><span>{formatBytes(a.size)}</span><span>{a.extension.toUpperCase()}</span></div>
          <div className="mt-2 text-[9px] text-amber-300/80">{a.license}</div>
        </div>)}</div>}
      </div>
    </div>
  </div>;
};
