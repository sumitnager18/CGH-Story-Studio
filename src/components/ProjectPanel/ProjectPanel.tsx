import React from 'react';
import {
  FileText,
  Film,
  Users,
  FolderOpen,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StoryTab } from './StoryTab';
import { ScenesTab } from './ScenesTab';
import { CharactersTab } from './CharactersTab';
import { AssetsTab } from './AssetsTab';
import { AIJobsTab } from './AIJobsTab';

interface TabItem {
  id: 'story' | 'scenes' | 'characters' | 'assets' | 'ai-jobs';
  label: string;
  icon: any;
  count?: number;
  badge?: number | null;
}

export const ProjectPanel: React.FC = () => {
  const { project, activeLeftTab, setActiveLeftTab } = useStudio();
  const runningJobsCount = project.aiJobs.filter(j => j.status === 'running').length;

  const tabs: TabItem[] = [
    { id: 'scenes', label: 'Scenes', icon: Film, count: project.scenes.length },
    { id: 'story', label: 'Story', icon: FileText },
    { id: 'characters', label: 'Cast', icon: Users, count: project.characters.length },
    { id: 'assets', label: 'Assets', icon: FolderOpen },
    { id: 'ai-jobs', label: 'AI Jobs', icon: Sparkles, badge: runningJobsCount > 0 ? runningJobsCount : null }
  ];

  return (
    <aside className="w-[320px] 2xl:w-[360px] h-full bg-[#1a1a1e] border-r border-[#2a2a31] flex flex-col shrink-0 overflow-hidden select-none">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#2a2a31] bg-[#16161a] px-1 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeLeftTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveLeftTab(tab.id as any)}
              className={`flex-1 py-2.5 px-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium border-b-2 transition-all relative ${
                isActive
                  ? 'text-[#a29bfe] border-[#6c5ce7] bg-[#1e1e24]'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1b1b20]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8e7df5]' : 'text-slate-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#6c5ce7] text-white text-[8px] font-bold px-1 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="truncate flex items-center gap-1">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[9px] text-slate-400 font-mono">({tab.count})</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 min-h-0 overflow-hidden bg-[#1a1a1e]">
        {activeLeftTab === 'scenes' && <ScenesTab />}
        {activeLeftTab === 'story' && <StoryTab />}
        {activeLeftTab === 'characters' && <CharactersTab />}
        {activeLeftTab === 'assets' && <AssetsTab />}
        {activeLeftTab === 'ai-jobs' && <AIJobsTab />}
      </div>
    </aside>
  );
};
