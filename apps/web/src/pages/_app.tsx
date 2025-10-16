import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    try {
      // Find the top navbar (matches your live HTML: aria-label="Primary")
      const nav = document.querySelector('nav[aria-label="Primary"]') as HTMLElement | null;
      if (!nav) return;

      // Avoid duplicates
      if (nav.querySelector('a[href="https://uif.scend.co.za/uif"]')) return;

      // Build UIF anchor styled like your live navbar links
      const a = document.createElement("a");
      a.href = "https://uif.scend.co.za/uif";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "UIF Tool";
      a.style.color = "#ec4899";
      a.style.textDecoration = "none";
      a.style.fontWeight = "500";

      // Space the link like siblings
      a.style.marginLeft = "0px"; // nav uses gap via flex; margin is optional

      // Insert before the last existing item (just before Price-Compare Tool)
      if (nav.lastElementChild) {
        nav.insertBefore(a, nav.lastElementChild);
      } else {
        nav.appendChild(a);
      }
    } catch (e) {
      // no-op: keep the app resilient
      console.warn("UIF nav inject failed:", e);
    }
  }, []);

  return <Component {...pageProps} />;
}