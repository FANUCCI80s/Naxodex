"use client";

import Script from "next/script";

export default function TawkTo() {
return (
<Script
id="tawk-to"
strategy="afterInteractive"
dangerouslySetInnerHTML={{
__html: `
var Tawk_API = Tawk_API || {};
var Tawk_LoadStart = new Date();


      (function () {
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];

        s1.async = true;
        s1.src = "https://embed.tawk.to/a3891c478eec63f6b1446bebd3d0acde3de5633b";
        s1.charset = "UTF-8";
        s1.setAttribute("crossorigin", "*");

        s0.parentNode.insertBefore(s1, s0);
      })();
    `,
  }}
/>


);
}
