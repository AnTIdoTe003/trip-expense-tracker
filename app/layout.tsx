import type React from "react"
import type { Metadata } from "next"
import { Poppins, Manrope } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Trip Expense Manager - Split Travel Costs Easily | Free Group Expense Tracker",
  description: "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly. Free expense splitting app for friends and family trips.",
  keywords: "trip expense manager, travel expense tracker, group expense splitter, shared expense app, travel cost calculator, expense sharing app, trip budget tracker, group travel expenses",
  authors: [{ name: "Trip Expense Manager" }],
  creator: "Trip Expense Manager",
  publisher: "Trip Expense Manager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Trip Expense Manager - Split Travel Costs Easily",
    description: "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly.",
    url: '/',
    siteName: 'Trip Expense Manager',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trip Expense Manager - Split Travel Costs Easily',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Trip Expense Manager - Split Travel Costs Easily",
    description: "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Trip Expense Manager",
              "description": "Best trip expense manager for groups. Split travel costs, track shared expenses, and manage group finances effortlessly.",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.vercel.app',
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Split travel expenses",
                "Track group expenses",
                "Manage trip budgets",
                "Share expense reports",
                "Real-time expense tracking"
              ]
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
