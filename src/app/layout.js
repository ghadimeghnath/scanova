import Footer from "@/components/scanova/Footer";
import "./globals.css";

export const metadata = {
  title: "AR Keychain",
  description: "Custom AR Keychain Experience",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#080808]">
        {children}
        <Footer />
      </body>
    </html>
  );
}