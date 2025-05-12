"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wifi, Search, Plus, MoreHorizontal, Calendar, MapPin, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/data-provider"
import { deleteScan } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

export default function ScansClientPage() {
  const { scans, refreshScans } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar scans com base no termo de busca
  const filteredScans = scans.filter(
    (scan) =>
      scan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteScan = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.")) {
      const success = deleteScan(id)
      if (success) {
        refreshScans()
        toast({
          title: "Análise excluída",
          description: "A análise foi excluída com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir a análise. Tente novamente.",
          variant: "destructive",
        })
      }
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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Análises de Rede</h1>
            <Link href="/scans/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Análise
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Análises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar análises..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">Filtrar</Button>
              </div>

              {filteredScans.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  {scans.length === 0 ? (
                    <>
                      <p className="text-muted-foreground">Nenhuma análise encontrada.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Crie sua primeira análise para começar a monitorar sua rede WiFi.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/scans/new">Criar Primeira Análise</Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma análise corresponde aos critérios de busca.</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Local</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Redes</TableHead>
                        <TableHead>Problemas</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScans.map((scan) => (
                        <TableRow key={scan.id}>
                          <TableCell className="font-medium">
                            <Link href={`/scans/${scan.id}`} className="hover:underline">
                              {scan.name}
                            </Link>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {scan.date}
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {scan.location}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={scan.status === "Completo" ? "default" : "outline"}
                              className={scan.status === "Completo" ? "bg-green-500 hover:bg-green-500/80" : ""}
                            >
                              {scan.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{scan.networks.length}</TableCell>
                          <TableCell>
                            {scan.issues.length > 0 ? (
                              <Badge variant="destructive">{scan.issues.length}</Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                              >
                                0
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/scans/${scan.id}`}>Ver detalhes</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/heatmap?scan=${scan.id}`}>Ver mapa de calor</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/reports/generate?scan=${scan.id}`}>Gerar relatório</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteScan(scan.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
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
        </div>
      </main>
    </div>
  )
}
