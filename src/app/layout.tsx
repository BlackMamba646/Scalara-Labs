import type { Metadata, Viewport } from "next";
import "./globals.css";
import ScalaraChatWrapper from "./components/scalara-chat/ScalaraChatWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Scalara Labs",
  description:
    "Senior Software Engineers. Startup Speed. Enterprise Quality.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <ScalaraChatWrapper />
      </body>
    </html>
  );
}

