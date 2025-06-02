import { supabase, WifiRelatorio } from './supabase'

export async function getReports() {
  const { data, error } = await supabase
    .from('wifi_relatorio')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reports:', error)
    throw error
  }

  return data
}

export async function getReportById(id: number) {
  const { data, error } = await supabase
    .from('wifi_relatorio')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching report:', error)
    throw error
  }

  return data
}

export async function createReport(report: Omit<WifiRelatorio, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('wifi_relatorio')
    .insert([report])
    .select()
    .single()

  if (error) {
    console.error('Error creating report:', error)
    throw error
  }

  return data
}

export async function updateReport(id: number, report: Partial<WifiRelatorio>) {
  const { data, error } = await supabase
    .from('wifi_relatorio')
    .update(report)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating report:', error)
    throw error
  }

  return data
}

export async function deleteReport(id: number) {
  const { error } = await supabase
    .from('wifi_relatorio')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting report:', error)
    throw error
  }

  return true
} 