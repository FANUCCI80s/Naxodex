
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "NAXODEX",
  description: "NAXODEX trading and investment platform",
  icons: {
    icon: "/branding/coin_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

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
                s1.src = "https://embed.tawk.to/6a7a94b545989d1d4159b0df/1jvnd9q3c";
                s1.charset = "UTF-8";
                s1.setAttribute("crossorigin", "*");

                s0.parentNode.insertBefore(s1, s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}