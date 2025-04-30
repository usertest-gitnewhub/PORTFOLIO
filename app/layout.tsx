import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import type React from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-sans",
})

// Add the manifest metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://codemuse.com"),
  title: {
    default: "Code Muse - Your Intelligent Coding Companion",
    template: "%s | Code Muse",
  },
  description:
    "Generate, debug, and learn code with Code Muse - the ultimate AI-powered tool for developers and students",
  keywords:
    "code generation, AI coding, database schema, DSA solver, programming, software development, vector databases, MATLAB code generator",
  authors: [{ name: "Code Muse Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codemuse.com",
    siteName: "Code Muse",
    title: "Code Muse - Your Intelligent Coding Companion",
    description:
      "Generate, debug, and learn code with Code Muse - the ultimate AI-powered tool for developers and students",
    images: [
      {
        url: "https://codemuse.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Code Muse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Muse - Your Intelligent Coding Companion",
    description:
      "Generate, debug, and learn code with Code Muse - the ultimate AI-powered tool for developers and students",
    images: ["https://codemuse.com/twitter-image.jpg"],
    creator: "@codemuse",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://codemuse.com",
    languages: {
      "en-US": "https://codemuse.com/en-US",
    },
  },
  verification: {
    google: "verification_token",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  applicationName: "Code Muse",
  generator: "Next.js",
  category: "technology",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#000000",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Force light theme for PDF generation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const mode = localStorage.getItem('theme');
                if (mode === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (mode === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (e) {}
            })();
          `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground flex flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
