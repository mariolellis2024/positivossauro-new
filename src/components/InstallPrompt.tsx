import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallMode = "native" | "ios" | "macos-safari" | null;

function detectInstallMode(): InstallMode {
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
      className="w-full max-w-[350px] mx-auto mb-5"
      style={{
        animation:
          "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      }}
    >
      <div
        className="bg-card border-[3px] border-posi-green rounded-2xl px-4 py-4 flex flex-col gap-3"
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
      >
        {/* Top row: icon + text + close */}
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0">🦕</span>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-secondary-foreground leading-tight">
              adicione na tela inicial!
            </span>
            <span className="text-xs text-muted-foreground leading-snug">
              {mode === "ios" ? (
                <>
                  toque em{" "}
                  <strong>⬆️ compartilhar</strong>{" "}
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
          <button
            onClick={dismiss}
            className="text-muted-foreground text-base cursor-pointer bg-transparent border-none shrink-0 leading-none"
          >
            ✕
          </button>
        </div>

        {/* Install button — always visible */}
        {mode === "native" ? (
          <button
            onClick={handleInstall}
            className="bg-posi-green text-primary-foreground border-none px-4 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all active:translate-y-0.5 lowercase w-full"
          >
            📲 instalar aplicativo
          </button>
        ) : mode === "ios" ? (
          <button
            onClick={() => {
              // Can't programmatically open share sheet on iOS, but we can
              // highlight the instructions visually
              alert(
                "1️⃣ Toque no ícone ⬆️ (Compartilhar) na barra do Safari\n\n2️⃣ Role para baixo e toque em \"Adicionar à Tela Inicial\"\n\n3️⃣ Toque em \"Adicionar\""
              );
            }}
            className="bg-posi-green text-primary-foreground border-none px-4 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all active:translate-y-0.5 lowercase w-full"
          >
            📲 ver como instalar
          </button>
        ) : mode === "macos-safari" ? (
          <button
            onClick={() => {
              alert(
                "1️⃣ No menu do Safari, clique em \"Arquivo\"\n\n2️⃣ Clique em \"Adicionar ao Dock\""
              );
            }}
            className="bg-posi-green text-primary-foreground border-none px-4 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all active:translate-y-0.5 lowercase w-full"
          >
            📲 ver como instalar
          </button>
        ) : null}
      </div>
    </div>
  );
}
