import React, { useEffect, useMemo, useState } from 'react';
import { X, FolderOpen, RefreshCw, Search, Trash2, ShieldCheck, Database, HardDrive, AlertTriangle, Star, FileAudio, FileImage, FileVideo, Box, ExternalLink } from 'lucide-react';
import { clearAssets, formatBytes, loadAssets, loadVaultState, scanVault, supportsLocalVault, updateAsset, LocalAsset, CommercialStatus } from '../../utils/localAssetVault';
import { useStudio } from '../../context/StudioContext';

const typeIcon = (type:LocalAsset['type']) => type==='video' ? FileVideo : type==='audio' ? FileAudio : type==='image' ? FileImage : type==='model' ? Box : HardDrive;

export const LocalAssetVaultModal: React.FC = () => {
  const { setActiveModal } = useStudio();
  const [assets, setAssets] = useState<LocalAsset[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all'|'video'|'image'|'audio'|'model'>('all');
  const [license, setLicense] = useState<'all'|CommercialStatus>('all');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [rootName, setRootName] = useState('');
  const [lastScan, setLastScan] = useState<number|null>(null);
  const [selected, setSelected] = useState<LocalAsset|null>(null);

  const refresh = async () => {
    try {
      setAssets(await loadAssets());
      const s = await loadVaultState();
      setRootName(s?.rootName || '');
      setLastScan(s?.lastScan || null);
    } catch(e) { setError(String(e)); }
  };
  useEffect(()=>{refresh();},[]);

  const scan = async (root:any) => {
    setScanning(true); setProgress(0); setError('');
    try {
      await scanVault(root,{onProgress:(n)=>setProgress(n)});
      await refresh();
    } catch(e:any) { setError(e?.message || String(e)); }
    finally { setScanning(false); }
  };

  const openFolder = async () => {
    if (!supportsLocalVault()) { setError('Folder access requires a Chromium-based desktop browser.'); return; }
    try {
      const root = await (window as any).showDirectoryPicker({mode:'read'});
      await scan(root);
    } catch(e:any) { if(e?.name!=='AbortError') setError(e?.message || String(e)); }
  };

  const rescan = async () => {
    const state = await loadVaultState();
    if (!state?.rootHandle) { await openFolder(); return; }
    try {
      const permission = await state.rootHandle.requestPermission?.({mode:'read'});
      if(permission && permission!=='granted') { await openFolder(); return; }
      await scan(state.rootHandle);
    } catch { await openFolder(); }
  };

  const setLicenseStatus = async (status:CommercialStatus) => {
    if(!selected) return;
    await updateAsset(selected.id,{commercialUse:status});
    const updated={...selected,commercialUse:status};
    setSelected(updated);
    setAssets(a=>a.map(x=>x.id===updated.id?updated:x));
  };

  const toggleFavorite = async (asset:LocalAsset) => {
    const updated={...asset,favorite:!asset.favorite};
    await updateAsset(asset.id,{favorite:updated.favorite});
    setAssets(a=>a.map(x=>x.id===asset.id?updated:x));
    if(selected?.id===asset.id) setSelected(updated);
  };

  const filtered = useMemo(()=>{
    const q=query.toLowerCase().trim();
    return assets
      .filter(a=>(type==='all'||a.type===type))
      .filter(a=>(license==='all'||a.commercialUse===license))
      .filter(a=>!q || (a.name+' '+a.path+' '+a.tags.join(' ')).toLowerCase().includes(q))
      .sort((a,b)=>Number(b.favorite||false)-Number(a.favorite||false));
  },[assets,query,type,license]);

  const totalSize=assets.reduce((n,a)=>n+a.size,0);
  const counts={video:assets.filter(a=>a.type==='video').length,image:assets.filter(a=>a.type==='image').length,audio:assets.filter(a=>a.type==='audio').length,model:assets.filter(a=>a.type==='model').length};
  const verified=assets.filter(a=>a.commercialUse==='verified').length;
  const review=assets.filter(a=>a.commercialUse==='review').length;

  return <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
    <div className="w-full max-w-[1400px] h-[92vh] bg-[#141418] border border-[#2b2b36] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      <header className="px-5 py-3 border-b border-[#282832] flex items-center justify-between bg-[#101014]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#6c5ce7]/20 flex items-center justify-center"><Database className="w-5 h-5 text-[#a29bfe]"/></div>
          <div><h2 className="text-sm font-bold text-white">CGH OFFLINE ASSET VAULT</h2><p className="text-[11px] text-slate-400">{rootName || 'No vault selected'} • local-first • files never uploaded</p></div>
        </div>
        <div className="flex items-center gap-2">
          {lastScan && <span className="text-[10px] text-slate-500">Last scan: {new Date(lastScan).toLocaleString()}</span>}
          <button onClick={()=>setActiveModal(null)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
      </header>

      <section className="p-4 border-b border-[#252530] grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2">
        {[['TOTAL',assets.length],['VIDEO',counts.video],['IMAGES',counts.image],['AUDIO',counts.audio],['3D',counts.model],['VERIFIED',verified],['REVIEW',review]].map(([l,v])=><div key={String(l)} className="bg-[#1b1b22] border border-[#2a2a34] rounded-lg px-3 py-2"><div className="text-[9px] text-slate-500 font-mono">{l}</div><div className="text-sm font-bold text-white">{v}</div></div>)}
      </section>

      <section className="px-4 py-3 border-b border-[#252530] flex flex-wrap gap-2">
        <button onClick={openFolder} disabled={scanning} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#6c5ce7] hover:bg-[#5849d4] disabled:opacity-50 text-white text-xs font-semibold"><FolderOpen className="w-4 h-4"/>{scanning?`Scanning ${progress} files…`:'Choose Vault Folder'}</button>
        <button onClick={rescan} disabled={scanning||!rootName} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e26] border border-[#333342] text-slate-200 text-xs disabled:opacity-40"><RefreshCw className={`w-4 h-4 ${scanning?'animate-spin':''}`}/>Rescan</button>
        <div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search filename, folder, tag…" className="w-full bg-[#1b1b22] border border-[#2e2e3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#6c5ce7]"/></div>
        <select value={type} onChange={e=>setType(e.target.value as any)} className="bg-[#1b1b22] border border-[#2e2e3a] rounded-lg px-3 py-2 text-xs text-slate-200"><option value="all">All types</option><option value="video">Video</option><option value="image">Images</option><option value="audio">Audio</option><option value="model">3D Models</option></select>
        <select value={license} onChange={e=>setLicense(e.target.value as any)} className="bg-[#1b1b22] border border-[#2e2e3a] rounded-lg px-3 py-2 text-xs text-slate-200"><option value="all">All license states</option><option value="verified">Commercial verified</option><option value="review">Needs review</option><option value="not-for-redistribution">Not for redistribution</option></select>
        <button onClick={async()=>{await clearAssets();setAssets([]);setRootName('');setLastScan(null);}} className="p-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10" title="Clear vault index"><Trash2 className="w-4 h-4"/></button>
      </section>

      {error && <div className="mx-4 mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0"/>{error}</div>}

      <div className="px-4 py-2 bg-[#101014] text-[10px] text-slate-500 flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400"/> License metadata is a safety layer, not legal advice. Only mark an asset verified when you have confirmed its actual source license.</div>

      <main className="flex-1 min-h-0 flex">
        <div className="flex-1 overflow-auto p-4">
          {filtered.length===0 ? <div className="h-full flex items-center justify-center text-center"><div><HardDrive className="w-10 h-10 text-slate-600 mx-auto mb-3"/><p className="text-sm text-slate-300">No matching local assets.</p><p className="text-xs text-slate-500 mt-1">Put licensed media in your vault and scan it.</p></div></div> :
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">{filtered.map(a=>{const Icon=typeIcon(a.type);return <button key={a.id} onClick={()=>setSelected(a)} className="text-left bg-[#1a1a20] border border-[#2a2a34] rounded-lg p-3 hover:border-[#6c5ce7]/60">
            <div className="flex items-start gap-3"><div className="w-9 h-9 rounded bg-[#24242d] flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-slate-300"/></div><div className="min-w-0 flex-1"><div className="text-xs font-semibold text-white truncate">{a.name}</div><div className="text-[10px] text-slate-500 truncate">{a.path}</div></div><button onClick={e=>{e.stopPropagation();toggleFavorite(a)}} className="p-1"><Star className={`w-3.5 h-3.5 ${a.favorite?'fill-current text-amber-400':'text-slate-600'}`}/></button></div>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500"><span>{formatBytes(a.size)}</span><span className={a.commercialUse==='verified'?'text-emerald-400':a.commercialUse==='review'?'text-amber-400':'text-red-400'}>{a.commercialUse}</span></div>
          </button>})}</div>}
        </div>

        {selected && <aside className="w-[360px] border-l border-[#282832] bg-[#101014] p-4 overflow-auto">
          <div className="flex items-center justify-between"><div className="text-xs font-bold text-white">ASSET INSPECTOR</div><button onClick={()=>setSelected(null)} className="p-1 text-slate-500 hover:text-white"><X className="w-4 h-4"/></button></div>
          <div className="mt-4 space-y-3">
            <div><div className="text-sm font-semibold text-white break-words">{selected.name}</div><div className="text-[10px] text-slate-500 mt-1 break-all">{selected.path}</div></div>
            <div className="grid grid-cols-2 gap-2"><div className="bg-[#1b1b22] p-2 rounded"><span className="text-[9px] text-slate-500">TYPE</span><div className="text-xs text-white">{selected.type}</div></div><div className="bg-[#1b1b22] p-2 rounded"><span className="text-[9px] text-slate-500">SIZE</span><div className="text-xs text-white">{formatBytes(selected.size)}</div></div></div>
            <div className="bg-[#1b1b22] p-3 rounded border border-[#2a2a34]"><div className="text-[10px] text-slate-400 mb-2">LICENSE STATUS</div><div className="flex gap-1.5 flex-wrap">{(['verified','review','not-for-redistribution'] as CommercialStatus[]).map(s=><button key={s} onClick={()=>setLicenseStatus(s)} className={`px-2 py-1 rounded text-[10px] border ${selected.commercialUse===s?'border-[#6c5ce7] bg-[#6c5ce7]/20 text-white':'border-[#30303b] text-slate-400'}`}>{s}</button>)}</div><p className="text-[10px] text-slate-500 mt-2">{selected.license}</p>{selected.licenseUrl&&<a href={selected.licenseUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 inline-flex items-center gap-1 mt-1">License page <ExternalLink className="w-3 h-3"/></a>}</div>
            <div className="bg-[#1b1b22] p-3 rounded border border-[#2a2a34]"><div className="text-[10px] text-slate-400">TAGS</div><div className="flex flex-wrap gap-1 mt-2">{selected.tags.map(t=><span key={t} className="px-1.5 py-0.5 rounded bg-[#252530] text-[9px] text-slate-300">{t}</span>)}</div></div>
            <button onClick={()=>toggleFavorite(selected)} className="w-full py-2 rounded-lg bg-[#1e1e26] border border-[#333342] text-xs text-slate-200 flex items-center justify-center gap-2"><Star className={`w-4 h-4 ${selected.favorite?'fill-current text-amber-400':''}`}/>{selected.favorite?'Remove from Favorites':'Add to Favorites'}</button>
          </div>
        </aside>}
      </main>
    </div>
  </div>;
};
