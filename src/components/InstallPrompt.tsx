import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show after 2nd session
    const sessions = parseInt(localStorage.getItem("positivossauro-sessions") || "0", 10);
    localStorage.setItem("positivossauro-sessions", String(sessions + 1));
    if (sessions < 1) return; // don't show on first visit

    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[90] -translate-x-1/2"
      style={{ animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
    >
      <div
        className="bg-card border-[3px] border-posi-green rounded-2xl px-5 py-3 flex items-center gap-3"
        style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
      >
        <span className="text-2xl">🦕</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-secondary-foreground">
            adicione na tela inicial!
          </span>
          <span className="text-xs text-muted-foreground">
            jogue sem abrir o navegador
          </span>
        </div>
        <button
          onClick={handleInstall}
          className="bg-posi-green text-primary-foreground border-none px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all active:translate-y-0.5 lowercase ml-2"
        >
          instalar
        </button>
        <button
          onClick={() => setShow(false)}
          className="text-muted-foreground text-lg cursor-pointer bg-transparent border-none ml-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
