import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { DataProvider } from "@/components/data-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WiFi Analyzer Pro",
  description: "Análise profissional de redes WiFi",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <DataProvider>
          {children}
          <Toaster />
        </DataProvider>
      </body>
    </html>
  )
}
