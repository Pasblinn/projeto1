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
import { getNetworksByAnaliseId, getIssuesByAnaliseId } from "@/lib/wifi-data"

// Mock data for demonstration when no real data is available
const generateMockNetworkData = (scanCount: number) => {
  const mockNetworks = []
  const mockIssues = []
  
  for (let i = 0; i < scanCount; i++) {
    // Generate 5-15 networks per scan
    const networkCount = Math.floor(Math.random() * 10) + 5
    for (let j = 0; j < networkCount; j++) {
      mockNetworks.push({
        id: `network_${i}_${j}`,
        ssid: `Network_${j + 1}`,
        signalStrength: Math.floor(Math.random() * 80) + 20, // 20-100
        channel: Math.floor(Math.random() * 13) + 1, // 1-13
        frequency: j % 2 === 0 ? 2.4 : 5,
        security: ['WPA2', 'WPA3', 'Open'][Math.floor(Math.random() * 3)],
      })
    }
    
    // Generate 0-3 issues per scan
    const issueCount = Math.floor(Math.random() * 4)
    for (let k = 0; k < issueCount; k++) {
      const issueTypes = ['interference', 'weak_signal', 'channel_congestion', 'security_risk']
      const severities = ['low', 'medium', 'high']
      mockIssues.push({
        id: `issue_${i}_${k}`,
        type: issueTypes[Math.floor(Math.random() * issueTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: `Issue detected in scan ${i + 1}`,
        scanId: i + 1,
      })
    }
  }
  
  return { networks: mockNetworks, issues: mockIssues }
}

export default function DashboardPage() {
  const { scans, loading, completeScans, getAnalysisStats } = useData()
  const [dashboardData, setDashboardData] = useState({
    totalNetworks: 0,
    totalIssues: 0,
    signalQuality: "N/A",
    coveragePercentage: 0,
    lastScanDate: "N/A",
    lastScanTime: "N/A",
  })
  const [realDataAvailable, setRealDataAvailable] = useState(false)
  const [realNetworks, setRealNetworks] = useState<any[]>([])
  const [realIssues, setRealIssues] = useState<any[]>([])

  useEffect(() => {
    if (!loading && scans.length > 0) {
      // Check if we have real network data
      checkForRealData()
    }
  }, [scans, loading])

  const checkForRealData = async () => {
    try {
      // Check if any scan has real network data
      let allNetworks: any[] = []
      let allIssues: any[] = []
      
      for (const scan of scans.slice(0, 5)) { // Check first 5 scans
        const networks = await getNetworksByAnaliseId(scan.id)
        const issues = await getIssuesByAnaliseId(scan.id)
        allNetworks = [...allNetworks, ...networks]
        allIssues = [...allIssues, ...issues]
      }

      if (allNetworks.length > 0 || allIssues.length > 0) {
        setRealDataAvailable(true)
        setRealNetworks(allNetworks)
        setRealIssues(allIssues)
        calculateRealMetrics(allNetworks, allIssues)
      } else {
        // Use mock data
        setRealDataAvailable(false)
        const mockData = generateMockNetworkData(scans.length)
        calculateMockMetrics(mockData)
      }
    } catch (error) {
      console.error('Error checking for real data:', error)
      // Fallback to mock data
      const mockData = generateMockNetworkData(scans.length)
      calculateMockMetrics(mockData)
    }
  }

  const calculateRealMetrics = (networks: any[], issues: any[]) => {
    const totalNetworks = networks.length
    const totalIssues = issues.length

    // Calculate signal quality using real data
    let signalQuality = "N/A"
    let coveragePercentage = 0

    if (totalNetworks > 0) {
      // Convert dBm to percentage for signal strength
      const avgSignalStrength = networks.reduce((sum, network) => {
        // Convert dBm (-100 to -30) to percentage (0 to 100)
        const percentage = Math.max(0, Math.min(100, ((network.signal_strength + 100) / 70) * 100))
        return sum + percentage
      }, 0) / networks.length

      if (avgSignalStrength > 70) {
        signalQuality = "Boa"
        coveragePercentage = 85
      } else if (avgSignalStrength > 50) {
        signalQuality = "Regular"
        coveragePercentage = 60
      } else {
        signalQuality = "Fraca"
        coveragePercentage = 30
      }
    }

    // Find the most recent analysis
    const sortedScans = [...scans].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    const lastScan = sortedScans[0]
    const lastScanDate = lastScan ? new Date(lastScan.created_at).toLocaleDateString('pt-BR') : "N/A"
    const lastScanTime = lastScan ? new Date(lastScan.created_at).toLocaleTimeString('pt-BR') : "N/A"

    setDashboardData({
      totalNetworks,
      totalIssues,
      signalQuality,
      coveragePercentage,
      lastScanDate,
      lastScanTime,
    })
  }

  const calculateMockMetrics = (mockData: any) => {
    const totalNetworks = mockData.networks.length
    const totalIssues = mockData.issues.length

    // Calculate signal quality (simplified)
    let signalQuality = "N/A"
    let coveragePercentage = 0

    if (totalNetworks > 0) {
      const avgSignalStrength =
        mockData.networks.reduce((sum: number, network: any) => sum + network.signalStrength, 0) / mockData.networks.length

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

    // Find the most recent analysis
    const sortedScans = [...scans].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return dateB.getTime() - dateA.getTime()
    })

    const lastScan = sortedScans[0]
    const lastScanDate = lastScan ? new Date(lastScan.created_at).toLocaleDateString('pt-BR') : "N/A"
    const lastScanTime = lastScan ? new Date(lastScan.created_at).toLocaleTimeString('pt-BR') : "N/A"

    setDashboardData({
      totalNetworks,
      totalIssues,
      signalQuality,
      coveragePercentage,
      lastScanDate,
      lastScanTime,
    })
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (realDataAvailable && realNetworks.length > 0) {
      // Use real data
      const channelData = Array.from({ length: 13 }, (_, i) => ({
        channel: (i + 1).toString(),
        networks: realNetworks.filter(net => net.channel === i + 1).length,
      }))

      const signalStrengthData = [
        { name: "Excelente", value: realNetworks.filter(n => n.signal_strength >= -50).length },
        { name: "Bom", value: realNetworks.filter(n => n.signal_strength >= -65 && n.signal_strength < -50).length },
        { name: "Regular", value: realNetworks.filter(n => n.signal_strength >= -80 && n.signal_strength < -65).length },
        { name: "Fraco", value: realNetworks.filter(n => n.signal_strength < -80).length },
      ]

      const statusData = scans.slice(-12).map((scan, index) => ({
        time: new Date(scan.created_at).toLocaleDateString('pt-BR'),
        signal: realNetworks.length > 0 ? 
          Math.round(((realNetworks[0]?.signal_strength || -70) + 100) / 70 * 100) : 50,
        interference: realIssues.filter(i => i.issue_type === 'interference').length * 10,
        clients: realNetworks.filter(n => n.analise_id === scan.id).length,
      }))

      return { channelData, signalStrengthData, statusData }
    } else {
      // Use mock data
      const mockData = generateMockNetworkData(scans.length)
      
      const channelData = Array.from({ length: 13 }, (_, i) => ({
        channel: (i + 1).toString(),
        networks: mockData.networks.filter(net => net.channel === i + 1).length,
      }))

      const allSignals = mockData.networks.map(net => net.signalStrength)
      const signalStrengthData = [
        { name: "Excelente", value: allSignals.filter(s => s >= 75).length },
        { name: "Bom", value: allSignals.filter(s => s >= 50 && s < 75).length },
        { name: "Regular", value: allSignals.filter(s => s >= 30 && s < 50).length },
        { name: "Fraco", value: allSignals.filter(s => s < 30).length },
      ]

      const statusData = scans.slice(-12).map((scan, index) => {
        const scanNetworks = mockData.networks.slice(index * 10, (index + 1) * 10)
        return {
          time: new Date(scan.created_at).toLocaleDateString('pt-BR'),
          signal: scanNetworks.length > 0
            ? Math.round(scanNetworks.reduce((sum, n) => sum + n.signalStrength, 0) / scanNetworks.length)
            : Math.floor(Math.random() * 40) + 30,
          interference: Math.floor(Math.random() * 30),
          clients: scanNetworks.length,
        }
      })

      return { channelData, signalStrengthData, statusData }
    }
  }

  const { channelData, signalStrengthData, statusData } = prepareChartData()
  
  // Insights
  const mostUsedChannel = channelData.reduce((max, c) => c.networks > max.networks ? c : max, channelData[0] || { channel: "1", networks: 0 })
  const bestSignal = signalStrengthData[0]?.value || 0
  const worstSignal = signalStrengthData[3]?.value || 0
  const currentIssues = realDataAvailable ? realIssues : generateMockNetworkData(scans.length).issues

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
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              {!realDataAvailable && (
                <p className="text-sm text-muted-foreground mt-1">
                  Exibindo dados demonstrativos - adicione dados reais de WiFi para análises completas
                </p>
              )}
            </div>
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
                <p className="text-xs text-muted-foreground">
                  Total de redes em todas as análises
                  {realDataAvailable && <span className="text-green-600"> • Dados reais</span>}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Problemas Detectados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalIssues}</div>
                <p className="text-xs text-muted-foreground">
                  Total de problemas em todas as análises
                  {realDataAvailable && <span className="text-green-600"> • Dados reais</span>}
                </p>
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
                      <CardDescription>
                        Visão geral do status da rede nas últimas análises
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <NetworkStatusChart data={statusData} />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Força do Sinal</CardTitle>
                      <CardDescription>
                        Distribuição da força do sinal por área.<br />
                        <span className="font-semibold">Excelente:</span> {bestSignal} redes &nbsp;|&nbsp; <span className="font-semibold">Fraco:</span> {worstSignal} redes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SignalStrengthChart data={signalStrengthData} />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Utilização de Canais</CardTitle>
                      <CardDescription>
                        Distribuição de redes por canal.<br />
                        <span className="font-semibold">Canal mais utilizado:</span> {mostUsedChannel.channel} ({mostUsedChannel.networks} redes)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChannelUtilizationChart data={channelData} />
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
                      <p className="text-muted-foreground">
                        {realDataAvailable 
                          ? "Gráficos detalhados de desempenho com dados reais serão exibidos aqui" 
                          : "Adicione dados reais de WiFi para visualizar métricas de desempenho"}
                      </p>
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
                    {currentIssues.length === 0 ? (
                      <div className="text-center py-8 border rounded-md">
                        <p className="text-muted-foreground">Nenhum problema detectado nas análises.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentIssues
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
                                  {realDataAvailable 
                                    ? issue.title 
                                    : issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace('_', ' ')
                                  }
                                </p>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                                <div className="pt-2">
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/scans/${issue.scanId || issue.analise_id}`}>Ver Detalhes</Link>
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
