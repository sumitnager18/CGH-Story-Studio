// Authoritative Timeline Coordinate System & Snapping Engine
// Requirements 14 & 15

export const DEFAULT_SNAP_INTERVAL = 0.25; // 0.25s default snapping (Requirement 14)

/**
 * Converts timeline seconds to pixel width/offset.
 */
export function timeToPixels(time: number, zoom: number): number {
  return Math.max(0, time) * zoom;
}

/**
 * Converts pixel coordinates strictly within the media-lane area to timeline seconds.
 * Fixed track-header width NEVER enters this calculation.
 * 
 * @param clientX The pointer/mouse clientX
 * @param zoom Timeline zoom level in px/sec
 * @param scrollLeft The scrollLeft of the media-lane viewport
 * @param mediaLaneBoundingLeft The getBoundingClientRect().left of the media-lane container
 */
export function pixelsToTime(
  clientX: number,
  zoom: number,
  scrollLeft: number,
  mediaLaneBoundingLeft: number
): number {
  const relativeX = clientX - mediaLaneBoundingLeft + scrollLeft;
  return Math.max(0, relativeX / Math.max(1, zoom));
}

/**
 * Snaps time to grid interval (default 0.25s).
 * Shift key temporarily disables snapping.
 */
export function snapTimeToGrid(
  time: number,
  snapEnabled: boolean = true,
  shiftKeyHeld: boolean = false,
  interval: number = DEFAULT_SNAP_INTERVAL
): number {
  if (!snapEnabled || shiftKeyHeld) {
    return Math.max(0, parseFloat(time.toFixed(2)));
  }
  const factor = 1 / interval; // 4 for 0.25s
  const snapped = Math.round(time * factor) / factor;
  return Math.max(0, parseFloat(snapped.toFixed(2)));
}
