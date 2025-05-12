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
import { createReport, getAllScans } from "@/lib/storage"
import { useData } from "@/components/data-provider"
import type { NetworkScan } from "@/lib/storage"

export default function GenerateReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshReports } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [scans, setScans] = useState<NetworkScan[]>([])
  const [selectedScanId, setSelectedScanId] = useState<string>("")

  useEffect(() => {
    // Carregar análises disponíveis
    const availableScans = getAllScans().filter((scan) => scan.status === "Completo")
    setScans(availableScans)

    // Verificar se há um ID de análise na URL
    const scanId = searchParams.get("scan")
    if (scanId) {
      setSelectedScanId(scanId)
    }
  }, [searchParams])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const type = formData.get("type") as string
    const notes = (formData.get("notes") as string) || ""

    // Verificar se uma análise foi selecionada
    if (!selectedScanId) {
      toast({
        title: "Selecione uma análise",
        description: "Por favor, selecione uma análise para gerar o relatório.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Encontrar a análise selecionada
    const selectedScan = scans.find((scan) => scan.id === selectedScanId)
    if (!selectedScan) {
      toast({
        title: "Análise não encontrada",
        description: "A análise selecionada não foi encontrada.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Criar o relatório
      const now = new Date()
      const date = now.toLocaleDateString("pt-BR")

      // Gerar conteúdo do relatório (simplificado para este exemplo)
      const content = `
        # Relatório: ${name}
        
        Data: ${date}
        Tipo: ${type}
        Análise: ${selectedScan.name}
        
        ## Detalhes da Análise
        
        Local: ${selectedScan.location}
        Data da Análise: ${selectedScan.date}
        
        ## Redes Detectadas (${selectedScan.networks.length})
        
        ${selectedScan.networks
          .map(
            (network) => `
        - SSID: ${network.ssid}
          - Canal: ${network.channel}
          - Força do Sinal: ${network.signalStrength}%
          - Segurança: ${network.security}
          - Fabricante: ${network.vendor || "Desconhecido"}
        `,
          )
          .join("\n")}
        
        ## Problemas Detectados (${selectedScan.issues.length})
        
        ${selectedScan.issues
          .map(
            (issue) => `
        - Tipo: ${issue.type}
          - Severidade: ${issue.severity}
          - Descrição: ${issue.description}
          - Recomendação: ${issue.recommendation}
        `,
          )
          .join("\n")}
        
        ## Notas Adicionais
        
        ${notes || "Nenhuma nota adicional."}
      `

      // Criar o relatório no armazenamento
      createReport({
        name,
        date,
        type,
        scanId: selectedScan.id,
        scanName: selectedScan.name,
        content,
      })

      // Atualizar a lista de relatórios
      refreshReports()

      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório foi gerado e está disponível para visualização.",
      })

      // Redirecionar para a lista de relatórios
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
                  <Label htmlFor="name">Nome do Relatório</Label>
                  <Input id="name" name="name" placeholder="Ex: Relatório Completo - Escritório Principal" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scan">Análise</Label>
                  <Select value={selectedScanId} onValueChange={setSelectedScanId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma análise" />
                    </SelectTrigger>
                    <SelectContent>
                      {scans.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhuma análise concluída disponível
                        </SelectItem>
                      ) : (
                        scans.map((scan) => (
                          <SelectItem key={scan.id} value={scan.id}>
                            {scan.name} ({scan.date})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {scans.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Você precisa concluir pelo menos uma análise antes de gerar um relatório.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select name="type" defaultValue="Completo">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completo">Completo</SelectItem>
                      <SelectItem value="Problemas">Problemas</SelectItem>
                      <SelectItem value="Cobertura">Cobertura</SelectItem>
                      <SelectItem value="Desempenho">Desempenho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas Adicionais (opcional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Adicione observações ou notas adicionais para o relatório..."
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/reports">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isLoading || scans.length === 0}>
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
