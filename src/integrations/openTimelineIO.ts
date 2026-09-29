import { Project, TimelineClip, TrackType } from '../types';

export interface OTIOExportOptions {
  mediaResolver?: (clip: TimelineClip) => string | undefined;
}

const trackNames: Record<TrackType, string> = {
  scene: 'Scenes',
  narration: 'Narration',
  visuals: 'Visuals',
  music: 'Music',
  sfx: 'SFX'
};

function rationalTime(value: number, rate: number) {
  return {
    value: Math.max(0, value * rate),
    rate
  };
}

function makeMediaReference(clip: TimelineClip, options: OTIOExportOptions) {
  const url = options.mediaResolver?.(clip);
  if (!url) return undefined;

  return {
    OTIO_SCHEMA: 'ExternalReference.1',
    available_range: {
      OTIO_SCHEMA: 'TimeRange.1',
      start_time: rationalTime(clip.sourceIn || 0, 1),
      duration: rationalTime(clip.duration || 0, 1)
    },
    target_url: url
  };
}

function makeClip(clip: TimelineClip, fps: number, options: OTIOExportOptions) {
  const item: any = {
    OTIO_SCHEMA: 'Clip.2',
    name: clip.title,
    source_range: {
      OTIO_SCHEMA: 'TimeRange.1',
      start_time: rationalTime(clip.sourceIn || 0, fps),
      duration: rationalTime(clip.duration || 0, fps)
    },
    metadata: {
      CGH: {
        clipId: clip.id,
        sceneId: clip.sceneId,
        assetId: clip.assetId,
        localAssetId: clip.localAssetId,
        trackId: clip.trackId,
        volume: clip.volume,
        fadeIn: clip.fadeIn,
        fadeOut: clip.fadeOut
      }
    }
  };

  const mediaReference = makeMediaReference(clip, options);
  if (mediaReference) item.media_reference = mediaReference;

  return item;
}

export function projectToOpenTimelineIO(project: Project, options: OTIOExportOptions = {}) {
  const fps = project.settings.fps || 24;

  const tracks = (['scene', 'narration', 'visuals', 'music', 'sfx'] as TrackType[])
    .map(trackId => {
      const clips = project.timeline.clips
        .filter(clip => clip.trackId === trackId)
        .sort((a, b) => a.start - b.start);

      const children: any[] = [];
      let cursor = 0;

      for (const clip of clips) {
        if (clip.start > cursor) {
          children.push({
            OTIO_SCHEMA: 'Gap.1',
            name: 'Gap',
            duration: rationalTime(clip.start - cursor, fps)
          });
        }

        children.push(makeClip(clip, fps, options));
        cursor = Math.max(cursor, clip.start + clip.duration);
      }

      return {
        OTIO_SCHEMA: 'Track.1',
        name: trackNames[trackId],
        kind: trackId === 'narration' || trackId === 'music' || trackId === 'sfx' ? 'Audio' : 'Video',
        children
      };
    });

  return {
    OTIO_SCHEMA: 'Timeline.1',
    name: project.name,
    global_start_time: rationalTime(0, fps),
    duration: rationalTime(project.timeline.duration || 0, fps),
    metadata: {
      CGH: {
        projectId: project.id,
        resolution: project.settings.resolution,
        fps,
        aspectRatio: project.settings.aspectRatio,
        exportedAt: new Date().toISOString()
      }
    },
    tracks: {
      OTIO_SCHEMA: 'Stack.1',
      name: 'CGH Story Studio Tracks',
      children: tracks
    }
  };
}

export function downloadOpenTimelineIO(project: Project, options: OTIOExportOptions = {}) {
  const data = projectToOpenTimelineIO(project, options);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/gi, '_')}.otio`;
  anchor.click();
  URL.revokeObjectURL(url);
}
