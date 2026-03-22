/**
 * Sharing utilities: emoji grid, share text, challenge URLs.
 */

/**
 * Generate a Wordle-style emoji grid showing the result.
 * 🟩 = found word, 💡 = used hint, ⬜ = pending (shouldn't happen if completed)
 */
export function generateEmojiGrid(
  totalWords: number,
  hintsUsed: number
): string {
  const found = totalWords - hintsUsed;
  const emojis: string[] = [];
  for (let i = 0; i < totalWords; i++) {
    if (i < found) emojis.push("🟩");
    else emojis.push("💡");
  }
  return emojis.join("");
}

/**
 * Generate the full share text.
 */
export function generateShareText(opts: {
  collectionIndex: number;
  totalWords: number;
  hintsUsed: number;
  timeMs: number;
  streak: number;
}): string {
  const { collectionIndex, totalWords, hintsUsed, timeMs, streak } = opts;
  const mins = Math.floor(timeMs / 60000);
  const secs = Math.floor((timeMs % 60000) / 1000);
  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;

  const grid = generateEmojiGrid(totalWords, hintsUsed);
  const streakLine = streak > 1 ? `\n🔥 ${streak} dias seguidos` : "";

  return [
    `🦕 positivossauro · coleção ${collectionIndex + 1}`,
    `⏱️ ${timeStr} · ${hintsUsed === 0 ? "sem dicas!" : `${hintsUsed} dica${hintsUsed > 1 ? "s" : ""}`}`,
    grid,
    streakLine,
    "",
    "jogue também: positivossauro.com",
  ].filter(Boolean).join("\n");
}

/**
 * Share using Web Share API or fallback to clipboard.
 */
export async function shareResult(text: string): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      // User cancelled — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

/**
 * Open WhatsApp with pre-filled share text.
 */
export function shareViaWhatsApp(text: string): void {
  const encoded = encodeURIComponent(text);
  window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
}

/**
 * Format milliseconds as "M:SS" or "Ss".
 */
export function formatTime(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins > 0) return `${mins}:${secs.toString().padStart(2, "0")}`;
  return `${secs}s`;
}
