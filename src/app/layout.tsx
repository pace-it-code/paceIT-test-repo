
"use client"
import "./globals.css";
import { useEffect } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: true },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar />
        <Providers>
          {/* Google Translate Dropdown (Hidden) */}
          <div id="google_translate_element" style={{ display: "none" }}></div>

          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
