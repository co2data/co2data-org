import Footer from '@/components/footer'
import Header from '@/components/header'
import { AnalyticsWrapper } from './analytics'
import { baseUrl } from './config'
import './globals.css'
// import type { Metadata } from 'next/types'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto flex-1 px-4 py-16">{children}</div>
        <Footer />
        <AnalyticsWrapper />
      </body>
    </html>
  )
}

export const metadata = {
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
    url: baseUrl,
    siteName: 'CO₂ Data',
    locale: 'en-US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: baseUrl,
  },
}
