import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* UIF injector (safe + idempotent) */}
          <script
            dangerouslySetInnerHTML={{
              __html: \(function () {
                function insert() {
                  try {
                    var nav = document.querySelector('nav[aria-label="Primary"]');
                    if (!nav) return false;

                    if (nav.querySelector('a[href="https://uif.scend.co.za/uif"]')) return true;

                    var a = document.createElement("a");
                    a.href = "https://uif.scend.co.za/uif";
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    a.textContent = "UIF Tool";
                    a.setAttribute("data-injected-by", "uif-document-shim");
                    a.style.color = "#ec4899";
                    a.style.textDecoration = "none";
                    a.style.fontWeight = "500";

                    // place before last item (just before Price-Compare Tool)
                    if (nav.lastElementChild) nav.insertBefore(a, nav.lastElementChild);
                    else nav.appendChild(a);

                    return true;
                  } catch (_) { return false; }
                }

                // try immediately, on DOM ready, and via observer + retry loop
                if (!insert()) {
                  if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", insert, { once: true });
                  } else {
                    insert();
                  }
                  var tries = 0;
                  var iv = setInterval(function(){
                    if (insert() || ++tries > 40) clearInterval(iv); // up to ~4s
                  }, 100);

                  var mo = new MutationObserver(function() { insert(); });
                  var root = document.getElementById("__next") || document.body;
                  if (root) mo.observe(root, { childList: true, subtree: true });
                  setTimeout(function(){ try { mo.disconnect(); } catch(e){} }, 5000);
                }
              })();\,
            }}
          />
        </body>
      </Html>
    );
  }
}