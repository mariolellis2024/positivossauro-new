import { useEffect, useState } from "react";
import { WORD_MEANINGS } from "@/lib/phrases";

interface Props {
  word: string | null;
}

export default function WordTooltip({ word }: Props) {
  const [visible, setVisible] = useState(false);
  const [displayWord, setDisplayWord] = useState<string | null>(null);

  useEffect(() => {
    if (word) {
      setDisplayWord(word);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [word]);

  if (!visible || !displayWord) return null;

  const meaning = WORD_MEANINGS[displayWord];
  if (!meaning) return null;

  return (
    <div
      className="fixed top-1/2 left-1/2 z-[100] pointer-events-none"
      style={{
        transform: "translate(-50%, -50%)",
        animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      }}
    >
      <div
        className="bg-card border-[3px] border-foreground px-6 py-4 text-center max-w-[280px]"
        style={{
          borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
          boxShadow: "4px 6px 0px rgba(0,0,0,0.1)",
        }}
      >
        <p className="text-base font-bold text-secondary-foreground mb-1 lowercase">
          {displayWord.toLowerCase()}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed lowercase">
          {meaning}
        </p>
      </div>
    </div>
  );
}
