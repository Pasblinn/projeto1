import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type WifiAnalise = {
  id: number
  analise_nome: string
  analise_local: string
  analise_descricao: string | null
  analise_tipo: string | null
  analise_tamanho: string | null
  analise_ambiente: string | null
  analise_planta_id: string | null
  analise_escala: number | null
  created_at: string
}

export type WifiNetwork = {
  id: number
  analise_id: number
  ssid: string
  bssid: string
  signal_strength: number // dBm (-100 to -30)
  signal_quality: number | null // Percentage 0-100
  channel: number // 1-13 for 2.4GHz, 36-165 for 5GHz
  frequency: number // MHz
  band: string // '2.4GHz' or '5GHz'
  security_type: string | null // 'Open', 'WEP', 'WPA', 'WPA2', 'WPA3'
  encryption: string | null // 'None', 'TKIP', 'AES', 'TKIP+AES'
  vendor: string | null
  max_speed: number | null // Mbps
  clients_count: number
  is_hidden: boolean
  created_at: string
}

export type WifiIssue = {
  id: number
  analise_id: number
  network_id: number | null
  issue_type: string // 'interference', 'weak_signal', 'channel_congestion', 'security_risk'
  severity: string // 'low', 'medium', 'high', 'critical'
  title: string
  description: string
  recommendation: string | null
  impact_score: number | null // 1-10
  auto_detected: boolean
  resolved: boolean
  created_at: string
}

export type WifiPerformanceMetric = {
  id: number
  analise_id: number
  network_id: number | null
  timestamp: string
  throughput_down: number | null // Mbps
  throughput_up: number | null // Mbps
  latency: number | null // ms
  packet_loss: number | null // percentage
  jitter: number | null // ms
  noise_floor: number | null // dBm
  created_at: string
}

export type WifiCoveragePoint = {
  id: number
  analise_id: number
  x_coordinate: number
  y_coordinate: number
  signal_strength: number // dBm
  signal_quality: number | null // percentage
  throughput: number | null // Mbps
  networks_detected: number
  created_at: string
}

export type WifiRelatorio = {
  id: number
  relatorio_nome: string | null
  relatorio_analise_id: number | null
  relatorio_tipo: string | null
  relatorio_notas: string | null
  report_data: any | null // JSONB data
  export_format: string | null // 'PDF', 'CSV', 'JSON'
  created_at: string
}

// Tipos compostos para o dashboard
export type WifiAnaliseComplete = WifiAnalise & {
  networks: WifiNetwork[]
  issues: WifiIssue[]
  performance_metrics: WifiPerformanceMetric[]
  coverage_points: WifiCoveragePoint[]
} 