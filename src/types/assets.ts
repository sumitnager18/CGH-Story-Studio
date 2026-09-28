import { ArtStyle, CameraPreset } from './index';

export type AssetCategory = 
  | 'characters' 
  | 'backgrounds' 
  | 'poses' 
  | 'expressions' 
  | 'props' 
  | 'audio' 
  | 'styles';

export type QualityStatus = 'pass' | 'review' | 'pending';

export interface SemanticProfile {
  roleOrSubject: string;
  professionOrType?: string;
  ageOrEra?: string;
  locationOrSetting?: string;
  actionOrPose?: string;
  expressionOrMood?: string;
  primaryObject?: string;
  useCase?: string;
}

export interface VisualProfile {
  orientation: 'front' | '3/4 left' | '3/4 right' | 'profile left' | 'profile right' | 'back';
  pose: string;
  palette: string[];
  silhouetteKey: string;
  lighting: string;
  compositionDepth?: number;
  accessories: string[];
}

export interface LibraryAsset {
  id: string;
  title: string;
  category: AssetCategory;
  subcategory: string;
  family: string;
  rendererKey: string;
  style: ArtStyle;
  tags: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio?: string;
  seed: number;
  model: string; // Prototype renderer engine name
  prompt: string;
  negativePrompt?: string;
  
  // Prototype ranking & relevance metrics (no fake marketplace ratings/downloads)
  prototypeRelevance: number; // 90 - 100
  prototypeUsageScore: number; // internal frequency score
  featured?: boolean;
  provider: string; // 'CGH Procedural Asset Engine'
  isPrototype: true;
  source: 'CGH procedural prototype asset';
  archetype?: string;
  qualityStatus: QualityStatus;

  // Strict semantic & visual architecture
  semanticProfile: SemanticProfile;
  visualProfile: VisualProfile;
  
  // Archetype & domain metadata
  characterData?: {
    role: string;
    age: string;
    clothing: string;
    bodyFaceHair: string;
    palette: string[];
    consistencyScore: number;
    orientation?: string;
    accessory?: string;
  };
  backgroundData?: {
    setting: string;
    lighting: string;
    cameraPreset: CameraPreset;
    depthLayerCount: number;
    timeOfDay?: string;
    weather?: string;
  };
  poseData?: {
    motionType: string;
    framing: 'wide' | 'medium' | 'close-up';
    recommendedCamera: CameraPreset;
    rigName: string;
    posture?: string;
  };
  expressionData?: {
    emotion: string;
    intensity: number;
    phoneme?: string;
  };
  audioData?: {
    duration: number;
    audioType: 'music' | 'sfx';
    waveform: number[];
    bpm?: number;
    toneHz?: number;
    mood?: string;
    prototypePreview?: boolean;
  };
  styleData?: {
    styleDescriptor: string;
    styleReference?: string;
    colorTemperature: string;
    cfgRecommendation: number;
  };
}

export interface AssetFilterOptions {
  query?: string;
  category?: AssetCategory | 'all';
  family?: string | 'all';
  style?: ArtStyle | 'all';
  subcategory?: string | 'all';
  sortBy?: 'trending' | 'consistency' | 'name' | 'newest';
  page?: number;
  pageSize?: number;
  diversityAware?: boolean;
}

export interface AssetSearchResult {
  items: LibraryAsset[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  categoryCounts: Record<AssetCategory | 'all', number>;
}
