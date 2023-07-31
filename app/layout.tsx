import Footer from '@/components/footer'
import Header from '@/components/header'
import { AnalyticsWrapper } from './analytics'
import { baseUrl } from './config'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
// import type { Metadata } from 'next/types'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <div className="container mx-auto flex-1 px-4 py-16">{children}</div>
          <Footer />
        </ThemeProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  )
}

export const metadata = {
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
  themeColor: '#3982C2',
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
