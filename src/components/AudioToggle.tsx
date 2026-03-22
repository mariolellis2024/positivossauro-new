import { useRef, useState, useEffect } from "react";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      const start = () => {
        setStarted(true);
        document.removeEventListener("click", start);
        document.removeEventListener("touchstart", start);
      };
      document.addEventListener("click", start, { once: true });
      document.addEventListener("touchstart", start, { once: true });
    }
  }, [started]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music.mp3" />
      <button
        onClick={toggle}
        aria-label="Música de Fundo"
        className="fixed top-5 right-5 z-50 bg-card border-[3px] border-foreground rounded-[20px] px-3 py-2 text-base font-bold text-secondary-foreground cursor-pointer lowercase transition-transform active:translate-y-0.5"
        style={{ boxShadow: "2px 4px 0px rgba(0,0,0,0.1)" }}
      >
        música: {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}
