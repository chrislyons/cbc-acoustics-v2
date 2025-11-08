import { PageLayout } from '../components/layout/PageLayout'
import { useAcoustics } from '../context/AcousticsContext'
import { calculateAverageRT60, classifySTI } from '../lib/acoustics'
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/utils/cn'

export function Dashboard() {
  const { currentRT60, predictedRT60, currentSTI, predictedSTI, totalPanels, totalCost } =
    useAcoustics()

  const avgCurrentRT60 = calculateAverageRT60(currentRT60)
  const avgPredictedRT60 = calculateAverageRT60(predictedRT60)
  const rt60Improvement = ((avgCurrentRT60 - avgPredictedRT60) / avgCurrentRT60) * 100
  const stiImprovement = ((predictedSTI - currentSTI) / currentSTI) * 100

  const stiQuality = classifySTI(predictedSTI)

  return (
    <PageLayout
      title="CBC Studio 8 Acoustics Dashboard"
      description="Interactive acoustic analysis and treatment optimization"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Current RT60 */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Current RT60</h3>
          </div>
          <div className="text-2xl font-bold">{avgCurrentRT60.toFixed(2)}s</div>
          <p className="text-xs text-muted-foreground mt-1">Measured baseline</p>
        </div>

        {/* Predicted RT60 */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Predicted RT60</h3>
            {rt60Improvement > 0 && <TrendingDown className="h-4 w-4 text-green-500" />}
          </div>
          <div className="text-2xl font-bold">{avgPredictedRT60.toFixed(2)}s</div>
          <p className="text-xs text-green-600 mt-1">
            {rt60Improvement.toFixed(1)}% improvement
          </p>
        </div>

        {/* STI */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Speech Clarity (STI)</h3>
            {stiImprovement > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
          </div>
          <div className="text-2xl font-bold">{predictedSTI.toFixed(2)}</div>
          <p
            className={cn(
              'text-xs mt-1 font-medium',
              stiQuality === 'Excellent' && 'text-green-600',
              stiQuality === 'Good' && 'text-blue-600',
              stiQuality === 'Fair' && 'text-yellow-600',
              stiQuality === 'Poor' && 'text-red-600'
            )}
          >
            {stiQuality} ({stiImprovement > 0 ? '+' : ''}
            {stiImprovement.toFixed(1)}%)
          </p>
        </div>

        {/* Treatment Cost */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Treatment Cost</h3>
          </div>
          <div className="text-2xl font-bold">${totalCost}</div>
          <p className="text-xs text-muted-foreground mt-1">{totalPanels} panels total</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Link
          to="/visualizer"
          className="group rounded-lg border bg-card p-6 hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2 group-hover:text-primary">3D Room Visualizer</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Explore the room model and measurement positions in 3D space
          </p>
          <div className="flex items-center text-sm text-primary">
            View Visualizer <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </Link>

        <Link
          to="/frequency"
          className="group rounded-lg border bg-card p-6 hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2 group-hover:text-primary">Frequency Analysis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Analyze frequency response and identify room modes
          </p>
          <div className="flex items-center text-sm text-primary">
            View Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </Link>

        <Link
          to="/simulator"
          className="group rounded-lg border bg-card p-6 hover:border-primary transition-colors"
        >
          <h3 className="font-semibold mb-2 group-hover:text-primary">Treatment Simulator</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Design acoustic treatment and predict improvements
          </p>
          <div className="flex items-center text-sm text-primary">
            Open Simulator <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Project Info */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">About This Project</h2>
        <p className="text-muted-foreground mb-4">
          This dashboard provides interactive acoustic analysis for CBC Radio 3 Studio 8. Based on
          real measurements from July 15, 2025, it helps optimize acoustic treatment within budget
          constraints while meeting broadcast standards (ITU-R BS.1116, EBU R128).
        </p>
        <Link to="/about" className="text-primary hover:underline">
          Learn more about the methodology →
        </Link>
      </div>
    </PageLayout>
  )
}
