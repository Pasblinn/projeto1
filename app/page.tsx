import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, Activity, Map, BarChart3 } from "lucide-react"

export default function Home() {
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
            <Link href="/reports" className="text-sm font-medium hover:underline">
              Reports
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Análise Profissional de Redes WiFi
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Identifique problemas, visualize a cobertura e otimize sua rede WiFi com nossa ferramenta de análise
                    avançada.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/scans/new">
                    <Button size="lg">Iniciar Nova Análise</Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      Ver Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 lg:ml-auto">
                <div className="aspect-video overflow-hidden rounded-xl border bg-background">
                  <img
                    src="/NetSpot_signal_level.webp"
                    alt="WiFi Heatmap Preview"
                    className="object-cover w-full"
                    width={800}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Recursos Principais</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma oferece ferramentas avançadas para análise completa da sua rede WiFi
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Map className="h-8 w-8 text-primary" />
                  <CardTitle>Mapa de Calor</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Visualize a cobertura do sinal WiFi em cada área do seu ambiente com mapas de calor detalhados.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <WifiOff className="h-8 w-8 text-primary" />
                  <CardTitle>Detecção de Problemas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Identifique automaticamente interferências, pontos cegos e outros problemas que afetam sua rede.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Activity className="h-8 w-8 text-primary" />
                  <CardTitle>Análise de Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Monitore a velocidade, latência e estabilidade da sua rede WiFi em tempo real.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <CardTitle>Relatórios Detalhados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gere relatórios completos com métricas e recomendações para otimizar sua rede.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Wifi className="h-8 w-8 text-primary" />
                  <CardTitle>Otimização de Canais</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receba sugestões para configurar os canais WiFi ideais e evitar interferências.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Map className="h-8 w-8 text-primary" />
                  <CardTitle>Planejamento de Rede</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Simule diferentes configurações para encontrar o posicionamento ideal dos pontos de acesso.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WiFi Analyzer Pro. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Termos
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacidade
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
