"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Wifi, Search, FileText, Download, Calendar, MoreHorizontal, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/data-provider"
import { deleteReport } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"

export default function ReportsClientPage() {
  const { reports, refreshReports } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar relatórios com base no termo de busca
  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.scanName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteReport = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.")) {
      const success = deleteReport(id)
      if (success) {
        refreshReports()
        toast({
          title: "Relatório excluído",
          description: "O relatório foi excluído com sucesso.",
        })
      } else {
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o relatório. Tente novamente.",
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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Relatórios</h1>
            <Link href="/reports/generate">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                Gerar Novo Relatório
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios Gerados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar relatórios..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline">Filtrar</Button>
              </div>

              {filteredReports.length === 0 ? (
                <div className="text-center py-8 border rounded-md">
                  {reports.length === 0 ? (
                    <>
                      <p className="text-muted-foreground">Nenhum relatório encontrado.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Gere seu primeiro relatório para documentar suas análises de rede WiFi.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/reports/generate">Gerar Primeiro Relatório</Link>
                      </Button>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Nenhum relatório corresponde aos critérios de busca.</p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Análise</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <Link href={`/reports/${report.id}`} className="hover:underline">
                              {report.name}
                            </Link>
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {report.date}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/scans/${report.scanId}`} className="hover:underline">
                              {report.scanName}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="text-primary">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/reports/${report.id}`}>Ver relatório</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteReport(report.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
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
