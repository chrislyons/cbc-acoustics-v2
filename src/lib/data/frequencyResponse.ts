/**
 * Frequency response data generation
 * Based on measured RT60 values and room characteristics
 */

import { STUDIO_8 } from '../utils/constants'

/**
 * Get room modes for modal analysis overlay
 * Based on room dimensions: L=12.3', W=10.6', H=8.2'
 * Formula: f = (c/2) * sqrt((nx/L)^2 + (ny/W)^2 + (nz/H)^2)
 * where c = 1130 ft/s (speed of sound)
 */
export interface RoomMode {
  frequency: number
  type: 'axial' | 'tangential' | 'oblique'
  axis: string
  label: string
}

export function getRoomModes(): RoomMode[] {
  const c = 1130 // ft/s
  const { width: L, depth: W, height: H } = STUDIO_8.dimensions
  const modes: RoomMode[] = []

  // Axial modes (one dimension)
  const axialModes = [
    // Length modes (nx, 0, 0)
    { n: 1, dim: L, axis: 'Length', dimName: 'L' },
    { n: 2, dim: L, axis: 'Length', dimName: 'L' },
    { n: 3, dim: L, axis: 'Length', dimName: 'L' },
    // Width modes (0, ny, 0)
    { n: 1, dim: W, axis: 'Width', dimName: 'W' },
    { n: 2, dim: W, axis: 'Width', dimName: 'W' },
    { n: 3, dim: W, axis: 'Width', dimName: 'W' },
    // Height modes (0, 0, nz)
    { n: 1, dim: H, axis: 'Height', dimName: 'H' },
    { n: 2, dim: H, axis: 'Height', dimName: 'H' },
    { n: 3, dim: H, axis: 'Height', dimName: 'H' },
  ]

  axialModes.forEach(({ n, dim, axis, dimName }) => {
    const freq = (c / 2) * (n / dim)
    if (freq <= 500) {
      // Only show low-frequency modes (most problematic)
      modes.push({
        frequency: Math.round(freq * 10) / 10,
        type: 'axial',
        axis,
        label: `${n}${dimName}`,
      })
    }
  })

  // Tangential modes (two dimensions) - first few important ones
  const tangentialModes = [
    { nx: 1, ny: 1, nz: 0, label: '1L-1W' },
    { nx: 1, ny: 0, nz: 1, label: '1L-1H' },
    { nx: 0, ny: 1, nz: 1, label: '1W-1H' },
    { nx: 2, ny: 1, nz: 0, label: '2L-1W' },
    { nx: 1, ny: 2, nz: 0, label: '1L-2W' },
  ]

  tangentialModes.forEach(({ nx, ny, nz, label }) => {
    const freq =
      (c / 2) * Math.sqrt(Math.pow(nx / L, 2) + Math.pow(ny / W, 2) + Math.pow(nz / H, 2))
    if (freq <= 500) {
      modes.push({
        frequency: Math.round(freq * 10) / 10,
        type: 'tangential',
        axis: label,
        label,
      })
    }
  })

  // Sort by frequency
  return modes.sort((a, b) => a.frequency - b.frequency)
}
