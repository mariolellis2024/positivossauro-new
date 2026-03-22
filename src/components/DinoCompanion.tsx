import { useEffect, useState } from "react";
import dinoImg from "@/assets/dino-companion.png";

const IDLE_MESSAGES = [
  "você consegue!",
  "respira fundo...",
  "um passo de cada vez.",
  "tudo no seu tempo.",
  "estou aqui com você!",
  "vai dar tudo certo.",
];

function getContextMessage(found: number, total: number): string | null {
  if (total === 0) return null;
  const ratio = found / total;
  if (found === 0) return null; // let idle messages play
  if (ratio < 0.5) return "bom começo! continua assim.";
  if (ratio < 0.85) return "olha só, já achou mais da metade!";
  if (found === total - 1) return "só falta uma! você tá quase lá!";
  return null;
}

interface Props {
  wordsFound?: number;
  totalWords?: number;
}

export default function DinoCompanion({ wordsFound = 0, totalWords = 0 }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  // Show contextual message when words are found
  useEffect(() => {
    if (wordsFound === 0) return;
    const ctx = getContextMessage(wordsFound, totalWords);
    if (ctx) {
      setMessage(ctx);
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [wordsFound, totalWords]);

  // Idle random messages when no progress is being made
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const showMessage = () => {
      const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
      setMessage(msg);
      setTimeout(() => {
        setMessage(null);
        scheduleNext();
      }, 4000);
    };

    const scheduleNext = () => {
      const delay = Math.random() * 5000 + 10000;
      timeout = setTimeout(showMessage, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex flex-col items-center mt-5 pointer-events-none w-[140px]">
      {message && (
        <div
          className="absolute bg-card border-[3px] border-foreground px-4 py-2 text-center font-bold text-secondary-foreground max-w-[150px] z-10"
          style={{
            borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
            boxShadow: "2px 4px 0px rgba(0,0,0,0.1)",
            animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            transformOrigin: "bottom right",
            top: "-10px",
            right: "110%",
            fontSize: "0.8rem",
          }}
        >
          {message}
          {/* Triangle pointing right */}
          <span
            className="absolute block w-0 h-0"
            style={{
              bottom: "12px",
              right: "-10px",
              borderWidth: "8px 0 8px 10px",
              borderStyle: "solid",
              borderColor: "transparent transparent transparent hsl(var(--foreground))",
            }}
          />
          <span
            className="absolute block w-0 h-0 z-10"
            style={{
              bottom: "14px",
              right: "-6px",
              borderWidth: "6px 0 6px 8px",
              borderStyle: "solid",
              borderColor: "transparent transparent transparent hsl(var(--card))",
            }}
          />
        </div>
      )}
      <img
        src={dinoImg}
        alt="Positivossauro Companheiro"
        className="w-full drop-shadow-md"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
    </div>
  );
}

