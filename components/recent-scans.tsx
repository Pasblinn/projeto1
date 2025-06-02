"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useData } from "@/components/data-provider"

export function RecentScans() {
  const { scans } = useData()

  // Sort scans by created_at date (most recent first)
  const sortedScans = [...scans]
    .sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5) // Get only the 5 most recent

  if (scans.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Nenhuma análise encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/scans/new">Criar Primeira Análise</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedScans.map((scan) => {
        // Generate mock issues count for demonstration
        const mockIssuesCount = Math.floor(Math.random() * 4) // 0-3 issues
        
        return (
          <div key={scan.id} className="flex items-start gap-4 rounded-lg border p-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <Link href={`/scans/${scan.id}`} className="font-medium hover:underline">
                  {scan.analise_nome}
                </Link>
                {mockIssuesCount > 0 ? (
                  <Badge variant="destructive">{mockIssuesCount} problemas</Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                  >
                    Sem problemas
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(scan.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(scan.created_at).toLocaleTimeString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{scan.analise_local}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/scans/${scan.id}`}>Ver detalhes</Link>
            </Button>
          </div>
        )
      })}
    </div>
  )
}
