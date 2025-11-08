import { PageLayout } from '../components/layout/PageLayout'
import { ExternalLink } from 'lucide-react'

export function About() {
  return (
    <PageLayout
      title="About This Project"
      description="Methodology, standards, and technical details"
    >
      <div className="space-y-6">
        {/* Overview */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Project Overview</h2>
          <p className="text-muted-foreground mb-4">
            This dashboard provides interactive acoustic analysis for CBC Radio 3 Studio 8,
            a broadcast control room in Vancouver. Based on real measurements taken on July 15, 2025
            using Smaart acoustic measurement software, it helps optimize acoustic treatment to meet
            broadcast standards while staying within budget constraints.
          </p>
          <p className="text-muted-foreground">
            The original implementation was a Python/Streamlit application. This v2 rebuild uses
            modern web technologies for improved performance, interactivity, and mobile support.
          </p>
        </div>

        {/* Measurement Details */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Measurement Details</h2>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Date:</span>
              <span>July 15, 2025</span>

              <span className="font-medium">Software:</span>
              <span>Smaart v8</span>

              <span className="font-medium">Positions:</span>
              <span>7 measurement points (HostA-C, Pos1-4)</span>

              <span className="font-medium">Frequency Range:</span>
              <span>20 Hz - 20 kHz (1/3 octave bands)</span>

              <span className="font-medium">Reference Position:</span>
              <span>HostA (4" from source)</span>

              <span className="font-medium">Room Dimensions:</span>
              <span>12.3' × 10.6' × 8.2' (1,068 ft³)</span>
            </div>
          </div>
        </div>

        {/* Standards */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Broadcast Standards</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-1">ITU-R BS.1116</h3>
              <p className="text-sm text-muted-foreground">
                Methods for the subjective assessment of small impairments in audio systems. Defines
                critical listening room requirements for broadcast.
              </p>
              <a
                href="https://www.itu.int/rec/R-REC-BS.1116/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center mt-1"
              >
                View Standard <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            <div>
              <h3 className="font-medium mb-1">EBU R128</h3>
              <p className="text-sm text-muted-foreground">
                Loudness normalization and permitted maximum level of audio signals. Ensures
                consistent broadcast audio quality.
              </p>
              <a
                href="https://tech.ebu.ch/docs/r/r128.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center mt-1"
              >
                View Standard <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            <div>
              <h3 className="font-medium mb-1">IEC 60268-16</h3>
              <p className="text-sm text-muted-foreground">
                Sound system equipment - Objective rating of speech intelligibility by speech
                transmission index. Used for STI calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Stack */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Technical Stack</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <h3 className="font-medium mb-1">Frontend</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Vite 6 + React 18</li>
                <li>• TypeScript 5</li>
                <li>• Tailwind CSS 3</li>
                <li>• React Router 6</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-1">Visualization</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>• Three.js (3D models)</li>
                <li>• Recharts (2D charts)</li>
                <li>• React Three Fiber</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Credits</h2>
          <p className="text-muted-foreground mb-2">
            Original measurements and analysis: CBC Radio 3 Engineering
          </p>
          <p className="text-muted-foreground mb-2">Dashboard development: Chris Lyons</p>
          <p className="text-sm text-muted-foreground">
            Built with Claude Code for autonomous sprint-based development
          </p>
        </div>

        {/* Links */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-3">Links</h2>
          <div className="space-y-2">
            <a
              href="https://github.com/chrislyons/cbc-acoustics-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              GitHub Repository <ExternalLink className="ml-1 h-4 w-4" />
            </a>
            <br />
            <a
              href="https://cbc-acoustics-dashboard.streamlit.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              Original v1 Dashboard <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
