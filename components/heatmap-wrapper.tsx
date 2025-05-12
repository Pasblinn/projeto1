"use client"

import dynamic from "next/dynamic"

// Importação dinâmica com ssr: false dentro de um componente cliente
const HeatmapClient = dynamic(() => import("@/components/heatmap-client"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center">Carregando visualização do mapa de calor...</div>
  ),
})

export function HeatmapWrapper() {
  return <HeatmapClient />
}
