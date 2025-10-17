import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      const nav = document.querySelector('nav[aria-label="Primary"]');
      if (!nav) return;

      // Skip if UIF Tool already present
      if (nav.querySelector('a[href="https://uif.scend.co.za/uif"]')) return;

      const a = document.createElement("a");
      a.href = "https://uif.scend.co.za/uif";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "UIF Tool";
      a.dataset.injectedBy = "uif-shim";
      a.style.color = "#ec4899";
      a.style.textDecoration = "none";
      a.style.fontWeight = "500";

      // Insert before the last link
      if (nav.lastElementChild) nav.insertBefore(a, nav.lastElementChild);
      else nav.appendChild(a);
    } catch (e) {
      console.warn("UIF nav inject failed:", e);
    }
  }, []);

  return <Component {...pageProps} />;
}