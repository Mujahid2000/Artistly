import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/compomnents/header"
import { PageTransition } from "@/compomnents/motion/page-transition"
import { Footer } from "@/compomnents/footer"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Artistly - Find and Book Top Artists",
    template: "%s | Artistly",
  },
  description:
    "Connect with talented performers in your area. From singers and dancers to DJs and comedians, discover the perfect artist to make your event unforgettable.",
  keywords: [
    "artists",
    "booking",
    "events",
    "performers",
    "entertainment",
    "musicians",
    "singers",
    "dancers",
    "DJs",
    "comedians",
  ],
  authors: [{ name: "Artistly Team" }],
  creator: "Artistly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://artistly.com",
    title: "Artistly - Find and Book Top Artists",
    description: "Connect with talented performers in your area. Book artists for your next event.",
    siteName: "Artistly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artistly - Find and Book Top Artists",
    description: "Connect with talented performers in your area. Book artists for your next event.",
    creator: "@artistly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <PageTransition>
          <main className="min-h-screen">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
