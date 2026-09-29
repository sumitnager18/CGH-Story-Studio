export interface ManagedComponent {
  id: string;
  name: string;
  purpose: string;
  optional: boolean;
  license: string;
  status: 'planned' | 'available' | 'installed';
}

export const MANAGED_COMPONENTS: ManagedComponent[] = [
  {
    id: 'ffmpeg',
    name: 'FFmpeg Media Engine',
    purpose: 'Transcoding, extraction, proxy generation and final rendering',
    optional: false,
    license: 'LGPL/GPL depending on build configuration',
    status: 'available'
  },
  {
    id: 'whisper',
    name: 'Local Speech-to-Text',
    purpose: 'Offline transcription, subtitle timing and dialogue alignment',
    optional: true,
    license: 'Model/library dependent',
    status: 'planned'
  },
  {
    id: 'three',
    name: '3D Asset Preview Engine',
    purpose: 'Local GLB/GLTF preview inside the asset vault',
    optional: true,
    license: 'MIT',
    status: 'planned'
  }
];
