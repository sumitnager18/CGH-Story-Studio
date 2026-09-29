export type LocalAssetType = 'video' | 'image' | 'audio' | 'model' | 'other';
export type CommercialStatus = 'verified' | 'review' | 'not-for-redistribution';

export interface LocalAsset {
  id: string;
  name: string;
  path: string;
  type: LocalAssetType;
  extension: string;
  size: number;
  modified: number;
  source: 'local';
  sourceName: string;
  license: string;
  licenseUrl?: string;
  commercialUse: CommercialStatus;
  attribution?: string;
  tags: string[];
  favorite?: boolean;
  collection?: string;
}

interface VaultState {
  id: 'root';
  rootName: string;
  rootHandle?: any;
  lastScan: number;
}

const DB_NAME = 'cgh-local-asset-vault';
const DB_VERSION = 2;
const ASSETS = 'assets';
const STATE = 'state';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(ASSETS)) db.createObjectStore(ASSETS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STATE)) db.createObjectStore(STATE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function classifyFile(name: string): LocalAssetType {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (['mp4','webm','mov','mkv','avi','m4v'].includes(ext)) return 'video';
  if (['png','jpg','jpeg','webp','gif','svg','bmp','avif'].includes(ext)) return 'image';
  if (['wav','mp3','ogg','flac','m4a','aac'].includes(ext)) return 'audio';
  if (['glb','gltf','fbx','obj','blend'].includes(ext)) return 'model';
  return 'other';
}

function tagsFor(path: string): string[] {
  return [...new Set(path.toLowerCase().split(/[\\/._ -]+/).filter(Boolean))].slice(0, 40);
}

export async function scanVault(
  root: any,
  options?: {
    sourceName?: string;
    license?: string;
    licenseUrl?: string;
    commercialUse?: CommercialStatus;
    attribution?: string;
    onProgress?: (count:number, current:string)=>void;
  }
): Promise<LocalAsset[]> {
  const found: LocalAsset[] = [];
  const sourceName = options?.sourceName || root.name || 'Local Vault';

  async function walk(dir: any, prefix='') {
    for await (const [name, handle] of dir.entries()) {
      const relative = prefix ? prefix + '/' + name : name;
      if (handle.kind === 'directory') await walk(handle, relative);
      else {
        const file = await handle.getFile();
        const type = classifyFile(name);
        if (type === 'other') continue;
        found.push({
          id: btoa(unescape(encodeURIComponent(relative))).replace(/[^a-zA-Z0-9]/g,'').slice(0,80) + '-' + file.size,
          name, path: relative, type,
          extension: name.split('.').pop()?.toLowerCase() || '',
          size: file.size, modified: file.lastModified,
          source: 'local',
          sourceName,
          license: options?.license || 'LOCAL — verify original source license',
          licenseUrl: options?.licenseUrl,
          commercialUse: options?.commercialUse || 'review',
          attribution: options?.attribution,
          tags: tagsFor(relative)
        });
        options?.onProgress?.(found.length, relative);
      }
    }
  }

  await walk(root);
  const db = await openDb();
  const tx = db.transaction(ASSETS, 'readwrite');
  const store = tx.objectStore(ASSETS);
  store.clear();
  for (const asset of found) store.put(asset);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  const stateDb = db.transaction(STATE, 'readwrite').objectStore(STATE);
  stateDb.put({ id:'root', rootName: root.name || 'Local Vault', rootHandle: root, lastScan: Date.now() });
  return found;
}

export async function loadAssets(): Promise<LocalAsset[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(ASSETS, 'readonly').objectStore(ASSETS).getAll();
    req.onsuccess = () => resolve(req.result as LocalAsset[]);
    req.onerror = () => reject(req.error);
  });
}

export async function loadVaultState(): Promise<VaultState | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STATE, 'readonly').objectStore(STATE).get('root');
    req.onsuccess = () => resolve((req.result as VaultState) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function updateAsset(id:string, patch:Partial<LocalAsset>):Promise<void> {
  const db = await openDb();
  const tx = db.transaction(ASSETS, 'readwrite');
  const store = tx.objectStore(ASSETS);
  const req = store.get(id);
  await new Promise<void>((resolve,reject)=>{
    req.onsuccess=()=>{ if(req.result) store.put({...req.result,...patch}); resolve(); };
    req.onerror=()=>reject(req.error);
  });
}

export async function clearAssets(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([ASSETS, STATE], 'readwrite');
  tx.objectStore(ASSETS).clear();
  tx.objectStore(STATE).clear();
  await new Promise<void>((resolve,reject)=>{tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});
}

export async function getLocalFile(asset: LocalAsset): Promise<File | null> {
  const state = await loadVaultState();
  if (!state?.rootHandle) return null;
  let current = state.rootHandle;
  for (const part of asset.path.split('/')) {
    current = part === asset.name
      ? await current.getFileHandle(part)
      : await current.getDirectoryHandle(part);
  }
  return current.getFile();
}

export function supportsLocalVault(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export function formatBytes(bytes:number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
  if (bytes < 1024*1024*1024) return `${(bytes/1024/1024).toFixed(1)} MB`;
  return `${(bytes/1024/1024/1024).toFixed(2)} GB`;
}
