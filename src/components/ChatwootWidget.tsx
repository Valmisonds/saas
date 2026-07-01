"use client";

import Script from "next/script";

/**
 * Embeds the Chatwoot widget (with the Captain AI agent enabled on the Chatwoot side)
 * so a first line of support runs without a human. No-op if env vars aren't set yet.
 */
export function ChatwootWidget() {
  const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
  const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

  if (!baseUrl || !websiteToken) return null;

  return (
    <Script id="chatwoot-sdk" strategy="afterInteractive">
      {`
        (function (d, t) {
          var BASE_URL = "${baseUrl}";
          var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
          g.src = BASE_URL + "/packs/js/sdk.js";
          g.defer = true;
          g.async = true;
          s.parentNode.insertBefore(g, s);
          g.onload = function () {
            window.chatwootSDK.run({
              websiteToken: "${websiteToken}",
              baseUrl: BASE_URL,
            });
          };
        })(document, "script");
      `}
    </Script>
  );
}
