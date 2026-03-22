import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
    if (consent === "accepted" && window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
    if (window.gtag) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-card z-[2000] flex flex-wrap justify-center items-center gap-4 px-5 py-4 border-t-[3px] border-foreground"
      style={{ boxShadow: "0px -4px 10px rgba(0,0,0,0.1)" }}
    >
      <p className="text-center text-[0.95rem] max-w-[600px] text-secondary-foreground">
        pra entender como você joga e melhorar o caça-palavras, usamos alguns cookies de estatísticas. tudo bem por você? 🍪
      </p>
      <div className="flex gap-2.5">
        <button
          onClick={accept}
          className="bg-posi-green text-primary-foreground border-none px-4 py-2 rounded-full font-bold cursor-pointer text-sm lowercase"
          style={{ boxShadow: "0 3px 0 hsl(var(--posi-green-dark))" }}
        >
          tá bom!
        </button>
        <button
          onClick={decline}
          className="bg-background text-secondary-foreground border-2 border-foreground px-4 py-2 rounded-full font-bold cursor-pointer text-sm lowercase"
        >
          agora não
        </button>
      </div>
    </div>
  );
}
