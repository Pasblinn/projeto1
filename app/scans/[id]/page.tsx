"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, ArrowLeft, Calendar, Clock, MapPin, AlertTriangle, MoreHorizontal, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { getScan, updateScan, deleteNetwork, addNetwork, addIssue, deleteIssue, type NetworkScan } from "@/lib/storage"
import { useData } from "@/components/data-provider"

export default function ScanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { refreshScans } = useData()
  const [scan, setScan] = useState<NetworkScan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const scanData = getScan(id as string)
      if (scanData) {
        setScan(scanData)
      } else {
        toast({
          title: "Análise não encontrada",
          description: "A análise solicitada não foi encontrada.",
          variant: "destructive",
        })
        router.push("/scans")
      }
      setLoading(false)
    }
  }, [id, router])

  const handleCompleteAnalysis = () => {
    if (scan) {
      const updated = updateScan(scan.id, { status: "Completo" })
      if (updated) {
        setScan(updated)
        toast({
          title: "Análise concluída",
          description: "A análise foi marcada como concluída.",
        })
        refreshScans()
      }
    }
  }

  const handleDeleteNetwork = (networkId: string) => {
    if (scan && window.confirm("Tem certeza que deseja excluir esta rede?")) {
      const success = deleteNetwork(scan.id, networkId)
      if (success) {
        const updatedScan = getScan(scan.id)
        if (updatedScan) {
          setScan(updatedScan)
        }
        toast({
          title: "Rede excluída",
          description: "A rede foi excluída com sucesso.",
        })
      }
    }
  }

  const handleDeleteIssue = (issueId: string) => {
    if (scan && window.confirm("Tem certeza que deseja excluir este problema?")) {
      const success = deleteIssue(scan.id, issueId)
      if (success) {
        const updatedScan = getScan(scan.id)
        if (updatedScan) {
          setScan(updatedScan)
        }
        toast({
          title: "Problema excluído",
          description: "O problema foi excluído com sucesso.",
        })
      }
    }
  }

  // Função para simular a adição de uma rede (em um caso real, isso viria de uma varredura real)
  const handleAddSampleNetwork = () => {
    if (scan) {
      const newNetwork = {
        ssid: `Rede-${Math.floor(Math.random() * 1000)}`,
        bssid: `00:${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}:${Math.floor(Math.random() * 100)}`,
        channel: Math.floor(Math.random() * 13) + 1,
        frequency: 2400 + Math.floor(Math.random() * 100),
        signalStrength: Math.floor(Math.random() * 100),
        security: ["WPA2", "WPA3", "WEP", "Open"][Math.floor(Math.random() * 4)],
        vendor: ["Cisco", "TP-Link", "D-Link", "Netgear"][Math.floor(Math.random() * 4)],
      }

      const added = addNetwork(scan.id, newNetwork)
      if (added) {
        const updatedScan = getScan(scan.id)
        if (updatedScan) {
          setScan(updatedScan)
        }
        toast({
          title: "Rede adicionada",
          description: "Uma nova rede foi detectada e adicionada à análise.",
        })
      }
    }
  }

  // Função para simular a detecção de um problema (em um caso real, isso seria baseado em análise real)
  const handleAddSampleIssue = () => {
    if (scan) {
      const issueTypes = ["interference", "coverage", "channel", "security", "performance"] as const
      const severityLevels = ["low", "medium", "high"] as const

      const newIssue = {
        type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
        severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
        description: `Problema detectado: ${issueTypes[Math.floor(Math.random() * issueTypes.length)]}`,
        recommendation: "Recomendamos ajustar as configurações do roteador ou reposicionar o ponto de acesso.",
        location: scan.location,
      }

      const added = addIssue(scan.id, newIssue)
      if (added) {
        const updatedScan = getScan(scan.id)
        if (updatedScan) {
          setScan(updatedScan)
        }
        toast({
          title: "Problema detectado",
          description: "Um novo problema foi identificado na análise.",
        })
      }
    }
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  if (!scan) {
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
            <h1 className="text-2xl font-bold">Análise não encontrada</h1>
            <p className="mt-2 text-muted-foreground">A análise solicitada não existe ou foi removida.</p>
            <Button asChild className="mt-4">
              <Link href="/scans">Voltar para Análises</Link>
            </Button>
          </div>
        </main>
      </div>
    )
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
            <Link href="/scans" className="text-sm font-medium text-primary hover:underline">
              Scans
            </Link>
            <Link href="/heatmap" className="text-sm font-medium hover:underline">
              Heatmap
            </Link>
            <Link href="/reports" className="text-sm font-medium hover:underline">
              Reports
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/scans">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{scan.name}</h1>
            <Badge
              variant={scan.status === "Completo" ? "default" : "outline"}
              className={scan.status === "Completo" ? "bg-green-500 hover:bg-green-500/80 ml-2" : "ml-2"}
            >
              {scan.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{scan.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{scan.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{scan.location}</span>
            </div>
          </div>

          {scan.description && (
            <Card>
              <CardContent className="pt-6">
                <p>{scan.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={handleAddSampleNetwork} disabled={scan.status === "Completo"}>
              Simular Detecção de Rede
            </Button>
            <Button variant="outline" onClick={handleAddSampleIssue} disabled={scan.status === "Completo"}>
              Simular Detecção de Problema
            </Button>
            {scan.status !== "Completo" && <Button onClick={handleCompleteAnalysis}>Concluir Análise</Button>}
          </div>

          <Tabs defaultValue="networks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="networks">Redes Detectadas ({scan.networks.length})</TabsTrigger>
              <TabsTrigger value="issues">Problemas ({scan.issues.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="networks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Redes WiFi Detectadas</CardTitle>
                  <CardDescription>Lista de todas as redes WiFi encontradas durante a análise</CardDescription>
                </CardHeader>
                <CardContent>
                  {scan.networks.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">Nenhuma rede detectada.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clique em "Simular Detecção de Rede" para adicionar redes de exemplo.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>SSID</TableHead>
                            <TableHead>Canal</TableHead>
                            <TableHead>Força do Sinal</TableHead>
                            <TableHead>Segurança</TableHead>
                            <TableHead>Fabricante</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scan.networks.map((network) => (
                            <TableRow key={network.id}>
                              <TableCell className="font-medium">{network.ssid}</TableCell>
                              <TableCell>{network.channel}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        network.signalStrength > 70
                                          ? "bg-green-500"
                                          : network.signalStrength > 40
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                      }`}
                                      style={{ width: `${network.signalStrength}%` }}
                                    ></div>
                                  </div>
                                  <span>{network.signalStrength}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{network.security}</TableCell>
                              <TableCell>{network.vendor || "Desconhecido"}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" disabled={scan.status === "Completo"}>
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Abrir menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteNetwork(network.id)}
                                    >
                                      Excluir
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="issues" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Problemas Detectados</CardTitle>
                  <CardDescription>Lista de problemas identificados na sua rede WiFi</CardDescription>
                </CardHeader>
                <CardContent>
                  {scan.issues.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <p className="text-muted-foreground">Nenhum problema detectado.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clique em "Simular Detecção de Problema" para adicionar problemas de exemplo.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scan.issues.map((issue) => (
                        <div key={issue.id} className="flex items-start gap-4 rounded-lg border p-4">
                          <AlertTriangle
                            className={`mt-0.5 h-5 w-5 ${
                              issue.severity === "high"
                                ? "text-destructive"
                                : issue.severity === "medium"
                                  ? "text-amber-500"
                                  : "text-yellow-500"
                            }`}
                          />
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}</p>
                              <Badge
                                variant={
                                  issue.severity === "high"
                                    ? "destructive"
                                    : issue.severity === "medium"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                            <p className="text-sm font-medium mt-2">Recomendação:</p>
                            <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                            {issue.location && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="font-medium">Local:</span> {issue.location}
                              </p>
                            )}
                          </div>
                          {scan.status !== "Completo" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteIssue(issue.id)}
                              className="text-destructive"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
