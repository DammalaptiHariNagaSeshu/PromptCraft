import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptCraft — Master the Art of AI Prompting",
  description:
    "Transform your ideas into perfectly engineered AI prompts. Generate, refine, and compare prompt variations powered by Google Gemini.",
  keywords: ["AI prompts", "prompt engineering", "Gemini", "AI tools", "prompt generator"],
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "preconnect": "http://localhost:3001"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  color: "#fff",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
