-- Script para inserir dados de exemplo de WiFi
-- Execute este script no Supabase para testar com dados reais

-- Primeiro, vamos buscar algumas análises existentes ou criar uma
INSERT INTO wifi_analise (analise_nome, analise_local, analise_descricao, analise_tipo, analise_tamanho, analise_ambiente)
VALUES 
  ('Análise Escritório Central', 'Escritório - 2º Andar', 'Análise completa da rede WiFi do escritório principal', 'Corporativo', 'Médio', 'Interno'),
  ('Análise Cafeteria', 'Cafeteria - Térreo', 'Verificação de cobertura na área de alimentação', 'Público', 'Pequeno', 'Interno'),
  ('Análise Auditório', 'Auditório Principal', 'Análise para evento com muitos usuários', 'Eventos', 'Grande', 'Interno')
ON CONFLICT DO NOTHING;

-- Inserir redes WiFi detectadas para a primeira análise (assumindo ID 1)
INSERT INTO wifi_networks (analise_id, ssid, bssid, signal_strength, signal_quality, channel, frequency, band, security_type, encryption, vendor, max_speed, clients_count, is_hidden)
VALUES 
  -- Análise 1 - Escritório Central
  (1, 'EMPRESA_CORP', '00:1B:44:11:3A:B7', -42, 85, 6, 2437.0, '2.4GHz', 'WPA3', 'AES', 'Cisco', 150, 12, false),
  (1, 'EMPRESA_CORP_5G', '00:1B:44:11:3A:B8', -38, 92, 36, 5180.0, '5GHz', 'WPA3', 'AES', 'Cisco', 867, 8, false),
  (1, 'GUEST_NETWORK', '00:1B:44:11:3A:B9', -55, 70, 11, 2462.0, '2.4GHz', 'WPA2', 'AES', 'Cisco', 54, 5, false),
  (1, 'VIZINHO_WIFI', '84:C9:B2:55:FF:A2', -67, 45, 1, 2412.0, '2.4GHz', 'WPA2', 'TKIP', 'TP-Link', 150, 3, false),
  (1, 'Casa_João', 'A0:63:91:27:D4:12', -72, 35, 6, 2437.0, '2.4GHz', 'WPA2', 'AES', 'D-Link', 54, 2, false),
  (1, 'iPhone_Hotspot', '02:00:00:00:00:00', -78, 25, 9, 2452.0, '2.4GHz', 'WPA2', 'AES', 'Apple', 54, 1, false),
  (1, '', '12:34:56:78:9A:BC', -81, 20, 3, 2422.0, '2.4GHz', 'WPA2', 'AES', 'Unknown', 150, 0, true),
  
  -- Análise 2 - Cafeteria
  (2, 'CAFE_FREE_WIFI', '00:22:6B:BB:CC:DD', -45, 80, 1, 2412.0, '2.4GHz', 'Open', 'None', 'Ubiquiti', 300, 15, false),
  (2, 'CAFE_PRIVATE', '00:22:6B:BB:CC:DE', -48, 75, 44, 5220.0, '5GHz', 'WPA3', 'AES', 'Ubiquiti', 866, 6, false),
  (2, 'EMPRESA_CORP', '00:1B:44:11:3A:B7', -65, 50, 6, 2437.0, '2.4GHz', 'WPA3', 'AES', 'Cisco', 150, 3, false),
  (2, 'VizinhoLoja', 'C4:E9:84:17:2B:41', -70, 40, 11, 2462.0, '2.4GHz', 'WPA2', 'AES', 'Netgear', 150, 4, false),
  
  -- Análise 3 - Auditório
  (3, 'EVENTO_WIFI', '00:3E:E1:AA:BB:CC', -40, 90, 149, 5745.0, '5GHz', 'WPA2', 'AES', 'Aruba', 1200, 45, false),
  (3, 'EVENTO_BACKUP', '00:3E:E1:AA:BB:CD', -44, 85, 36, 5180.0, '5GHz', 'WPA2', 'AES', 'Aruba', 867, 25, false),
  (3, 'EMPRESA_CORP', '00:1B:44:11:3A:B7', -58, 60, 6, 2437.0, '2.4GHz', 'WPA3', 'AES', 'Cisco', 150, 8, false),
  (3, 'AUDITORIO_TECH', '88:DC:96:15:AA:47', -52, 72, 100, 5500.0, '5GHz', 'WPA3', 'AES', 'Ruckus', 866, 12, false);

