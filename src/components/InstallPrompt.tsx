import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallMode = "native" | "ios" | "macos-safari" | null;

function detectInstallMode(): InstallMode {
  // Already installed as standalone — don't show anything
  if (window.matchMedia("(display-mode: standalone)").matches) return null;
  // @ts-expect-error — Safari-specific property
  if (navigator.standalone === true) return null;

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isMacSafari =
    /Macintosh/.test(ua) &&
    /Safari/.test(ua) &&
    !/Chrome/.test(ua) &&
    !/Chromium/.test(ua);

  if (isIOS) return "ios";
  if (isMacSafari) return "macos-safari";

  // Chrome, Edge, Samsung Internet, Opera etc. support beforeinstallprompt
  return "native";
}


export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<InstallMode>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {

    const detected = detectInstallMode();
    setMode(detected);

    if (detected === "ios" || detected === "macos-safari") {
      // Show manual instructions after a short delay
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }

    if (detected === "native") {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
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

  const dismiss = () => setShow(false);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[90] -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm"
      style={{
        animation:
          "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      }}
    >
      <div
        className="bg-card border-[3px] border-posi-green rounded-2xl px-5 py-3 flex items-center gap-3"
        style={{ boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}
      >
        <span className="text-2xl shrink-0">🦕</span>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-bold text-secondary-foreground">
            adicione na tela inicial!
          </span>
          <span className="text-xs text-muted-foreground leading-snug">
            {mode === "ios" ? (
              <>
                toque em{" "}
                <strong className="inline-flex items-center">
                  ⬆️ compartilhar
                </strong>{" "}
                e depois em <strong>"adicionar à tela inicial"</strong>
              </>
            ) : mode === "macos-safari" ? (
              <>
                vá em <strong>arquivo → adicionar ao dock</strong>
              </>
            ) : (
              "jogue sem abrir o navegador"
            )}
          </span>
        </div>
        {mode === "native" && (
          <button
            onClick={handleInstall}
            className="bg-posi-green text-primary-foreground border-none px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all active:translate-y-0.5 lowercase shrink-0"
          >
            instalar
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-muted-foreground text-lg cursor-pointer bg-transparent border-none ml-1 shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
