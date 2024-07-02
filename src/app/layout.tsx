import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { NextUIProvider } from "@nextui-org/react"
import "./globals.scss"

const inter = Inter({ subsets: ["latin"] })

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
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <div>{children}</div>
        </NextUIProvider>
      </body>
    </html>
  )
}