-- Inserir problemas/issues detectados
INSERT INTO wifi_issues (analise_id, network_id, issue_type, severity, title, description, recommendation, impact_score, auto_detected, resolved)
VALUES 
  -- Problemas da Análise 1
  (1, NULL, 'channel_congestion', 'medium', 'Congestionamento no Canal 6', 'Múltiplas redes detectadas no canal 6 (2.4GHz), causando interferência', 'Considere migrar para os canais 1 ou 11, ou utilizar banda 5GHz', 6, true, false),
  (1, 7, 'weak_signal', 'low', 'Sinal Fraco Detectado', 'Rede oculta com sinal muito fraco (-81 dBm)', 'Verificar localização do ponto de acesso', 3, true, false),
  (1, 4, 'security_risk', 'low', 'Protocolo de Segurança Desatualizado', 'Rede utilizando TKIP em vez de AES', 'Atualizar configuração para WPA3 com AES', 4, true, false),
  
  -- Problemas da Análise 2
  (2, 8, 'security_risk', 'high', 'Rede Aberta Detectada', 'Rede WiFi sem criptografia em ambiente público', 'Implementar WPA3 ou pelo menos WPA2 na rede', 8, true, false),
  (2, NULL, 'interference', 'medium', 'Interferência entre Bandas', 'Sobreposição de sinais na faixa 2.4GHz', 'Ajustar potência de transmissão dos access points', 5, true, false),
  
  -- Problemas da Análise 3
  (3, NULL, 'channel_congestion', 'high', 'Sobrecarga na Rede Principal', 'Evento com 45 clientes conectados em um único access point', 'Ativar balanceamento de carga ou adicionar access points', 9, true, false),
  (3, 13, 'weak_signal', 'medium', 'Cobertura Insuficiente', 'Sinal da rede corporativa fraco no auditório', 'Instalar access point dedicado no auditório', 6, true, false);

-- Inserir métricas de performance
INSERT INTO wifi_performance_metrics (analise_id, network_id, timestamp, throughput_down, throughput_up, latency, packet_loss, jitter, noise_floor)
VALUES 
  -- Métricas da Análise 1
  (1, 1, NOW() - INTERVAL '1 hour', 145.5, 98.2, 12, 0.1, 2, -95),
  (1, 2, NOW() - INTERVAL '1 hour', 678.3, 234.7, 8, 0.0, 1, -92),
  (1, 3, NOW() - INTERVAL '1 hour', 48.9, 25.1, 18, 0.3, 4, -88),
  
  -- Métricas da Análise 2
  (2, 8, NOW() - INTERVAL '2 hours', 89.4, 45.8, 25, 0.8, 8, -90),
  (2, 9, NOW() - INTERVAL '2 hours', 567.2, 189.4, 11, 0.1, 2, -89),
  
  -- Métricas da Análise 3
  (3, 12, NOW() - INTERVAL '3 hours', 890.1, 456.7, 15, 0.2, 3, -85),
  (3, 13, NOW() - INTERVAL '3 hours', 723.8, 298.4, 13, 0.1, 2, -87);

-- Inserir pontos de cobertura (para heatmap)
INSERT INTO wifi_coverage_points (analise_id, x_coordinate, y_coordinate, signal_strength, signal_quality, throughput, networks_detected)
VALUES 
  -- Pontos da Análise 1 (Escritório - grade 10x10)
  (1, 0.0, 0.0, -45, 85, 145.5, 5),
  (1, 1.0, 0.0, -48, 80, 132.3, 5),
  (1, 2.0, 0.0, -52, 72, 98.7, 4),
  (1, 3.0, 0.0, -58, 60, 67.2, 4),
  (1, 4.0, 0.0, -65, 45, 34.1, 3),
  (1, 0.0, 1.0, -47, 82, 139.8, 5),
  (1, 1.0, 1.0, -42, 88, 156.2, 6),
  (1, 2.0, 1.0, -46, 84, 142.5, 5),
  (1, 3.0, 1.0, -55, 68, 78.3, 4),
  (1, 4.0, 1.0, -67, 42, 28.9, 3),
  
  -- Pontos da Análise 2 (Cafeteria)
  (2, 0.0, 0.0, -48, 78, 89.4, 4),
  (2, 1.0, 0.0, -52, 70, 76.8, 4),
  (2, 2.0, 0.0, -58, 58, 45.2, 3),
  (2, 0.0, 1.0, -51, 74, 82.1, 4),
  (2, 1.0, 1.0, -45, 81, 98.6, 4),
  (2, 2.0, 1.0, -55, 65, 52.7, 3),
  
  -- Pontos da Análise 3 (Auditório)
  (3, 0.0, 0.0, -42, 90, 890.1, 4),
  (3, 2.0, 0.0, -48, 82, 756.3, 4),
  (3, 4.0, 0.0, -55, 68, 623.7, 3),
  (3, 6.0, 0.0, -62, 52, 445.2, 3),
  (3, 0.0, 2.0, -46, 85, 812.5, 4),
  (3, 2.0, 2.0, -44, 87, 834.8, 4),
  (3, 4.0, 2.0, -51, 75, 687.4, 4),
  (3, 6.0, 2.0, -59, 58, 456.1, 3);

-- Verificação - Contar registros inseridos
SELECT 
  'wifi_analise' as tabela, COUNT(*) as registros FROM wifi_analise
UNION ALL
SELECT 
  'wifi_networks' as tabela, COUNT(*) as registros FROM wifi_networks
UNION ALL
SELECT 
  'wifi_issues' as tabela, COUNT(*) as registros FROM wifi_issues
UNION ALL
SELECT 
  'wifi_performance_metrics' as tabela, COUNT(*) as registros FROM wifi_performance_metrics
UNION ALL
SELECT 
  'wifi_coverage_points' as tabela, COUNT(*) as registros FROM wifi_coverage_points; 