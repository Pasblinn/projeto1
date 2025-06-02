import { supabase, WifiNetwork, WifiIssue, WifiPerformanceMetric, WifiCoveragePoint, WifiAnaliseComplete } from './supabase'

// ==================== WIFI NETWORKS ====================
export async function getNetworksByAnaliseId(analiseId: number): Promise<WifiNetwork[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_networks')
      .select('*')
      .eq('analise_id', analiseId)
      .order('signal_strength', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching networks:', error)
    return []
  }
}

export async function createNetwork(network: Omit<WifiNetwork, 'id' | 'created_at'>): Promise<WifiNetwork | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_networks')
      .insert([network])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating network:', error)
    return null
  }
}

export async function updateNetwork(id: number, network: Partial<WifiNetwork>): Promise<WifiNetwork | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_networks')
      .update(network)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating network:', error)
    return null
  }
}

export async function deleteNetwork(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wifi_networks')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting network:', error)
    return false
  }
}

// ==================== WIFI ISSUES ====================
export async function getIssuesByAnaliseId(analiseId: number): Promise<WifiIssue[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_issues')
      .select('*')
      .eq('analise_id', analiseId)
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching issues:', error)
    return []
  }
}

export async function createIssue(issue: Omit<WifiIssue, 'id' | 'created_at'>): Promise<WifiIssue | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_issues')
      .insert([issue])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating issue:', error)
    return null
  }
}

export async function updateIssue(id: number, issue: Partial<WifiIssue>): Promise<WifiIssue | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_issues')
      .update(issue)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating issue:', error)
    return null
  }
}

export async function deleteIssue(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('wifi_issues')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting issue:', error)
    return false
  }
}

// ==================== PERFORMANCE METRICS ====================
export async function getPerformanceMetricsByAnaliseId(analiseId: number): Promise<WifiPerformanceMetric[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_performance_metrics')
      .select('*')
      .eq('analise_id', analiseId)
      .order('timestamp', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching performance metrics:', error)
    return []
  }
}

export async function createPerformanceMetric(metric: Omit<WifiPerformanceMetric, 'id' | 'created_at'>): Promise<WifiPerformanceMetric | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_performance_metrics')
      .insert([metric])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating performance metric:', error)
    return null
  }
}

// ==================== COVERAGE POINTS ====================
export async function getCoveragePointsByAnaliseId(analiseId: number): Promise<WifiCoveragePoint[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_coverage_points')
      .select('*')
      .eq('analise_id', analiseId)
      .order('x_coordinate')
      .order('y_coordinate')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching coverage points:', error)
    return []
  }
}

export async function createCoveragePoint(point: Omit<WifiCoveragePoint, 'id' | 'created_at'>): Promise<WifiCoveragePoint | null> {
  try {
    const { data, error } = await supabase
      .from('wifi_coverage_points')
      .insert([point])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating coverage point:', error)
    return null
  }
}

// ==================== COMPLETE ANALYSIS DATA ====================
export async function getCompleteAnalysisData(analiseId: number): Promise<WifiAnaliseComplete | null> {
  try {
    // Buscar dados da análise
    const { data: analise, error: analiseError } = await supabase
      .from('wifi_analise')
      .select('*')
      .eq('id', analiseId)
      .single()

    if (analiseError) throw analiseError

    // Buscar dados relacionados em paralelo
    const [networks, issues, performanceMetrics, coveragePoints] = await Promise.all([
      getNetworksByAnaliseId(analiseId),
      getIssuesByAnaliseId(analiseId),
      getPerformanceMetricsByAnaliseId(analiseId),
      getCoveragePointsByAnaliseId(analiseId)
    ])

    return {
      ...analise,
      networks,
      issues,
      performance_metrics: performanceMetrics,
      coverage_points: coveragePoints
    }
  } catch (error) {
    console.error('Error fetching complete analysis data:', error)
    return null
  }
}

// ==================== BULK OPERATIONS ====================
export async function bulkCreateNetworks(networks: Omit<WifiNetwork, 'id' | 'created_at'>[]): Promise<WifiNetwork[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_networks')
      .insert(networks)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error bulk creating networks:', error)
    return []
  }
}

export async function bulkCreateIssues(issues: Omit<WifiIssue, 'id' | 'created_at'>[]): Promise<WifiIssue[]> {
  try {
    const { data, error } = await supabase
      .from('wifi_issues')
      .insert(issues)
      .select()

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error bulk creating issues:', error)
    return []
  }
}

// ==================== ANALYTICS FUNCTIONS ====================
export async function getNetworkStatsByAnaliseId(analiseId: number) {
  try {
    const networks = await getNetworksByAnaliseId(analiseId)
    
    if (networks.length === 0) return null

    // Calcular estatísticas
    const avgSignalStrength = networks.reduce((sum, n) => sum + n.signal_strength, 0) / networks.length
    const channelDistribution = networks.reduce((acc, n) => {
      acc[n.channel] = (acc[n.channel] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const securityTypes = networks.reduce((acc, n) => {
      acc[n.security_type || 'Unknown'] = (acc[n.security_type || 'Unknown'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const bandDistribution = networks.reduce((acc, n) => {
      acc[n.band] = (acc[n.band] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalNetworks: networks.length,
      avgSignalStrength,
      strongestSignal: Math.max(...networks.map(n => n.signal_strength)),
      weakestSignal: Math.min(...networks.map(n => n.signal_strength)),
      channelDistribution,
      securityTypes,
      bandDistribution,
      hiddenNetworks: networks.filter(n => n.is_hidden).length
    }
  } catch (error) {
    console.error('Error calculating network stats:', error)
    return null
  }
} 