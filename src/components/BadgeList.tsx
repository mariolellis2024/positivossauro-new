import { useState } from "react";
import { GameProgress, BADGE_DEFINITIONS } from "@/lib/storage";

interface Props {
  progress: GameProgress;
}

export default function BadgeList({ progress }: Props) {
  const [open, setOpen] = useState(false);

  const unlockedCount = progress.badges.length;
  const totalCount = BADGE_DEFINITIONS.length;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-bold text-muted-foreground hover:text-secondary-foreground transition-colors cursor-pointer lowercase"
      >
        🏆 conquistas ({unlockedCount}/{totalCount})
      </button>
    );
  }

  return (
    <div className="mt-2 w-full">
      <button
        onClick={() => setOpen(false)}
        className="text-xs font-bold text-muted-foreground hover:text-secondary-foreground transition-colors cursor-pointer lowercase mb-2"
      >
        🏆 conquistas ({unlockedCount}/{totalCount}) ▲
      </button>
      <div className="grid grid-cols-2 gap-1.5">
        {BADGE_DEFINITIONS.map((badge) => {
          const unlocked = progress.badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-all ${
                unlocked
                  ? "bg-posi-sun/30 text-secondary-foreground"
                  : "bg-muted/50 text-muted-foreground opacity-50"
              }`}
            >
              <span className="text-base">{unlocked ? badge.emoji : "🔒"}</span>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">{badge.label}</span>
                <span className="text-[10px] leading-tight opacity-75">{badge.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
