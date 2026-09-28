// AI Job Lifecycle Domain Engine — Manages job queue, progress, cancellation, and execution
// Requirement Phase 50

import { AIJob, AIJobType, AIJobStatus } from '../types';
import { mockImageProvider, mockAnimationProvider, mockLipSyncProvider } from '../providers/mockProviders';

export function createAIJob(
  type: AIJobType,
  title: string,
  params: any,
  sceneId?: string,
  characterId?: string
): AIJob {
  return {
    id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type,
    title,
    sceneId,
    characterId,
    status: 'queued',
    progress: 0,
    params,
    createdAt: Date.now()
  };
}

export function updateJobStatus(
  jobs: AIJob[],
  jobId: string,
  updates: Partial<AIJob>
): AIJob[] {
  return jobs.map(j => {
    if (j.id === jobId) {
      return { ...j, ...updates };
    }
    return j;
  });
}

// Active execution runner supporting cancellation tokens
export class JobRunner {
  private activeCancellations = new Set<string>();

  cancel(jobId: string) {
    this.activeCancellations.add(jobId);
  }

  isCancelled(jobId: string): boolean {
    return this.activeCancellations.has(jobId);
  }

  clear(jobId: string) {
    this.activeCancellations.delete(jobId);
  }

  async runJob(
    job: AIJob,
    onProgress: (progress: number, message: string) => void
  ): Promise<any> {
    this.clear(job.id);

    if (job.type === 'image') {
      return mockImageProvider.generateArtwork(job.params, (pct, msg) => {
        if (!this.isCancelled(job.id)) {
          onProgress(pct, msg);
        }
      });
    }

    if (job.type === 'video') {
      return mockAnimationProvider.animateKeyframe(job.params, (pct, msg) => {
        if (!this.isCancelled(job.id)) {
          onProgress(pct, msg);
        }
      });
    }

    if (job.type === 'lip-sync') {
      return mockLipSyncProvider.generatePhonemes(job.params, (pct, msg) => {
        if (!this.isCancelled(job.id)) {
          onProgress(pct, msg);
        }
      });
    }

    return null;
  }
}

export const globalJobRunner = new JobRunner();
