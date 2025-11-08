import { PageLayout } from '../components/layout/PageLayout'
import { BarChart3 } from 'lucide-react'

export function Frequency() {
  return (
    <PageLayout
      title="Frequency Analysis"
      description="Frequency response curves, modal analysis, and position heatmaps"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border bg-card p-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Frequency Analysis Coming in Sprint 3</h3>
        <p className="text-muted-foreground text-center max-w-md">
          This page will display frequency response curves, identify room modes, and show position-based heatmaps using Recharts.
        </p>
      </div>
    </PageLayout>
  )
}
