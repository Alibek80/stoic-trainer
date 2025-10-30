import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Stoic Trainer",
  description: "Ежедневные практики стоицизма для развития внутренней устойчивости",
  keywords: ["стоицизм", "медитация", "рефлексия", "саморазвитие", "философия"],
  authors: [{ name: "Stoic Trainer Team" }],
  openGraph: {
    title: "Stoic Trainer",
    description: "Ежедневные практики стоицизма",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FDFBF7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-dvh bg-[#F9FAFB] text-[#111827] antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
