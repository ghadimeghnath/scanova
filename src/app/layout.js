// This is the root layout for the entire application. It sets up the HTML structure and includes global styles.

import "./globals.css";

export const metadata = {
  title: "AR Keychain",
  description: "Custom AR Keychain Experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ width: "100%", height: "100%" }}>
      <head>
        {/* Critical for WebXR on Android Chrome */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className="antialiased"
        style={{ width: "100%", height: "100%", margin: 0, padding: 0, overflow: "hidden" }}
      >
        {children}
      </body>
    </html>
  );
}