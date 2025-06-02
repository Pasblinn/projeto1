-- Tabela principal de análises (já existe)
CREATE TABLE IF NOT EXISTS wifi_analise (
  id SERIAL PRIMARY KEY,
  analise_nome VARCHAR(255) NOT NULL,
  analise_local VARCHAR(255) NOT NULL,
  analise_descricao TEXT,
  analise_tipo VARCHAR(100),
  analise_tamanho VARCHAR(100),
  analise_ambiente VARCHAR(100),
  analise_planta_id VARCHAR(255),
  analise_escala DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de redes WiFi detectadas
CREATE TABLE IF NOT EXISTS wifi_networks (
  id SERIAL PRIMARY KEY,
  analise_id INTEGER REFERENCES wifi_analise(id) ON DELETE CASCADE,
  ssid VARCHAR(255) NOT NULL,
  bssid VARCHAR(17) NOT NULL, -- MAC address format XX:XX:XX:XX:XX:XX
  signal_strength INTEGER NOT NULL, -- dBm (-100 to -30)
  signal_quality INTEGER, -- Percentage 0-100
  channel INTEGER NOT NULL, -- 1-13 for 2.4GHz, 36-165 for 5GHz
  frequency DECIMAL(10,3) NOT NULL, -- MHz (2400-2500, 5000-6000)
  band VARCHAR(10) NOT NULL, -- '2.4GHz' or '5GHz'
  security_type VARCHAR(50), -- 'Open', 'WEP', 'WPA', 'WPA2', 'WPA3'
  encryption VARCHAR(50), -- 'None', 'TKIP', 'AES', 'TKIP+AES'
  vendor VARCHAR(255), -- Router manufacturer
  max_speed INTEGER, -- Mbps
  clients_count INTEGER DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de problemas/issues detectados
CREATE TABLE IF NOT EXISTS wifi_issues (
  id SERIAL PRIMARY KEY,
  analise_id INTEGER REFERENCES wifi_analise(id) ON DELETE CASCADE,
  network_id INTEGER REFERENCES wifi_networks(id) ON DELETE CASCADE,
  issue_type VARCHAR(50) NOT NULL, -- 'interference', 'weak_signal', 'channel_congestion', 'security_risk'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  impact_score INTEGER, -- 1-10
  auto_detected BOOLEAN DEFAULT TRUE,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de métricas de desempenho
CREATE TABLE IF NOT EXISTS wifi_performance_metrics (
  id SERIAL PRIMARY KEY,
  analise_id INTEGER REFERENCES wifi_analise(id) ON DELETE CASCADE,
  network_id INTEGER REFERENCES wifi_networks(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  throughput_down DECIMAL(10,2), -- Mbps
  throughput_up DECIMAL(10,2), -- Mbps
  latency INTEGER, -- ms
  packet_loss DECIMAL(5,2), -- percentage
  jitter INTEGER, -- ms
  noise_floor INTEGER, -- dBm
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cobertura (heatmap data)
CREATE TABLE IF NOT EXISTS wifi_coverage_points (
  id SERIAL PRIMARY KEY,
  analise_id INTEGER REFERENCES wifi_analise(id) ON DELETE CASCADE,
  x_coordinate DECIMAL(10,2) NOT NULL,
  y_coordinate DECIMAL(10,2) NOT NULL,
  signal_strength INTEGER NOT NULL, -- dBm
  signal_quality INTEGER, -- percentage
  throughput DECIMAL(10,2), -- Mbps
  networks_detected INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relatórios (já existe, mas vou melhorar)
CREATE TABLE IF NOT EXISTS wifi_relatorio (
  id SERIAL PRIMARY KEY,
  relatorio_nome VARCHAR(255),
  relatorio_analise_id INTEGER REFERENCES wifi_analise(id) ON DELETE CASCADE,
  relatorio_tipo VARCHAR(100),
  relatorio_notas TEXT,
  report_data JSONB, -- Dados estruturados do relatório
  export_format VARCHAR(20), -- 'PDF', 'CSV', 'JSON'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_wifi_networks_analise_id ON wifi_networks(analise_id);
CREATE INDEX IF NOT EXISTS idx_wifi_networks_signal_strength ON wifi_networks(signal_strength);
CREATE INDEX IF NOT EXISTS idx_wifi_networks_channel ON wifi_networks(channel);
CREATE INDEX IF NOT EXISTS idx_wifi_issues_analise_id ON wifi_issues(analise_id);
CREATE INDEX IF NOT EXISTS idx_wifi_issues_severity ON wifi_issues(severity);
CREATE INDEX IF NOT EXISTS idx_wifi_performance_analise_id ON wifi_performance_metrics(analise_id);
CREATE INDEX IF NOT EXISTS idx_wifi_coverage_analise_id ON wifi_coverage_points(analise_id); 