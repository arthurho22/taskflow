"use client";
import { useEffect } from "react";

export default function VLibrasWidget() {
  useEffect(() => {
    // Remove qualquer script anterior duplicado
    const existingScript = document.querySelector(
      'script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]'
    );
    if (existingScript) existingScript.remove();

    // Cria o script novamente
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ VLibras carregado com sucesso!");
      // Garante que o widget é inicializado
      const VLibras = (window as any).VLibras;
      if (VLibras && typeof VLibras.Widget === "function") {
        new VLibras.Widget("https://vlibras.gov.br/app");

        // Força o botão a aparecer
        const interval = setInterval(() => {
          const button = document.querySelector("[vw-access-button]");
          if (button) {
            (button as HTMLElement).style.zIndex = "999999";
            (button as HTMLElement).style.position = "fixed";
            (button as HTMLElement).style.bottom = "20px";
            (button as HTMLElement).style.right = "20px";
            (button as HTMLElement).style.display = "block";
            clearInterval(interval);
          }
        }, 1000);
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="vlibras-container"
      dangerouslySetInnerHTML={{
        __html: `
          <div vw class="vw-plugin-wrapper" style="z-index:999999;">
            <div vw-access-button class="active"></div>
            <div vw-plugin-wrapper></div>
          </div>
        `,
      }}
    />
  );
}
