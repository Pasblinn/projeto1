"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wifi, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { NetworkStatusChart } from "@/components/network-status-chart"
import { SignalStrengthChart } from "@/components/signal-strength-chart"
import { ChannelUtilizationChart } from "@/components/channel-utilization-chart"
import { RecentScans } from "@/components/recent-scans"
import { useData } from "@/components/data-provider"

export default function DashboardPage() {
  const { scans, loading } = useData()
  const [dashboardData, setDashboardData] = useState({
    totalNetworks: 0,
    totalIssues: 0,
    signalQuality: "N/A",
    coveragePercentage: 0,
    lastScanDate: "N/A",
    lastScanTime: "N/A",
  })

  useEffect(() => {
    if (!loading && scans.length > 0) {
      // Calcular métricas do dashboard
      const totalNetworks = scans.reduce((total, scan) => total + scan.networks.length, 0)
      const totalIssues = scans.reduce((total, scan) => total + scan.issues.length, 0)

      // Calcular qualidade do sinal (simplificado)
      let signalQuality = "N/A"
      let coveragePercentage = 0

      if (totalNetworks > 0) {
        const allNetworks = scans.flatMap((scan) => scan.networks)
        const avgSignalStrength =
          allNetworks.reduce((sum, network) => sum + network.signalStrength, 0) / allNetworks.length

        if (avgSignalStrength > 70) {
          signalQuality = "Boa"
          coveragePercentage = 75
        } else if (avgSignalStrength > 50) {
          signalQuality = "Regular"
          coveragePercentage = 50
        } else {
          signalQuality = "Fraca"
          coveragePercentage = 25
        }
      }

      // Encontrar a análise mais recente
      const sortedScans = [...scans].sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-") + " " + a.time)
        const dateB = new Date(b.date.split("/").reverse().join("-") + " " + b.time)
        return dateB.getTime() - dateA.getTime()
      })

      const lastScan = sortedScans[0]
      const lastScanDate = lastScan ? lastScan.date : "N/A"
      const lastScanTime = lastScan ? lastScan.time : "N/A"

      setDashboardData({
        totalNetworks,
        totalIssues,
        signalQuality,
        coveragePercentage,
        lastScanDate,
        lastScanTime,
      })
    }
  }, [scans, loading])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Wifi className="h-6 w-6 text-primary" />
            <span>WiFi Analyzer Pro</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
              Dashboard
            </Link>
            <Link href="/scans" className="text-sm font-medium hover:underline">
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link href="/scans/new">
              <Button>Nova Análise</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Redes Detectadas</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalNetworks}</div>
                <p className="text-xs text-muted-foreground">Total de redes em todas as análises</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Problemas Detectados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalIssues}</div>
                <p className="text-xs text-muted-foreground">Total de problemas em todas as análises</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Qualidade do Sinal</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.signalQuality}</div>
                <p className="text-xs text-muted-foreground">{dashboardData.coveragePercentage}% de cobertura ideal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Última Análise</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.lastScanDate}</div>
                <p className="text-xs text-muted-foreground">{dashboardData.lastScanTime}</p>
              </CardContent>
            </Card>
          </div>

          {scans.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h2 className="text-xl font-semibold mb-2">Nenhuma análise encontrada</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Você ainda não realizou nenhuma análise de rede WiFi.
                  <br />
                  Crie sua primeira análise para visualizar dados no dashboard.
                </p>
                <Button asChild>
                  <Link href="/scans/new">Criar Primeira Análise</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="performance">Desempenho</TabsTrigger>
                <TabsTrigger value="issues">Problemas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Status da Rede</CardTitle>
                      <CardDescription>Visão geral do status da rede nas últimas 24 horas</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <NetworkStatusChart />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Força do Sinal</CardTitle>
                      <CardDescription>Distribuição da força do sinal por área</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SignalStrengthChart />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Utilização de Canais</CardTitle>
                      <CardDescription>Distribuição de redes por canal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChannelUtilizationChart />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Análises Recentes</CardTitle>
                      <CardDescription>Últimas 5 análises realizadas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentScans />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho da Rede</CardTitle>
                    <CardDescription>Métricas detalhadas de desempenho da sua rede WiFi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Gráficos detalhados de desempenho serão exibidos aqui</p>
                    </div>
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
                    {scans.flatMap((scan) => scan.issues).length === 0 ? (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">Nenhum problema detectado nas análises.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {scans
                          .flatMap((scan) =>
                            scan.issues.map((issue) => ({
                              ...issue,
                              scanName: scan.name,
                              scanId: scan.id,
                            })),
                          )
                          .slice(0, 3)
                          .map((issue) => (
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
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                                </p>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                                <div className="pt-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/scans/${issue.scanId}`}>Ver Detalhes</Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
