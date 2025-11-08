import { describe, it, expect } from 'vitest'
import {
  calculateSTIImprovement,
  estimateSTIFromRT60,
  calculatePositionSTI,
  classifySTI,
} from '@/lib/acoustics/sti'

describe('STI Calculations', () => {
  describe('calculateSTIImprovement', () => {
    it('should improve STI with RT60 reduction', () => {
      const currentSTI = 0.67
      const targetSTI = 0.75
      const rt60Improvement = 0.3 // 0.3s reduction

      const newSTI = calculateSTIImprovement(currentSTI, targetSTI, rt60Improvement)

      expect(newSTI).toBeGreaterThan(currentSTI)
      expect(newSTI).toBeLessThanOrEqual(targetSTI)
    })

    it('should not exceed target STI', () => {
      const currentSTI = 0.67
      const targetSTI = 0.75
      const rt60Improvement = 1.0 // Massive improvement

      const newSTI = calculateSTIImprovement(currentSTI, targetSTI, rt60Improvement)

      expect(newSTI).toBeLessThanOrEqual(targetSTI)
    })

    it('should provide conservative improvement (70% of theoretical)', () => {
      const currentSTI = 0.5
      const targetSTI = 0.8
      const rt60Improvement = 0.3

      const newSTI = calculateSTIImprovement(currentSTI, targetSTI, rt60Improvement)

      // Improvement should be less than full theoretical (0.8 - 0.5 = 0.3)
      const actualImprovement = newSTI - currentSTI
      const theoreticalMax = targetSTI - currentSTI

      expect(actualImprovement).toBeLessThan(theoreticalMax)
    })

    it('should scale with RT60 improvement amount', () => {
      const currentSTI = 0.6
      const targetSTI = 0.75

      const smallImprovement = calculateSTIImprovement(currentSTI, targetSTI, 0.1)
      const largeImprovement = calculateSTIImprovement(currentSTI, targetSTI, 0.3)

      expect(largeImprovement).toBeGreaterThan(smallImprovement)
    })
  })

  describe('estimateSTIFromRT60', () => {
    it('should give excellent STI for low RT60', () => {
      const rt60 = 0.3 // At target
      const sti = estimateSTIFromRT60(rt60, 0.3)

      expect(sti).toBeGreaterThanOrEqual(0.9)
    })

    it('should degrade STI for high RT60', () => {
      const goodRT60 = 0.4
      const badRT60 = 0.9

      const goodSTI = estimateSTIFromRT60(goodRT60, 0.4)
      const badSTI = estimateSTIFromRT60(badRT60, 0.4)

      expect(goodSTI).toBeGreaterThan(badSTI)
    })

    it('should never go below minimum STI', () => {
      const extremeRT60 = 5.0 // Very reverberant
      const sti = estimateSTIFromRT60(extremeRT60, 0.4)

      expect(sti).toBeGreaterThanOrEqual(0.3)
    })

    it('should never exceed maximum STI', () => {
      const perfectRT60 = 0.1 // Dead room
      const sti = estimateSTIFromRT60(perfectRT60, 0.4)

      expect(sti).toBeLessThanOrEqual(0.95)
    })
  })

  describe('calculatePositionSTI', () => {
    it('should give corner positions more improvement', () => {
      const currentSTI = 0.6
      const baseImprovement = 0.1

      const generalSTI = calculatePositionSTI(currentSTI, baseImprovement, 'general')
      const cornerSTI = calculatePositionSTI(currentSTI, baseImprovement, 'corner')

      expect(cornerSTI).toBeGreaterThan(generalSTI)
    })

    it('should give talent positions priority improvement', () => {
      const currentSTI = 0.6
      const baseImprovement = 0.1

      const generalSTI = calculatePositionSTI(currentSTI, baseImprovement, 'general')
      const talentSTI = calculatePositionSTI(currentSTI, baseImprovement, 'talent')

      expect(talentSTI).toBeGreaterThan(generalSTI)
    })

    it('should not exceed maximum STI of 0.95', () => {
      const currentSTI = 0.8
      const baseImprovement = 0.5 // Large improvement

      const cornerSTI = calculatePositionSTI(currentSTI, baseImprovement, 'corner')

      expect(cornerSTI).toBeLessThanOrEqual(0.95)
    })

    it('should apply correct position factors', () => {
      const currentSTI = 0.5
      const baseImprovement = 0.1

      const generalSTI = calculatePositionSTI(currentSTI, baseImprovement, 'general')
      const talentSTI = calculatePositionSTI(currentSTI, baseImprovement, 'talent')
      const cornerSTI = calculatePositionSTI(currentSTI, baseImprovement, 'corner')

      // Corner should be best (1.3x), talent second (1.2x), general baseline (1.0x)
      expect(cornerSTI).toBeGreaterThan(talentSTI)
      expect(talentSTI).toBeGreaterThan(generalSTI)
    })
  })

  describe('classifySTI', () => {
    it('should classify excellent STI', () => {
      expect(classifySTI(0.85)).toBe('Excellent')
      expect(classifySTI(0.75)).toBe('Excellent')
    })

    it('should classify good STI', () => {
      expect(classifySTI(0.7)).toBe('Good')
      expect(classifySTI(0.6)).toBe('Good')
    })

    it('should classify fair STI', () => {
      expect(classifySTI(0.55)).toBe('Fair')
      expect(classifySTI(0.45)).toBe('Fair')
    })

    it('should classify poor STI', () => {
      expect(classifySTI(0.4)).toBe('Poor')
      expect(classifySTI(0.3)).toBe('Poor')
    })

    it('should classify bad STI', () => {
      expect(classifySTI(0.25)).toBe('Bad')
      expect(classifySTI(0.1)).toBe('Bad')
    })
  })
})
