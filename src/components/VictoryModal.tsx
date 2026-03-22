import victoryImg1 from "@/assets/victory-level-1.png";
import victoryImg2 from "@/assets/victory-level-2.png";
import victoryImg from "@/assets/dino-victory.png";
import { COLLECTION_PHRASES } from "@/lib/phrases";
import { formatTime, generateShareText, shareViaWhatsApp } from "@/lib/shareUtils";

const VICTORY_IMAGES = [victoryImg1, victoryImg2, victoryImg];

interface Props {
  visible: boolean;
  onRestart: () => void;
  buttonLabel?: string;
  level?: number;
  elapsedMs?: number;
  hintsUsed?: number;
  streak?: number;
  totalWords?: number;
}

export default function VictoryModal({
  visible,
  onRestart,
  buttonLabel = "jogar novamente",
  level = 0,
  elapsedMs = 0,
  hintsUsed = 0,
  streak = 0,
  totalWords = 7,
}: Props) {
  if (!visible) return null;

  const img = VICTORY_IMAGES[level % VICTORY_IMAGES.length];
  const phrase = COLLECTION_PHRASES[level] ?? "";

  const handleWhatsAppShare = () => {
    const text = generateShareText({
      collectionIndex: level,
      totalWords,
      hintsUsed,
      timeMs: elapsedMs,
      streak,
    });
    shareViaWhatsApp(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "hsla(var(--background) / 0.9)",
        backdropFilter: "blur(3px)",
        animation: "fadeIn 0.4s ease-out forwards",
      }}
    >
      <div
        className="bg-card p-10 rounded-[20px] text-center max-w-[90%] w-[400px] border-4 border-posi-green"
        style={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      >
        <img
          src={img}
          alt="Positivossauro"
          className="max-w-full h-auto rounded-lg mb-5"
        />
        <h2 className="text-secondary-foreground text-2xl font-bold mb-3">
          olha você. encontrou tudo.
        </h2>

        {/* Stats */}
        <div className="flex justify-center gap-3 mb-3">
          <span className="bg-posi-green/15 rounded-full px-3 py-1 text-sm font-bold text-secondary-foreground">
            ⏱️ {formatTime(elapsedMs)}
          </span>
          <span className="bg-posi-sun/30 rounded-full px-3 py-1 text-sm font-bold text-secondary-foreground">
            {hintsUsed === 0 ? "🧠 sem dicas" : `💡 ${hintsUsed} dica${hintsUsed > 1 ? "s" : ""}`}
          </span>
        </div>

        <p className="text-base leading-relaxed mb-1 text-muted-foreground">
          essas palavras sempre estiveram em você.
        </p>
        {phrase && (
          <p className="text-sm italic text-secondary-foreground mb-5 leading-relaxed">
            "{phrase}"
          </p>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="bg-posi-green text-primary-foreground border-none px-6 py-3 text-lg rounded-full cursor-pointer font-bold transition-all active:translate-y-1 lowercase w-full"
            style={{ boxShadow: "0 4px 0 hsl(var(--posi-green-dark))" }}
          >
            {buttonLabel}
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] text-white border-none px-6 py-2.5 text-sm rounded-full cursor-pointer font-bold transition-all active:translate-y-0.5 lowercase w-full"
            style={{ boxShadow: "0 3px 0 #1da851" }}
          >
            📱 compartilhar com um amigo
          </button>
        </div>
      </div>
    </div>
  );
}

