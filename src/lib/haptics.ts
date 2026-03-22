/**
 * Haptic feedback for mobile devices.
 * Uses navigator.vibrate with graceful fallback.
 */

function canVibrate(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

/** Light tap — word found */
export function vibrateLight(): void {
  if (canVibrate()) navigator.vibrate(40);
}

/** Success pattern — collection complete */
export function vibrateSuccess(): void {
  if (canVibrate()) navigator.vibrate([80, 50, 80]);
}
