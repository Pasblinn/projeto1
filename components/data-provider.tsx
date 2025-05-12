"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type NetworkScan, type Report, initializeDataIfEmpty, getAllScans, getAllReports } from "@/lib/storage"

interface DataContextType {
  scans: NetworkScan[]
  reports: Report[]
  refreshScans: () => void
  refreshReports: () => void
  loading: boolean
}

const DataContext = createContext<DataContextType>({
  scans: [],
  reports: [],
  refreshScans: () => {},
  refreshReports: () => {},
  loading: true,
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<NetworkScan[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // Inicializar dados
  useEffect(() => {
    initializeDataIfEmpty()
    refreshData()
    setLoading(false)
  }, [])

  function refreshScans() {
    setScans(getAllScans())
  }

  function refreshReports() {
    setReports(getAllReports())
  }

  function refreshData() {
    refreshScans()
    refreshReports()
  }

  return (
    <DataContext.Provider value={{ scans, reports, refreshScans, refreshReports, loading }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
