/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/Header';
import { ProjectPanel } from './components/ProjectPanel/ProjectPanel';
import { CanvasPreview } from './components/Canvas/CanvasPreview';
import { InspectorPanel } from './components/Inspector/InspectorPanel';
import { SceneStrip } from './components/BottomArea/SceneStrip';
import { Timeline } from './components/BottomArea/Timeline';
import { GenerateVisualModal } from './components/Modals/GenerateVisualModal';
import { ExportModal } from './components/Modals/ExportModal';
import { ProjectManagerModal } from './components/Modals/ProjectManagerModal';
import { CharacterEditModal } from './components/Modals/CharacterEditModal';
import { KeyboardShortcutsModal } from './components/Modals/KeyboardShortcutsModal';
import { HistoryDrawer } from './components/Modals/HistoryDrawer';
import { AssetLibraryModal } from './components/Modals/AssetLibraryModal';
import { LocalAssetVaultModal } from './components/Modals/LocalAssetVaultModal';
import { ComponentManagerModal } from './components/Modals/ComponentManagerModal';

const StudioWorkspace: React.FC = () => {
  const { activeModal, setActiveModal } = useStudio();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121215] text-slate-100 font-sans">
      {/* Studio Header Bar */}
      <Header />

      {/* Center Row: Left Project Panel + Center Canvas + Right Inspector */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Project Panel (Story, Scenes, Characters, Assets, AI Jobs) */}
        <ProjectPanel />

        {/* Center: Canvas Monitor Preview Area */}
        <CanvasPreview />

        {/* Right: Inspector Context Panel */}
        <InspectorPanel />
      </div>

      {/* Bottom Area: Stacked Scene Strip + Multi-track Timeline */}
      <div className="flex flex-col shrink-0">
        <SceneStrip />
        <Timeline />
      </div>

      {/* Global Modals */}
      {activeModal === 'asset-library' && <AssetLibraryModal />}
      {activeModal === 'local-asset-vault' && <LocalAssetVaultModal />}
      {activeModal === 'components' && <ComponentManagerModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'generate-visual' && <GenerateVisualModal />}
      {activeModal === 'export' && <ExportModal />}
      {activeModal === 'projects' && <ProjectManagerModal />}
      {activeModal === 'character-edit' && <CharacterEditModal />}
      {activeModal === 'shortcuts' && <KeyboardShortcutsModal />}
      {activeModal === 'history' && <HistoryDrawer />}
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <StudioWorkspace />
    </StudioProvider>
  );
}
