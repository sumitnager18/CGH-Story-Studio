# CGH Story Studio — Codebase & Architecture Audit Report
Date: 2026-09-25
Status: In-depth Pre-Refactoring Diagnostic

---

## 1. Executive Summary

This audit assesses the current state of the CGH Story Studio browser prototype across data models, timeline mechanics, audio workflows, scene synchronization, asset vault architecture, AI job simulation, and local persistence.

The application has a strong foundation with rich procedural artwork, 11,150 indexed prototype assets across 246 families, and comprehensive UI tab panels. However, several critical architectural flaws exist:
1. **Scene Duration & Timeline De-synchronization:** Changing a scene duration in the inspector updates `scene.duration` in the scene object, but does NOT reflow downstream timeline clips, causing scene clips, visual clips, and narration clips to diverge from scene cards.
2. **Timeline Dragging Bugs:** Dragging or trimming timeline clips committed state to `localStorage` on every pointer move (causing frame drops), and dragging Scene clips did not reflow downstream scenes.
3. **Audio Waveform Consistency:** Waveforms were generated ad-hoc in some places rather than being deterministically sliced from a single master audio waveform using source ranges (`sourceIn` / `sourceOut`).
4. **Scattered Business Logic:** State mutations were embedded directly in visual React components rather than a domain engine layer (`src/domain/`).
5. **Asset Vault Linter Error:** `AssetLibraryModal.tsx` contained references to removed `.rating` and `.downloads` properties, causing TypeScript compile errors.
6. **Playhead Isolation:** Playhead needle visually needed strict bounding to the timeline workspace.

---

## 2. Functional Categorization

### A. REAL FUNCTIONALITY (Working Browser Implementation)
- **Local Persistence & Project Manager:** `src/utils/storage.ts` provides multi-project save/load/delete/duplicate using `localStorage`.
- **Procedural SVG Rendering:** `src/utils/assetSvgGenerator.ts` and `src/utils/rendererRegistry.ts` render deterministic, high-resolution SVG artwork without server dependencies.
- **Authoritative 246 Asset Families:** All 246 families across 7 categories are indexed and searchable.
- **Character Entity Creation & Editing:** Characters support names, roles, palettes, avatar SVG generation, and scene assignment.
- **Undo / Redo Stack:** Functional history stack with `pushUndo`, `undo`, and `redo` keyboard shortcuts.
- **Hotkeys Safety Check:** General shortcuts are partially guarded, but need strict exclusion for `select`, `input`, and `textarea`.

### B. SIMULATED FUNCTIONALITY (Intentionally Mocked for Browser Prototype)
- **AI Job Engine:** Mocked image generation, camera motion animation, and lip-sync simulation with deterministic progress timers.
- **Video Export:** Simulated multi-stage export modal (queued, preparing, rendering, encoding, finalizing) producing downloadable mock project specs.
- **Audio Decoding / Playback:** HTMLAudioElement used when playable Blob URLs are provided; fallback to simulated transport clock and prototype audio labels. (No fake audio oscillator beeping).

### C. INCOMPLETE FUNCTIONALITY
- **Master Audio to Scene Mapping:** Mapping master audio to scenes created basic narration clips, but lacked interactive "Replace Scene Audio" and "Restore Master Audio" mixed-mode overrides.
- **Timeline Snapping:** Basic rounding existed, but did not support fine grid increments (0.1s, 0.25s) with Shift-bypass.
- **Split at Playhead:** Existed for arbitrary clips, but did not correctly recompute audio `sourceIn`/`sourceOut` slices for narration clips.
- **Diversity-Aware Ranking:** Needed explicit interleaving in `searchAssetLibrary` to prevent identical variants from clumping on page 1.

### D. BROKEN FUNCTIONALITY (Must Fix in This Pass)
- **Downstream Scene Reflow:** When Scene duration changes (via inspector input or timeline drag), later scenes remained at stale timestamps instead of reflowing.
- **Scene Clip Direct Manipulation:** Scene clips in the timeline lacked discoverable trim handles and min-duration constraints (2s minimum).
- **TypeScript Error in AssetLibraryModal:** References to `asset.rating` and `asset.downloads` caused `tsc --noEmit` failure.
- **Zooming During Drag:** Timeline zoom was vulnerable to scroll/drag event leakage.

---

## 3. Data Trace Analysis

### Trace 1: Scene Duration Change (Inspector)
- **User Action:** User edits duration input in Scene Inspector from 6.0s to 9.0s.
- **Event Handler:** `updateScene(sceneId, { duration: 9.0 })`.
- **Current Defect:** Only `project.scenes` is updated. `project.timeline.clips` remains unchanged. Downstream scenes (Scene 02, Scene 03) are NOT shifted by +3.0s.
- **Target Fix:** `sceneEngine.updateSceneDuration(project, sceneId, newDuration)` recalculates timeline boundaries for all downstream scene, visual, and narration clips, updates total timeline duration, and saves state atomically.

### Trace 2: Dragging Scene Right Edge (Timeline)
- **User Action:** User drags right edge of Scene 01 clip to resize.
- **Current Defect:** Calls `trimClip` on every `mousemove`, saving to `localStorage` 60x/sec, and does not reflow subsequent scenes.
- **Target Fix:** Use pointer capture with local interaction state (`resizingScene`). Only on `pointerup`, invoke `timelineEngine.resizeSceneClip(project, sceneId, newDuration)` once, reflow downstream clips, push one history command, and autosave.

### Trace 3: Master Audio Mapping
- **User Action:** User imports Master M4A file and clicks "Map Master to Scenes".
- **Current Defect:** Narration clips get generated, but trimming them does not re-slice the master waveform correctly.
- **Target Fix:** `audioEngine` generates one authoritative master waveform. Narration clips reference `sourceIn` and `sourceOut` and display a sliced subsection of the master waveform.

---

## 4. Remediation Plan

1. Fix TypeScript compilation immediately (`AssetLibraryModal.tsx`).
2. Establish Domain Layer in `src/domain/`:
   - `timelineEngine.ts`
   - `sceneEngine.ts`
   - `audioEngine.ts`
   - `assetEngine.ts`
   - `jobEngine.ts`
   - `projectEngine.ts`
   - `validationEngine.ts`
3. Wire StudioContext and visual components to domain engines.
4. Implement Scene reflow, drag-resize handles, and timeline coordinates.
5. Create comprehensive test plans and audit documentation.
