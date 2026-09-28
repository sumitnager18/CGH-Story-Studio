// Asset Domain Engine — Authoritative registry, validation, diversity-aware search,
// and semantic asset application.

import { LibraryAsset, AssetCategory, AssetFilterOptions, AssetSearchResult } from '../types/assets';
import { rendererRegistry } from '../utils/rendererRegistry';
import { validateAssetRenderer, validateAssetMetadata, validateAssetSemantics } from '../utils/assetValidator';
import { searchAssetLibrary, getFullAssetLibrary, getAssetById, ensureAssetImage } from '../data/assetLibrary';

export {
  rendererRegistry,
  validateAssetRenderer,
  validateAssetMetadata,
  validateAssetSemantics,
  searchAssetLibrary,
  getFullAssetLibrary,
  getAssetById,
  ensureAssetImage
};
