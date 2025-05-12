"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ZoomIn, ZoomOut, Download, Maximize2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import dynamic from "next/dynamic"
import { useData } from "@/components/data-provider"

// Importação dinâmica do componente Canvas para evitar problemas com SSR
const HeatmapCanvas = dynamic(
  () => import("@/components/heatmap-canvas").then((mod) => ({ default: mod.HeatmapCanvas })),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Carregando canvas...</div>,
  },
)

export default function HeatmapClient() {
  const searchParams = useSearchParams()
  const { scans } = useData()
  const [selectedScan, setSelectedScan] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [viewMode, setViewMode] = useState("signal")

  useEffect(() => {
    // Verificar se há um ID de análise na URL
    const scanId = searchParams.get("scan")
    if (scanId) {
      setSelectedScan(scanId)
    } else if (scans.length > 0) {
      // Se não houver ID na URL, selecionar a primeira análise disponível
      setSelectedScan(scans[0].id)
    }
  }, [searchParams, scans])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Visualização do Mapa de Calor</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedScan} onValueChange={setSelectedScan}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Selecione uma análise" />
              </SelectTrigger>
              <SelectContent>
                {scans.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhuma análise disponível
                  </SelectItem>
                ) : (
                  scans.map((scan) => (
                    <SelectItem key={scan.id} value={scan.id}>
                      {scan.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aumentar Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Diminuir Zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tela Cheia</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exportar Mapa</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative border rounded-md overflow-hidden" style={{ height: "600px" }}>
            {!selectedScan || scans.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    {scans.length === 0
                      ? "Nenhuma análise disponível para visualização."
                      : "Selecione uma análise para visualizar o mapa de calor."}
                  </p>
                  {scans.length === 0 && (
                    <Button asChild>
                      <a href="/scans/new">Criar Primeira Análise</a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <HeatmapCanvas scanId={selectedScan} viewMode={viewMode} zoomLevel={zoomLevel} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Visualização</label>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de visualização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signal">Força do Sinal</SelectItem>
                <SelectItem value="coverage">Cobertura</SelectItem>
                <SelectItem value="interference">Interferência</SelectItem>
                <SelectItem value="channels">Canais</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Zoom</label>
              <span className="text-xs text-muted-foreground">{Math.round(zoomLevel * 100)}%</span>
            </div>
            <Slider
              value={[zoomLevel * 100]}
              min={50}
              max={200}
              step={10}
              onValueChange={(value) => setZoomLevel(value[0] / 100)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Camadas</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="layer-floorplan" className="rounded" defaultChecked />
                <label htmlFor="layer-floorplan" className="text-sm">
                  Planta Baixa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="layer-heatmap" className="rounded" defaultChecked />
                <label htmlFor="layer-heatmap" className="text-sm">
                  Mapa de Calor
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="layer-accesspoints" className="rounded" defaultChecked />
                <label htmlFor="layer-accesspoints" className="text-sm">
                  Pontos de Acesso
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="layer-labels" className="rounded" defaultChecked />
                <label htmlFor="layer-labels" className="text-sm">
                  Rótulos
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Legenda</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Sinal Fraco</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Sinal Médio</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm">Sinal Forte</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Ponto de Acesso</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
