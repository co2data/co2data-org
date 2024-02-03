import Footer from '@/components/footer'
import Header from '@/components/header'
import { AnalyticsWrapper } from './analytics'
import { baseUrl } from './config'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="container flex-1 pb-16 pt-4">{children}</div>
          <Footer />
        </ThemeProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  themeColor: '#3982C2',
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'co2data.org',
    template: '%s | co2data.org',
  },
  description: 'What are the CO₂ emissions of things.',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3982C2',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'co2data.org',
    description: 'What are the CO₂ emissions of things.',
    url: '/',
    siteName: 'CO₂ Data',
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: `/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
}
