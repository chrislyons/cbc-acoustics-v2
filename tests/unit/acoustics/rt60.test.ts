import { describe, it, expect } from 'vitest'
import {
  calculateRT60Sabine,
  calculateRT60Eyring,
  calculateAbsorptionFromRT60,
  calculateRT60WithPanels,
  calculateAverageRT60,
} from '@/lib/acoustics/rt60'
import { STUDIO_8 } from '@/lib/utils/constants'
import { CONVERSIONS } from '@/lib/utils/conversions'

describe('RT60 Calculations', () => {
  describe('calculateRT60Sabine', () => {
    it('should calculate RT60 for Studio 8 baseline correctly', () => {
      // Studio 8 dimensions in metric
      const volume = STUDIO_8.volume * CONVERSIONS.cubicFeetToMeters // ~30.24 m³
      const surfaceArea = STUDIO_8.surfaceArea * CONVERSIONS.squareFeetToMeters // ~54.66 m²

      // For measured RT60 of 0.92s at 250 Hz, calculate expected absorption
      const measuredRT60 = 0.92
      const expectedAlpha = calculateAbsorptionFromRT60(measuredRT60, volume, surfaceArea)

      // Recalculate RT60 from absorption (should match within tolerance)
      const calculatedRT60 = calculateRT60Sabine(volume, surfaceArea, expectedAlpha)

      expect(calculatedRT60).toBeCloseTo(measuredRT60, 2)
    })

    it('should throw error for zero absorption coefficient', () => {
      expect(() => calculateRT60Sabine(100, 200, 0)).toThrow(
        'Absorption coefficient must be greater than zero'
      )
    })

    it('should throw error for absorption coefficient >= 1', () => {
      expect(() => calculateRT60Sabine(100, 200, 1.0)).toThrow(
        'Absorption coefficient must be less than 1'
      )
    })

    it('should calculate higher RT60 for lower absorption', () => {
      const rt60Low = calculateRT60Sabine(100, 200, 0.1)
      const rt60High = calculateRT60Sabine(100, 200, 0.3)

      expect(rt60Low).toBeGreaterThan(rt60High)
    })
  })

  describe('calculateRT60Eyring', () => {
    it('should calculate RT60 using Eyring equation', () => {
      const volume = 100
      const surfaceArea = 200
      const alpha = 0.5

      const rt60 = calculateRT60Eyring(volume, surfaceArea, alpha)

      expect(rt60).toBeGreaterThan(0)
      expect(rt60).toBeLessThan(10) // Sanity check
    })

    it('should give similar results to Sabine for low absorption', () => {
      const volume = 100
      const surfaceArea = 200
      const alpha = 0.15 // Low absorption

      const sabine = calculateRT60Sabine(volume, surfaceArea, alpha)
      const eyring = calculateRT60Eyring(volume, surfaceArea, alpha)

      // Should be within 15% for low absorption
      const difference = Math.abs(sabine - eyring) / sabine
      expect(difference).toBeLessThan(0.15)
    })
  })

  describe('calculateAbsorptionFromRT60', () => {
    it('should calculate absorption coefficient from measured RT60', () => {
      const rt60 = 0.92 // Studio 8 baseline
      const volume = STUDIO_8.volume * CONVERSIONS.cubicFeetToMeters
      const surfaceArea = STUDIO_8.surfaceArea * CONVERSIONS.squareFeetToMeters

      const alpha = calculateAbsorptionFromRT60(rt60, volume, surfaceArea)

      expect(alpha).toBeGreaterThan(0)
      expect(alpha).toBeLessThan(1)
    })

    it('should be inverse of Sabine equation', () => {
      const volume = 100
      const surfaceArea = 200
      const originalAlpha = 0.25

      // Calculate RT60 from alpha
      const rt60 = calculateRT60Sabine(volume, surfaceArea, originalAlpha)

      // Calculate alpha back from RT60
      const derivedAlpha = calculateAbsorptionFromRT60(rt60, volume, surfaceArea)

      expect(derivedAlpha).toBeCloseTo(originalAlpha, 6)
    })

    it('should throw error for zero RT60', () => {
      expect(() => calculateAbsorptionFromRT60(0, 100, 200)).toThrow(
        'RT60 must be greater than zero'
      )
    })
  })

  describe('calculateRT60WithPanels', () => {
    it('should reduce RT60 when panels are added', () => {
      const currentRT60 = {
        125: 0.85,
        250: 0.92,
        500: 0.78,
        1000: 0.71,
      }

      const volume = STUDIO_8.volume * CONVERSIONS.cubicFeetToMeters
      const surfaceArea = STUDIO_8.surfaceArea * CONVERSIONS.squareFeetToMeters

      // Add significant absorption
      const addedAbsorption = {
        125: 0.1,
        250: 0.15,
        500: 0.2,
        1000: 0.2,
      }

      const newRT60 = calculateRT60WithPanels(
        currentRT60,
        volume,
        surfaceArea,
        addedAbsorption
      )

      // All frequencies should have reduced RT60
      expect(newRT60[125]).toBeLessThan(currentRT60[125])
      expect(newRT60[250]).toBeLessThan(currentRT60[250])
      expect(newRT60[500]).toBeLessThan(currentRT60[500])
      expect(newRT60[1000]).toBeLessThan(currentRT60[1000])
    })

    it('should increase RT60 when drape is removed (no added panels)', () => {
      const currentRT60 = {
        250: 0.92,
        500: 0.78,
      }

      const volume = STUDIO_8.volume * CONVERSIONS.cubicFeetToMeters
      const surfaceArea = STUDIO_8.surfaceArea * CONVERSIONS.squareFeetToMeters

      const drapeRemoval = {
        250: 0.05, // Losing absorption
        500: 0.08,
      }

      const newRT60 = calculateRT60WithPanels(currentRT60, volume, surfaceArea, {}, drapeRemoval)

      // RT60 should increase (worse) when absorption is removed
      expect(newRT60[250]).toBeGreaterThan(currentRT60[250])
      expect(newRT60[500]).toBeGreaterThan(currentRT60[500])
    })

    it('should clamp absorption coefficients to realistic range', () => {
      const currentRT60 = { 1000: 0.5 }
      const volume = 100
      const surfaceArea = 200

      // Try to add excessive absorption
      const addedAbsorption = { 1000: 2.0 } // Way too much

      const newRT60 = calculateRT60WithPanels(
        currentRT60,
        volume,
        surfaceArea,
        addedAbsorption
      )

      // Should still produce valid RT60 (not infinity or negative)
      expect(newRT60[1000]).toBeGreaterThan(0)
      expect(newRT60[1000]).toBeLessThan(currentRT60[1000])
    })
  })

  describe('calculateAverageRT60', () => {
    it('should calculate correct average', () => {
      const rt60ByFreq = {
        125: 0.8,
        250: 0.9,
        500: 0.7,
        1000: 0.6,
      }

      const avg = calculateAverageRT60(rt60ByFreq)
      const expected = (0.8 + 0.9 + 0.7 + 0.6) / 4

      expect(avg).toBe(expected)
    })

    it('should match Studio 8 baseline average', () => {
      const avg = calculateAverageRT60(STUDIO_8.rt60ByFreq)

      // Studio 8 measured average is 0.75s
      expect(avg).toBeCloseTo(0.75, 1)
    })
  })
})
