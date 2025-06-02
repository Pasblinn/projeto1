import { supabase, WifiAnalise } from './supabase'

export async function getScans() {
  const { data, error } = await supabase
    .from('wifi_analise')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching scans:', error)
    throw error
  }

  return data
}

export async function getScanById(id: number) {
  const { data, error } = await supabase
    .from('wifi_analise')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching scan:', error)
    throw error
  }

  return data
}

export async function createScan(scan: Omit<WifiAnalise, 'id' | 'created_at'>) {
  console.log('Creating scan with data:', scan)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  try {
    const { data, error } = await supabase
      .from('wifi_analise')
      .insert([scan])
      .select()
      .single()

    if (error) {
      console.error('Error creating scan:', error)
      throw error
    }

    console.log('Scan created successfully:', data)
    return data
  } catch (error) {
    console.error('Unexpected error creating scan:', error)
    throw error
  }
}

export async function updateScan(id: number, scan: Partial<WifiAnalise>) {
  const { data, error } = await supabase
    .from('wifi_analise')
    .update(scan)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating scan:', error)
    throw error
  }

  return data
}

export async function deleteScan(id: number) {
  const { error } = await supabase
    .from('wifi_analise')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting scan:', error)
    throw error
  }

  return true
} 