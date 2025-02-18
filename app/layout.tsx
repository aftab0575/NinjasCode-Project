import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Import Google Maps API
import "./globals.css";
import { MapProvider } from "@/app/context/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Restaurant Finder",
  description: "Find restaurants near you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.gomaps.pro/maps/api/js?key=AlzaSyq9BodU615ofNFxVQdJqthKOQtgVfJPVCF`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <MapProvider>
          {children}
        </MapProvider>
      </body>
    </html>
  );
}
