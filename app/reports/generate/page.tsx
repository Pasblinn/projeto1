"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Wifi, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getScans } from "@/lib/scans"
import { createReport } from "@/lib/reports"
import type { WifiAnalise } from "@/lib/supabase"

export default function GenerateReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [scans, setScans] = useState<WifiAnalise[]>([])
  const [selectedScanId, setSelectedScanId] = useState<string>("")

  useEffect(() => {
    getScans().then((data) => setScans(data || []))
    const scanId = searchParams.get("scan")
    if (scanId) setSelectedScanId(scanId)
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const relatorio_nome = formData.get("relatorio_nome") as string
    const relatorio_tipo = formData.get("relatorio_tipo") as string
    const relatorio_notas = (formData.get("relatorio_notas") as string) || ""
    const relatorio_analise_id = selectedScanId ? Number(selectedScanId) : null

    if (!relatorio_analise_id) {
      toast({
        title: "Selecione uma análise",
        description: "Por favor, selecione uma análise para gerar o relatório.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await createReport({
        relatorio_nome,
        relatorio_analise_id,
        relatorio_tipo,
        relatorio_notas,
      })
      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório foi gerado e está disponível para visualização.",
      })
      router.push("/reports")
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/reports">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Gerar Novo Relatório</h1>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informações do Relatório</CardTitle>
                <CardDescription>
                  Preencha os detalhes para gerar um novo relatório de análise de rede WiFi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="relatorio_nome">Nome do Relatório</Label>
                  <Input id="relatorio_nome" name="relatorio_nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relatorio_tipo">Tipo do Relatório</Label>
                  <Select name="relatorio_tipo" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completo">Completo</SelectItem>
                      <SelectItem value="resumido">Resumido</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relatorio_analise_id">Análise</Label>
                  <Select
                    name="relatorio_analise_id"
                    value={selectedScanId}
                    onValueChange={setSelectedScanId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a análise" />
                    </SelectTrigger>
                    <SelectContent>
                      {scans.map((scan) => (
                        <SelectItem key={scan.id} value={scan.id.toString()}>
                          {scan.analise_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relatorio_notas">Notas</Label>
                  <Textarea id="relatorio_notas" name="relatorio_notas" rows={4} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link href="/reports">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Gerando..." : "Gerar Relatório"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
