"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, ArrowLeft, Calendar, Download, FileText, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { getReport, type Report } from "@/lib/storage"

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const reportData = getReport(id as string)
      if (reportData) {
        setReport(reportData)
      } else {
        toast({
          title: "Relatório não encontrado",
          description: "O relatório solicitado não foi encontrado.",
          variant: "destructive",
        })
        router.push("/reports")
      }
      setLoading(false)
    }
  }, [id, router])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Wifi className="h-6 w-6 text-primary" />
              <span>WiFi Analyzer Pro</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="animate-pulse">Carregando relatório...</div>
        </main>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Wifi className="h-6 w-6 text-primary" />
              <span>WiFi Analyzer Pro</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Relatório não encontrado</h1>
            <p className="mt-2 text-muted-foreground">O relatório solicitado não existe ou foi removido.</p>
            <Button asChild className="mt-4">
              <Link href="/reports">Voltar para Relatórios</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b print:hidden">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Wifi className="h-6 w-6 text-primary" />
            <span>WiFi Analyzer Pro</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/scans" className="text-sm font-medium hover:underline">
              Scans
            </Link>
            <Link href="/heatmap" className="text-sm font-medium hover:underline">
              Heatmap
            </Link>
            <Link href="/reports" className="text-sm font-medium text-primary hover:underline">
              Reports
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/reports">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{report.name}</h1>
          </div>

          <div className="flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{report.type}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{report.date}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>

          <Card className="print:shadow-none print:border-none">
            <CardHeader className="print:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary hidden print:block" />
                  <CardTitle className="print:text-2xl">{report.name}</CardTitle>
                </div>
                <div className="hidden print:block text-sm">
                  <div>Data: {report.date}</div>
                  <div>Tipo: {report.type}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line">
                  {report.content.split("# ").map((section, index) => {
                    if (index === 0) return null

                    const lines = section.split("\n")
                    const title = lines[0]
                    const content = lines.slice(1).join("\n")

                    return (
                      <div key={index} className="mb-6">
                        <h2 className="text-xl font-bold mb-2">{title}</h2>
                        <div className="whitespace-pre-line">{content}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
