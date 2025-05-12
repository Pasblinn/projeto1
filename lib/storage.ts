"use client"

// Interfaces para os tipos de dados
export interface NetworkScan {
  id: string
  name: string
  date: string
  time: string
  location: string
  description?: string
  status: "Em andamento" | "Completo" | "Cancelado"
  networks: Network[]
  issues: Issue[]
}

export interface Network {
  id: string
  ssid: string
  bssid: string
  channel: number
  frequency: number
  signalStrength: number
  security: string
  vendor?: string
}

export interface Issue {
  id: string
  type: "interference" | "coverage" | "channel" | "security" | "performance"
  severity: "low" | "medium" | "high"
  description: string
  recommendation: string
  location?: string
}

export interface Report {
  id: string
  name: string
  date: string
  type: string
  scanId: string
  scanName: string
  content: string
}

// Chaves para o localStorage
const SCANS_KEY = "wifi-analyzer-scans"
const REPORTS_KEY = "wifi-analyzer-reports"

// Funções auxiliares para manipular o localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  const storedValue = localStorage.getItem(key)
  if (!storedValue) return defaultValue

  try {
    return JSON.parse(storedValue) as T
  } catch (error) {
    console.error(`Error parsing localStorage item ${key}:`, error)
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// Funções CRUD para Scans
export function getAllScans(): NetworkScan[] {
  return getItem<NetworkScan[]>(SCANS_KEY, [])
}

export function getScan(id: string): NetworkScan | undefined {
  const scans = getAllScans()
  return scans.find((scan) => scan.id === id)
}

export function createScan(scanData: Omit<NetworkScan, "id" | "networks" | "issues">): NetworkScan {
  const scans = getAllScans()

  // Gerar ID único
  const id = Date.now().toString()

  const newScan: NetworkScan = {
    ...scanData,
    id,
    networks: [],
    issues: [],
  }

  setItem(SCANS_KEY, [...scans, newScan])
  return newScan
}

export function updateScan(id: string, scanData: Partial<NetworkScan>): NetworkScan | undefined {
  const scans = getAllScans()
  const index = scans.findIndex((scan) => scan.id === id)

  if (index === -1) return undefined

  const updatedScan = { ...scans[index], ...scanData }
  scans[index] = updatedScan

  setItem(SCANS_KEY, scans)
  return updatedScan
}

export function deleteScan(id: string): boolean {
  const scans = getAllScans()
  const filteredScans = scans.filter((scan) => scan.id !== id)

  if (filteredScans.length === scans.length) return false

  setItem(SCANS_KEY, filteredScans)

  // Também excluir relatórios associados
  const reports = getAllReports()
  const filteredReports = reports.filter((report) => report.scanId !== id)
  setItem(REPORTS_KEY, filteredReports)

  return true
}

// Funções para gerenciar redes dentro de um scan
export function addNetwork(scanId: string, network: Omit<Network, "id">): Network | undefined {
  const scan = getScan(scanId)
  if (!scan) return undefined

  const id = Date.now().toString()
  const newNetwork: Network = { ...network, id }

  scan.networks = [...scan.networks, newNetwork]
  updateScan(scanId, { networks: scan.networks })

  return newNetwork
}

export function updateNetwork(scanId: string, networkId: string, networkData: Partial<Network>): Network | undefined {
  const scan = getScan(scanId)
  if (!scan) return undefined

  const index = scan.networks.findIndex((network) => network.id === networkId)
  if (index === -1) return undefined

  const updatedNetwork = { ...scan.networks[index], ...networkData }
  scan.networks[index] = updatedNetwork

  updateScan(scanId, { networks: scan.networks })
  return updatedNetwork
}

export function deleteNetwork(scanId: string, networkId: string): boolean {
  const scan = getScan(scanId)
  if (!scan) return false

  const filteredNetworks = scan.networks.filter((network) => network.id !== networkId)
  if (filteredNetworks.length === scan.networks.length) return false

  updateScan(scanId, { networks: filteredNetworks })
  return true
}

// Funções para gerenciar problemas dentro de um scan
export function addIssue(scanId: string, issue: Omit<Issue, "id">): Issue | undefined {
  const scan = getScan(scanId)
  if (!scan) return undefined

  const id = Date.now().toString()
  const newIssue: Issue = { ...issue, id }

  scan.issues = [...scan.issues, newIssue]
  updateScan(scanId, { issues: scan.issues })

  return newIssue
}

export function updateIssue(scanId: string, issueId: string, issueData: Partial<Issue>): Issue | undefined {
  const scan = getScan(scanId)
  if (!scan) return undefined

  const index = scan.issues.findIndex((issue) => issue.id === issueId)
  if (index === -1) return undefined

  const updatedIssue = { ...scan.issues[index], ...issueData }
  scan.issues[index] = updatedIssue

  updateScan(scanId, { issues: scan.issues })
  return updatedIssue
}

export function deleteIssue(scanId: string, issueId: string): boolean {
  const scan = getScan(scanId)
  if (!scan) return false

  const filteredIssues = scan.issues.filter((issue) => issue.id !== issueId)
  if (filteredIssues.length === scan.issues.length) return false

  updateScan(scanId, { issues: filteredIssues })
  return true
}

// Funções CRUD para Relatórios
export function getAllReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, [])
}

export function getReport(id: string): Report | undefined {
  const reports = getAllReports()
  return reports.find((report) => report.id === id)
}

export function createReport(reportData: Omit<Report, "id">): Report {
  const reports = getAllReports()

  // Gerar ID único
  const id = Date.now().toString()

  const newReport: Report = {
    ...reportData,
    id,
  }

  setItem(REPORTS_KEY, [...reports, newReport])
  return newReport
}

export function updateReport(id: string, reportData: Partial<Report>): Report | undefined {
  const reports = getAllReports()
  const index = reports.findIndex((report) => report.id === id)

  if (index === -1) return undefined

  const updatedReport = { ...reports[index], ...reportData }
  reports[index] = updatedReport

  setItem(REPORTS_KEY, reports)
  return updatedReport
}

export function deleteReport(id: string): boolean {
  const reports = getAllReports()
  const filteredReports = reports.filter((report) => report.id !== id)

  if (filteredReports.length === reports.length) return false

  setItem(REPORTS_KEY, filteredReports)
  return true
}

// Função para inicializar dados de exemplo se não existirem
export function initializeDataIfEmpty(): void {
  const scans = getAllScans()

  if (scans.length === 0) {
    // Não inicializar com dados de exemplo, deixar vazio para o usuário criar
    setItem(SCANS_KEY, [])
  }

  const reports = getAllReports()

  if (reports.length === 0) {
    // Não inicializar com dados de exemplo, deixar vazio para o usuário criar
    setItem(REPORTS_KEY, [])
  }
}
