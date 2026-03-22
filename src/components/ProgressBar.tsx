import { GameProgress } from "@/lib/storage";

interface Props {
  progress: GameProgress;
  totalCollections: number;
}

export default function ProgressBar({ progress, totalCollections }: Props) {
  const completed = progress.completedCollections.length;
  const pct = Math.round((completed / totalCollections) * 100);

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-secondary-foreground">
          {completed} de {totalCollections} coleções
        </span>
        {progress.streak.count > 1 && (
          <span className="text-xs font-bold text-secondary-foreground">
            🔥 {progress.streak.count} dias seguidos
          </span>
        )}
      </div>
      <div
        className="w-full h-3 rounded-full bg-muted overflow-hidden border border-border"
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, hsl(var(--posi-green)), hsl(var(--posi-sky)))",
            minWidth: completed > 0 ? "8px" : "0",
          }}
        />
      </div>
    </div>
  );
}
