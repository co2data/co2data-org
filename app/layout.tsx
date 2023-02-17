import Footer from '@/components/footer'
import Header from '@/components/header'
import { AnalyticsWrapper } from './analytics'
import './globals.css'

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
