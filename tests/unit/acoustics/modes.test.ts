import { describe, it, expect } from 'vitest'
import {
  identifyRoomModes,
  findModesNear,
  calculateModalDensity,
  findModeClusters,
  getAxialModes,
} from '@/lib/acoustics/modes'
import { STUDIO_8 } from '@/lib/utils/constants'

describe('Room Mode Calculations', () => {
  describe('identifyRoomModes', () => {
    it('should identify modes for Studio 8', () => {
      const { width, depth, height } = STUDIO_8.dimensions
      const modes = identifyRoomModes(width, depth, height, 300, 5)

      expect(modes.length).toBeGreaterThan(0)
      expect(modes.every(m => m.frequency > 0)).toBe(true)
      expect(modes.every(m => m.frequency <= 300)).toBe(true)
    })

    it('should identify fundamental axial modes correctly', () => {
      const { width, depth, height } = STUDIO_8.dimensions
      const modes = identifyRoomModes(width, depth, height, 300, 5)

      // Find first-order axial modes
      const axialModes = modes.filter(m => m.type === 'axial' && m.order.filter(n => n > 0).length === 1)

      // Should have 3 fundamental modes (one per dimension)
      const fundamentals = axialModes.filter(m => m.order.reduce((sum, n) => sum + n, 0) === 1)
      expect(fundamentals.length).toBeGreaterThanOrEqual(3)
    })

    it('should classify mode types correctly', () => {
      const modes = identifyRoomModes(10, 10, 10, 200, 3)

      const axial = modes.filter(m => m.type === 'axial')
      const tangential = modes.filter(m => m.type === 'tangential')
      const oblique = modes.filter(m => m.type === 'oblique')

      // All modes should have a type
      expect(axial.length + tangential.length + oblique.length).toBe(modes.length)

      // Axial modes should have exactly one non-zero order
      axial.forEach(m => {
        const nonZeroCount = m.order.filter(n => n > 0).length
        expect(nonZeroCount).toBe(1)
      })

      // Tangential modes should have exactly two non-zero orders
      tangential.forEach(m => {
        const nonZeroCount = m.order.filter(n => n > 0).length
        expect(nonZeroCount).toBe(2)
      })

      // Oblique modes should have three non-zero orders
      oblique.forEach(m => {
        const nonZeroCount = m.order.filter(n => n > 0).length
        expect(nonZeroCount).toBe(3)
      })
    })

    it('should sort modes by frequency', () => {
      const modes = identifyRoomModes(12, 10, 8, 250, 5)

      for (let i = 1; i < modes.length; i++) {
        expect(modes[i].frequency).toBeGreaterThanOrEqual(modes[i - 1].frequency)
      }
    })

    it('should not include (0,0,0) mode', () => {
      const modes = identifyRoomModes(10, 10, 10, 100, 2)

      const zeroMode = modes.find(m => m.order[0] === 0 && m.order[1] === 0 && m.order[2] === 0)
      expect(zeroMode).toBeUndefined()
    })

    it('should respect max frequency limit', () => {
      const maxFreq = 150
      const modes = identifyRoomModes(12, 10, 8, maxFreq, 10)

      expect(modes.every(m => m.frequency <= maxFreq)).toBe(true)
    })
  })

  describe('findModesNear', () => {
    it('should find modes near target frequency', () => {
      const modes = identifyRoomModes(12, 10, 8, 300, 5)
      const targetFreq = 100
      const tolerance = 10

      const nearModes = findModesNear(modes, targetFreq, tolerance)

      nearModes.forEach(m => {
        expect(Math.abs(m.frequency - targetFreq)).toBeLessThanOrEqual(tolerance)
      })
    })

    it('should return empty array if no modes near target', () => {
      const modes = identifyRoomModes(12, 10, 8, 200, 3)
      const targetFreq = 1000 // Way above max

      const nearModes = findModesNear(modes, targetFreq, 5)

      expect(nearModes.length).toBe(0)
    })
  })

  describe('calculateModalDensity', () => {
    it('should calculate modes per Hz in frequency band', () => {
      const modes = identifyRoomModes(12, 10, 8, 300, 5)
      const density = calculateModalDensity(modes, [50, 150])

      expect(density).toBeGreaterThan(0)
      expect(density).toBeLessThan(1) // Typically < 1 mode per Hz at low frequencies
    })

    it('should be higher in high-frequency bands', () => {
      const modes = identifyRoomModes(12, 10, 8, 300, 5)

      const lowDensity = calculateModalDensity(modes, [30, 80])
      const highDensity = calculateModalDensity(modes, [200, 280])

      expect(highDensity).toBeGreaterThan(lowDensity)
    })

    it('should handle empty frequency bands', () => {
      const modes = identifyRoomModes(12, 10, 8, 100, 3)
      const density = calculateModalDensity(modes, [200, 300]) // Above max

      expect(density).toBe(0)
    })
  })

  describe('findModeClusters', () => {
    it('should identify mode clusters', () => {
      const modes = identifyRoomModes(12, 10, 8, 300, 5)
      const clusters = findModeClusters(modes, 10, 2)

      // Should find some clusters
      clusters.forEach(cluster => {
        expect(cluster.length).toBeGreaterThanOrEqual(2)

        // All modes in cluster should be within tolerance
        for (let i = 1; i < cluster.length; i++) {
          expect(cluster[i].frequency - cluster[i - 1].frequency).toBeLessThanOrEqual(10)
        }
      })
    })

    it('should respect minimum cluster size', () => {
      const modes = identifyRoomModes(12, 10, 8, 300, 5)
      const clusters = findModeClusters(modes, 10, 3)

      clusters.forEach(cluster => {
        expect(cluster.length).toBeGreaterThanOrEqual(3)
      })
    })

    it('should return empty array if no clusters found', () => {
      const modes = identifyRoomModes(100, 100, 100, 100, 1) // Very sparse modes
      const clusters = findModeClusters(modes, 1, 5) // Require 5 modes within 1 Hz

      expect(clusters.length).toBe(0)
    })
  })

  describe('getAxialModes', () => {
    it('should return only axial modes', () => {
      const modes = identifyRoomModes(12, 10, 8, 250, 5)
      const axialModes = getAxialModes(modes)

      expect(axialModes.every(m => m.type === 'axial')).toBe(true)
    })

    it('should return strongest modes', () => {
      const modes = identifyRoomModes(12, 10, 8, 250, 5)
      const axialModes = getAxialModes(modes)

      expect(axialModes.every(m => m.strength === 'strong')).toBe(true)
    })
  })
})