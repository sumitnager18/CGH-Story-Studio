export type LocalAssetType = 'video' | 'image' | 'audio' | 'model' | 'other';

export interface LocalAsset {
  id: string;
  name: string;
  path: string;
  type: LocalAssetType;
  extension: string;
  size: number;
  modified: number;
  source: 'local';
  license: string;
  commercialUse: 'yes' | 'review';
  tags: string[];
}

const DB_NAME = 'cgh-local-asset-vault';
const STORE = 'assets';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
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

export async function scanVault(root: FileSystemDirectoryHandle, onProgress?: (count:number)=>void): Promise<LocalAsset[]> {
  const found: LocalAsset[] = [];
  async function walk(dir: FileSystemDirectoryHandle, prefix='') {
    for await (const [name, handle] of dir.entries()) {
      const relative = prefix ? prefix + '/' + name : name;
      if (handle.kind === 'directory') await walk(handle, relative);
      else {
        const file = await handle.getFile();
        const type = classifyFile(name);
        if (type === 'other') continue;
        found.push({
          id: `${relative}:${file.size}:${file.lastModified}`,
          name, path: relative, type,
          extension: name.split('.').pop()?.toLowerCase() || '',
          size: file.size, modified: file.lastModified,
          source: 'local',
          license: 'LOCAL — verify source license',
          commercialUse: 'review',
          tags: relative.toLowerCase().split(/[\\/._ -]+/).filter(Boolean).slice(0, 20)
        });
        onProgress?.(found.length);
      }
    }
  }
  await walk(root);
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  for (const asset of found) store.put(asset);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return found;
}

export async function loadAssets(): Promise<LocalAsset[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as LocalAsset[]);
    req.onerror = () => reject(req.error);
  });
}

export async function clearAssets(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const req = db.transaction(STORE, 'readwrite').objectStore(STORE).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
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
