import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
  rotation: number;
  rotationSpeed: number;
}

const COLORS = [
  "hsl(var(--posi-green))",
  "hsl(var(--posi-sun))",
  "hsl(var(--posi-sky))",
  "#ff6b9d",
  "#c084fc",
  "#fbbf24",
];

interface Props {
  active: boolean;
  intensity?: "light" | "heavy";
}

let particleId = 0;

export default function Confetti({ active, intensity = "light" }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) return;

    const count = intensity === "heavy" ? 40 : 12;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: ++particleId,
        x: 50 + (Math.random() - 0.5) * 30,
        y: 40 + (Math.random() - 0.5) * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * 360,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(timer);
  }, [active, intensity]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: "2px",
            animation: `confetti-fall 1.4s ease-out forwards`,
            transform: `rotate(${p.rotation}deg)`,
            ["--confetti-angle" as string]: `${p.angle}deg`,
            ["--confetti-speed" as string]: `${p.speed}`,
            ["--confetti-rot" as string]: `${p.rotationSpeed * 50}deg`,
          }}
        />
      ))}
    </div>
  );
}
