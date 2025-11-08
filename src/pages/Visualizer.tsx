import { PageLayout } from '../components/layout/PageLayout'
import { Box } from 'lucide-react'

export function Visualizer() {
  return (
    <PageLayout
      title="3D Room Visualizer"
      description="Interactive 3D visualization of Studio 8 with measurement positions"
    >
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border bg-card p-12">
        <Box className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">3D Visualization Coming in Sprint 3</h3>
        <p className="text-muted-foreground text-center max-w-md">
          This page will feature an interactive 3D model of Studio 8 using Three.js, showing measurement positions, acoustic panels, and room modes.
        </p>
      </div>
    </PageLayout>
  )
}
