"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { getScans } from "@/lib/scans"
import { getCompleteAnalysisData, getNetworkStatsByAnaliseId } from "@/lib/wifi-data"
import { WifiAnalise, WifiAnaliseComplete } from "@/lib/supabase"

interface DataContextType {
  scans: WifiAnalise[]
  completeScans: WifiAnaliseComplete[]
  loading: boolean
  refreshScans: () => Promise<void>
  getCompleteAnalysis: (id: number) => Promise<WifiAnaliseComplete | null>
  getAnalysisStats: (id: number) => Promise<any>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<WifiAnalise[]>([])
  const [completeScans, setCompleteScans] = useState<WifiAnaliseComplete[]>([])
  const [loading, setLoading] = useState(true)

  const refreshScans = async () => {
    try {
      setLoading(true)
      const data = await getScans()
      setScans(data)
      
      // Optionally load complete data for recent scans
      const recentScans = data.slice(0, 5) // Load complete data for 5 most recent
      const completeData = await Promise.all(
        recentScans.map(scan => getCompleteAnalysisData(scan.id))
      )
      
      setCompleteScans(completeData.filter(Boolean) as WifiAnaliseComplete[])
    } catch (error) {
      console.error("Error refreshing scans:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCompleteAnalysis = async (id: number): Promise<WifiAnaliseComplete | null> => {
    try {
      // Check if we already have it in cache
      const cached = completeScans.find(scan => scan.id === id)
      if (cached) return cached

      // Fetch from database
      const data = await getCompleteAnalysisData(id)
      if (data) {
        setCompleteScans(prev => {
          const filtered = prev.filter(scan => scan.id !== id)
          return [...filtered, data]
        })
      }
      return data
    } catch (error) {
      console.error("Error getting complete analysis:", error)
      return null
    }
  }

  const getAnalysisStats = async (id: number) => {
    try {
      return await getNetworkStatsByAnaliseId(id)
    } catch (error) {
      console.error("Error getting analysis stats:", error)
      return null
    }
  }

  useEffect(() => {
    refreshScans()
  }, [])

  return (
    <DataContext.Provider 
      value={{ 
        scans, 
        completeScans, 
        loading, 
        refreshScans, 
        getCompleteAnalysis,
        getAnalysisStats 
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
