"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Wifi, ArrowLeft, Upload, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { createScan } from "@/lib/storage"
import { useData } from "@/components/data-provider"

export default function NewScanPage() {
  const router = useRouter()
  const { refreshScans } = useData()
  const [isLoading, setIsLoading] = useState(false)
  const [scanType, setScanType] = useState("manual")
  const [floorPlan, setFloorPlan] = useState<File | null>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const location = formData.get("location") as string
    const description = (formData.get("description") as string) || undefined

    // Obter data atual
    const now = new Date()
    const date = now.toLocaleDateString("pt-BR")
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

    try {
      // Criar nova análise usando localStorage
      const newScan = createScan({
        name,
        location,
        description,
        date,
        time,
        status: "Completo",
      })

      console.log('Nova análise criada:', newScan)

      toast({
        title: "Análise criada com sucesso",
        description: "Sua análise foi iniciada e estará disponível em breve.",
      })

      // Atualizar a lista de análises
      refreshScans()

      router.push("/scans")
    } catch (error) {
      toast({
        title: "Erro ao criar análise",
        description: "Ocorreu um erro ao criar a análise. Tente novamente.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleFloorPlanChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      setFloorPlan(event.target.files[0])
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/scans">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Nova Análise de Rede</h1>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informações da Análise</CardTitle>
                <CardDescription>Preencha os detalhes para iniciar uma nova análise de rede WiFi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Análise</Label>
                  <Input id="name" name="name" placeholder="Ex: Análise Escritório Principal" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="Ex: Escritório Principal"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Descreva o objetivo desta análise..."
                    rows={3}
                  />
                </div>

                <Tabs defaultValue="manual" onValueChange={(value) => setScanType(value)}>
                  <div className="space-y-2">
                    <Label>Tipo de Análise</Label>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="floorplan">Com Planta Baixa</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="manual" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Tamanho da Área</Label>
                      <RadioGroup defaultValue="medium" name="area-size">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small">Pequena (até 50m²)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Média (50-150m²)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large">Grande (mais de 150m²)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Ambiente</Label>
                      <RadioGroup defaultValue="office" name="environment-type">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="office" id="office" />
                          <Label htmlFor="office">Escritório</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="home" id="home" />
                          <Label htmlFor="home">Residencial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="commercial" id="commercial" />
                          <Label htmlFor="commercial">Comercial</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Outro</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </TabsContent>

                  <TabsContent value="floorplan" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Planta Baixa</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                        {floorPlan ? (
                          <div className="text-center">
                            <p className="font-medium">{floorPlan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(floorPlan.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setFloorPlan(null)}>
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium mb-1">Arraste e solte sua planta baixa aqui</p>
                            <p className="text-xs text-muted-foreground mb-4">Suporta PNG, JPG ou PDF até 10MB</p>
                            <Button variant="outline" asChild>
                              <label>
                                Selecionar Arquivo
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept=".png,.jpg,.jpeg,.pdf"
                                  onChange={handleFloorPlanChange}
                                />
                              </label>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scale">Escala (metros por pixel)</Label>
                      <Input
                        id="scale"
                        name="scale"
                        type="number"
                        placeholder="Ex: 0.1"
                        step="0.01"
                        min="0.01"
                        disabled={!floorPlan}
                      />
                      <p className="text-xs text-muted-foreground">
                        Defina a escala para mapear corretamente as distâncias na planta
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/scans">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Criando..." : "Iniciar Análise"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
