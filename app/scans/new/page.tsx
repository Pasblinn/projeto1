"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wifi, ArrowLeft } from "lucide-react"
import { createScan } from "@/lib/scans"
import { toast } from "@/components/ui/use-toast"

export default function NewScanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const scanData = {
      analise_nome: formData.get("nome") as string,
      analise_local: formData.get("local") as string,
      analise_descricao: formData.get("descricao") as string,
      analise_tipo: formData.get("tipo") as string,
      analise_tamanho: formData.get("tamanho") as string,
      analise_ambiente: formData.get("ambiente") as string,
      analise_planta_id: formData.get("planta_id") as string,
      analise_escala: formData.get("escala") ? Number(formData.get("escala")) : null,
    }

    try {
      await createScan(scanData)
      toast({
        title: "Análise criada",
        description: "A análise foi criada com sucesso.",
      })
      router.push("/scans")
    } catch (error) {
      console.error("Error creating scan:", error)
      toast({
        title: "Erro ao criar análise",
        description: "Não foi possível criar a análise. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/scans">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Nova Análise</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Análise</Label>
                    <Input id="nome" name="nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="local">Local</Label>
                    <Input id="local" name="local" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Análise</Label>
                    <Select name="tipo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cobertura">Cobertura</SelectItem>
                        <SelectItem value="interferencia">Interferência</SelectItem>
                        <SelectItem value="capacidade">Capacidade</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ambiente">Ambiente</Label>
                    <Select name="ambiente" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ambiente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interno">Interno</SelectItem>
                        <SelectItem value="externo">Externo</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tamanho">Tamanho da Área</Label>
                    <Input id="tamanho" name="tamanho" placeholder="Ex: 100m²" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="escala">Escala (metros)</Label>
                    <Input id="escala" name="escala" type="number" placeholder="Ex: 1" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea id="descricao" name="descricao" rows={4} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="planta_id">ID da Planta (opcional)</Label>
                    <Input id="planta_id" name="planta_id" />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" asChild>
                    <Link href="/scans">Cancelar</Link>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Criando..." : "Criar Análise"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
