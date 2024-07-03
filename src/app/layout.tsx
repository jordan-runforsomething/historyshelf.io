import type { Metadata } from "next"
import { Inter, Spectral } from "next/font/google"
import { NextUIProvider } from "@nextui-org/react"
import "./globals.scss"

const inter = Inter({ subsets: ["latin"], variable: "--font-body" })
const spectral = Spectral({
  weight: "600",
  subsets: ["latin"],
  variable: "--font-title",
})

export const metadata: Metadata = {
  title: "Historyshelf.io",
  description: "Read, Explore, and Share History",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spectral.variable} ${inter.variable}`}>
      <body>
        <NextUIProvider>
          <div>{children}</div>
        </NextUIProvider>
      </body>
    </html>
  )
}
