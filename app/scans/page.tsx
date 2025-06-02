import { getScans } from "@/lib/scans"
import ScansClientPage from "./client-page"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ScansPage() {
  const scans = await getScans()
  return <ScansClientPage initialScans={scans} />
}
