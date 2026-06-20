import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Uncomplic8 Tech | High-Performance Web Design, SEO & Automation",
  description: "Specializing in building high-performance, visually stunning web applications with React, Next.js, SEO, and WhatsApp Automation.",
  keywords: ["Web Design Agency", "SEO Optimization", "WhatsApp Automation", "Next.js Development", "Clinic Web Design"],
  openGraph: {
    type: "website",
    title: "Uncomplic8 Tech | Web Developer, Designer & SEO Specialist",
    description: "Specializing in building high-performance, visually stunning web applications with React, Next.js, Node.js, and TypeScript.",
    url: "https://uncomplic8.tech", // Placeholder URL
    siteName: "Uncomplic8 Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uncomplic8 Tech",
    description: "High-Performance Web Design, SEO & Automation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${instrumentSerif.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Uncomplic8 Tech",
              "description": "High-Performance Web Design, SEO & Automation Agency.",
              "url": "https://uncomplic8.tech",
              "sameAs": [],
              "areaServed": "Global",
              "knowsAbout": ["Web Design", "SEO", "WhatsApp Business API", "Next.js", "React"]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-accent/30 selection:text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
