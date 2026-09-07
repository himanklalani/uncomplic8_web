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
  title: "Uncomplic8 Tech | Custom Web Development, Technical SEO & Automation",
  description: "We build bespoke websites and business automation tools in React and Next.js. Fast loading, clean source code, and full project handover.",
  keywords: ["Web Design", "Technical SEO", "WhatsApp Automation", "Next.js Development", "Custom Web Apps"],
  openGraph: {
    type: "website",
    title: "Uncomplic8 Tech | Web Development & Automation",
    description: "Bespoke websites, technical SEO, and WhatsApp integrations built with React and Next.js.",
    url: "https://uncomplic8.tech", // Placeholder URL
    siteName: "Uncomplic8 Tech",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uncomplic8 Tech",
    description: "Custom websites, technical SEO, and business automation.",
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
              "description": "Custom web development, technical SEO, and business automation studio.",
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
