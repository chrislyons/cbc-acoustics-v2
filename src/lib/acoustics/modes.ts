/**
 * Room Mode Identification Module
 *
 * Room modes (also called standing waves or resonances) are specific frequencies
 * where sound waves reinforce themselves due to room dimensions. They cause
 * uneven frequency response, especially in the low-frequency range (20-300 Hz).
 *
 * Formula: f = (c / 2) * sqrt((nx/Lx)² + (ny/Ly)² + (nz/Lz)²)
 * Where:
 * - c = speed of sound (1130 ft/s or 343 m/s)
 * - nx, ny, nz = mode orders (0, 1, 2, ...)
 * - Lx, Ly, Lz = room dimensions
 *
 * Mode Types:
 * - Axial (1D): One non-zero mode number (strongest)
 * - Tangential (2D): Two non-zero mode numbers
 * - Oblique (3D): Three non-zero mode numbers (weakest)
 *
 * References:
 * - Cox & D'Antonio: Acoustic Absorbers and Diffusers
 * - Modal density calculations
 */

import { SPEED_OF_SOUND_FT_S } from '../utils/conversions'

export interface RoomMode {
  frequency: number // Hz
  type: 'axial' | 'tangential' | 'oblique'
  axis: 'length' | 'width' | 'height' | 'mixed'
  order: [number, number, number] // [nx, ny, nz]
  strength: 'strong' | 'medium' | 'weak'
  label: string // e.g., "Axial (1,0,0)"
}

/**
 * Identify room modes for a rectangular room
 *
 * Calculates resonant frequencies based on room dimensions.
 * Axial modes (one dimension) are strongest, tangential (two dimensions)
 * are medium strength, and oblique (three dimensions) are weakest.
 *
 * @param length Room length in feet
 * @param width Room width in feet
 * @param height Room height in feet
 * @param maxFreq Maximum frequency to calculate (default: 300 Hz - bass range)
 * @param maxOrder Maximum mode order to calculate (default: 5)
 * @returns Array of room modes sorted by frequency
 */
export function identifyRoomModes(
  length: number,
  width: number,
  height: number,
  maxFreq: number = 300,
  maxOrder: number = 5
): RoomMode[] {
  const modes: RoomMode[] = []
  const c = SPEED_OF_SOUND_FT_S // 1130 ft/s

  // Calculate modes for all combinations of nx, ny, nz
  for (let nx = 0; nx <= maxOrder; nx++) {
    for (let ny = 0; ny <= maxOrder; ny++) {
      for (let nz = 0; nz <= maxOrder; nz++) {
        // Skip (0,0,0) - not a mode
        if (nx === 0 && ny === 0 && nz === 0) continue

        // Calculate frequency
        const term1 = (nx / length) ** 2
        const term2 = (ny / width) ** 2
        const term3 = (nz / height) ** 2
        const frequency = (c / 2) * Math.sqrt(term1 + term2 + term3)

        // Only include modes below maxFreq
        if (frequency > maxFreq) continue

        // Determine mode type and axis
        const nonZeroCount = [nx, ny, nz].filter(n => n > 0).length

        let type: RoomMode['type']
        let axis: RoomMode['axis']
        let strength: RoomMode['strength']

        if (nonZeroCount === 1) {
          type = 'axial'
          strength = 'strong'
          if (nx > 0) axis = 'length'
          else if (ny > 0) axis = 'width'
          else axis = 'height'
        } else if (nonZeroCount === 2) {
          type = 'tangential'
          strength = 'medium'
          axis = 'mixed'
        } else {
          type = 'oblique'
          strength = 'weak'
          axis = 'mixed'
        }

        const label = `${type.charAt(0).toUpperCase() + type.slice(1)} (${nx},${ny},${nz})`

        modes.push({
          frequency,
          type,
          axis,
          order: [nx, ny, nz],
          strength,
          label,
        })
      }
    }
  }

  // Sort by frequency
  return modes.sort((a, b) => a.frequency - b.frequency)
}

/**
 * Find modes near a specific frequency
 *
 * Useful for identifying problem frequencies in measurements.
 *
 * @param modes Array of room modes
 * @param targetFreq Target frequency (Hz)
 * @param tolerance Frequency tolerance (Hz, default: 5 Hz)
 * @returns Modes within tolerance of target frequency
 */
export function findModesNear(
  modes: RoomMode[],
  targetFreq: number,
  tolerance: number = 5
): RoomMode[] {
  return modes.filter(mode => Math.abs(mode.frequency - targetFreq) <= tolerance)
}

/**
 * Calculate modal density (number of modes per Hz)
 *
 * Modal density increases with frequency and room volume.
 * At low frequencies, modes are sparse and problematic.
 * At high frequencies, modes are dense and smooth out.
 *
 * @param modes Array of room modes
 * @param freqBand Frequency band to analyze [min, max] in Hz
 * @returns Modes per Hz in the specified band
 */
export function calculateModalDensity(modes: RoomMode[], freqBand: [number, number]): number {
  const [minFreq, maxFreq] = freqBand
  const modesInBand = modes.filter(m => m.frequency >= minFreq && m.frequency <= maxFreq)
  const bandwidth = maxFreq - minFreq

  return modesInBand.length / bandwidth
}

/**
 * Identify problematic mode clusters
 *
 * Clusters of modes at similar frequencies cause severe peaks.
 * This function finds groups of modes within a small frequency range.
 *
 * @param modes Array of room modes
 * @param clusterTolerance Frequency range for clustering (Hz, default: 10 Hz)
 * @param minClusterSize Minimum modes to constitute a cluster (default: 2)
 * @returns Array of mode clusters
 */
export function findModeClusters(
  modes: RoomMode[],
  clusterTolerance: number = 10,
  minClusterSize: number = 2
): RoomMode[][] {
  const clusters: RoomMode[][] = []
  const sortedModes = [...modes].sort((a, b) => a.frequency - b.frequency)

  let currentCluster: RoomMode[] = []

  for (let i = 0; i < sortedModes.length; i++) {
    const mode = sortedModes[i]

    if (currentCluster.length === 0) {
      currentCluster.push(mode)
    } else {
      const lastMode = currentCluster[currentCluster.length - 1]
      if (mode.frequency - lastMode.frequency <= clusterTolerance) {
        currentCluster.push(mode)
      } else {
        // End of cluster
        if (currentCluster.length >= minClusterSize) {
          clusters.push([...currentCluster])
        }
        currentCluster = [mode]
      }
    }
  }

  // Add final cluster if it qualifies
  if (currentCluster.length >= minClusterSize) {
    clusters.push(currentCluster)
  }

  return clusters
}

/**
 * Get axial modes only (strongest, most problematic)
 *
 * @param modes Array of room modes
 * @returns Axial modes only
 */
export function getAxialModes(modes: RoomMode[]): RoomMode[] {
  return modes.filter(m => m.type === 'axial')
}
