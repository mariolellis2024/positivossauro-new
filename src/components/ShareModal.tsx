import { useState } from "react";
import { generateShareText, shareResult, formatTime } from "@/lib/shareUtils";
import { COLLECTION_PHRASES } from "@/lib/phrases";

interface Props {
  visible: boolean;
  onClose: () => void;
  collectionIndex: number;
  totalWords: number;
  hintsUsed: number;
  timeMs: number;
  streak: number;
}

export default function ShareModal({
  visible,
  onClose,
  collectionIndex,
  totalWords,
  hintsUsed,
  timeMs,
  streak,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const phrase = COLLECTION_PHRASES[collectionIndex] ?? "";
  const timeStr = formatTime(timeMs);

  const handleShare = async () => {
    const text = generateShareText({
      collectionIndex,
      totalWords,
      hintsUsed,
      timeMs,
      streak,
    });
    const result = await shareResult(text);
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        backgroundColor: "hsla(var(--background) / 0.92)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.3s ease-out forwards",
      }}
    >
      <div
        className="bg-card p-8 rounded-[20px] text-center max-w-[90%] w-[380px] border-4 border-posi-green relative"
        style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-muted-foreground hover:text-secondary-foreground text-xl cursor-pointer bg-transparent border-none font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-secondary-foreground mb-2">
          🦕 compartilhe seu resultado!
        </h2>

        {/* Stats */}
        <div className="flex justify-center gap-4 my-4">
          <div className="bg-posi-green/15 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-secondary-foreground">⏱️ {timeStr}</p>
            <p className="text-xs text-muted-foreground">tempo</p>
          </div>
          <div className="bg-posi-sun/30 rounded-xl px-4 py-2">
            <p className="text-lg font-bold text-secondary-foreground">
              {hintsUsed === 0 ? "🧠" : `💡 ${hintsUsed}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {hintsUsed === 0 ? "sem dicas" : `dica${hintsUsed > 1 ? "s" : ""}`}
            </p>
          </div>
          {streak > 1 && (
            <div className="bg-posi-sky/20 rounded-xl px-4 py-2">
              <p className="text-lg font-bold text-secondary-foreground">🔥 {streak}</p>
              <p className="text-xs text-muted-foreground">dias</p>
            </div>
          )}
        </div>

        {/* Phrase */}
        {phrase && (
          <p className="text-sm italic text-muted-foreground mb-5 leading-relaxed">
            "{phrase}"
          </p>
        )}

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full bg-posi-green text-primary-foreground border-none px-6 py-3 text-base rounded-full cursor-pointer font-bold transition-all active:translate-y-1 lowercase mb-2"
          style={{ boxShadow: "0 4px 0 hsl(var(--posi-green-dark))" }}
        >
          {copied ? "✅ copiado!" : "📤 compartilhar resultado"}
        </button>

        <p className="text-xs text-muted-foreground mt-1">
          envia pro whatsapp, stories, ou onde quiser!
        </p>
      </div>
    </div>
  );
}
