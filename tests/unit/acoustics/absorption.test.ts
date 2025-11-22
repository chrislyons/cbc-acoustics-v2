import { describe, it, expect } from 'vitest'
import {
  getAbsorptionCurve,
  getPanelSpec,
  calculatePanelAbsorption,
  getDrapeAbsorption,
  calculateDrapeAbsorption,
  calculatePanelCost,
  calculateTotalPanels,
} from '@/lib/acoustics/absorption'

describe('Panel Absorption Calculations', () => {
  describe('getAbsorptionCurve', () => {
    it('should return absorption curve for 2 inch panels', () => {
      const curve = getAbsorptionCurve('2_inch')

      expect(curve[125]).toBe(0.15)
      expect(curve[1000]).toBe(0.8)
      expect(curve[4000]).toBe(0.85)
    })

    it('should show increasing absorption with frequency for thin panels', () => {
      const curve = getAbsorptionCurve('2_inch')

      // 2" panels are better at high frequencies
      expect(curve[125]).toBeLessThan(curve[1000])
      expect(curve[125]).toBeLessThan(curve[4000])
    })

    it('should show better low-frequency absorption for thick panels', () => {
      const thin = getAbsorptionCurve('2_inch')
      const thick = getAbsorptionCurve('11_inch')

      // 11" panels much better at 125 Hz
      expect(thick[125]).toBeGreaterThan(thin[125])
    })

    it('should allow absorption > 1.0 for thick panels', () => {
      const curve = getAbsorptionCurve('11_inch')

      // Thick panels can have absorption > 1 due to edge effects
      expect(curve[1000]).toBeGreaterThan(1.0)
    })
  })

  describe('getPanelSpec', () => {
    it('should return complete spec for each thickness', () => {
      const spec = getPanelSpec('3_inch')

      expect(spec.thickness).toBe('3_inch')
      expect(spec.size).toBe(8) // 2'x4' = 8 sq ft
      expect(spec.cost).toBe(25)
      expect(spec.nrc).toBe(0.95)
      expect(spec.absorptionCurve).toBeDefined()
    })

    it('should show increasing cost with thickness', () => {
      const spec2 = getPanelSpec('2_inch')
      const spec3 = getPanelSpec('3_inch')
      const spec5 = getPanelSpec('5_5_inch')
      const spec11 = getPanelSpec('11_inch')

      expect(spec2.cost).toBeLessThan(spec3.cost)
      expect(spec3.cost).toBeLessThan(spec5.cost)
      expect(spec5.cost).toBeLessThan(spec11.cost)
    })

    it('should show increasing NRC with thickness', () => {
      const spec2 = getPanelSpec('2_inch')
      const spec11 = getPanelSpec('11_inch')

      expect(spec11.nrc).toBeGreaterThan(spec2.nrc)
    })
  })

  describe('calculatePanelAbsorption', () => {
    it('should calculate total absorption from panel mix', () => {
      const panelCounts = {
        '2_inch': 5,
        '5_5_inch': 10,
      }
      const roomSurfaceArea = 588.5 // Studio 8

      const absorption = calculatePanelAbsorption(panelCounts, roomSurfaceArea)

      expect(absorption[125]).toBeGreaterThan(0)
      expect(absorption[1000]).toBeGreaterThan(0)
    })

    it('should show more absorption with more panels', () => {
      const roomSurfaceArea = 588.5

      const few = calculatePanelAbsorption({ '3_inch': 5 }, roomSurfaceArea)
      const many = calculatePanelAbsorption({ '3_inch': 20 }, roomSurfaceArea)

      expect(many[500]).toBeGreaterThan(few[500])
    })

    it('should handle zero panels gracefully', () => {
      const absorption = calculatePanelAbsorption({}, 588.5)

      expect(absorption[125]).toBe(0)
      expect(absorption[1000]).toBe(0)
    })

    it('should handle mixed panel types correctly', () => {
      const panelCounts = {
        '2_inch': 3,
        '3_inch': 6,
        '5_5_inch': 12,
        '11_inch': 4,
      }
      const roomSurfaceArea = 588.5

      const absorption = calculatePanelAbsorption(panelCounts, roomSurfaceArea)

      // Should have absorption at all frequencies
      expect(absorption[125]).toBeGreaterThan(0)
      expect(absorption[250]).toBeGreaterThan(0)
      expect(absorption[500]).toBeGreaterThan(0)
      expect(absorption[1000]).toBeGreaterThan(0)
      expect(absorption[2000]).toBeGreaterThan(0)
      expect(absorption[4000]).toBeGreaterThan(0)
    })

    it('should scale absorption by room surface area', () => {
      const panelCounts = { '3_inch': 10 }

      const smallRoom = calculatePanelAbsorption(panelCounts, 300)
      const largeRoom = calculatePanelAbsorption(panelCounts, 600)

      // Same number of panels in larger room = smaller percentage absorption
      expect(largeRoom[500]).toBeLessThan(smallRoom[500])
    })
  })

  describe('getDrapeAbsorption', () => {
    it('should return drape absorption coefficients', () => {
      const drape = getDrapeAbsorption()

      expect(drape[125]).toBe(0.15)
      expect(drape[500]).toBe(0.55)
      expect(drape[1000]).toBe(0.75)
    })

    it('should show peak absorption in mid-frequencies', () => {
      const drape = getDrapeAbsorption()

      // Drapes are most effective in mid-to-high frequencies
      expect(drape[1000]).toBeGreaterThan(drape[125])
      expect(drape[2000]).toBeGreaterThan(drape[125])
    })
  })

  describe('calculateDrapeAbsorption', () => {
    it('should scale drape absorption by coverage', () => {
      const roomSurfaceArea = 588.5

      const small = calculateDrapeAbsorption(roomSurfaceArea, 20)
      const large = calculateDrapeAbsorption(roomSurfaceArea, 40)

      expect(large[500]).toBeGreaterThan(small[500])
    })

    it('should scale absorption by room size', () => {
      const drapeSize = 40

      const smallRoom = calculateDrapeAbsorption(300, drapeSize)
      const largeRoom = calculateDrapeAbsorption(600, drapeSize)

      // Same drape in larger room = smaller percentage impact
      expect(largeRoom[500]).toBeLessThan(smallRoom[500])
    })
  })

  describe('calculatePanelCost', () => {
    it('should calculate total cost correctly', () => {
      const panelCounts = {
        '2_inch': 5, // 5 * $20 = $100
        '3_inch': 10, // 10 * $25 = $250
      }

      const cost = calculatePanelCost(panelCounts)

      expect(cost).toBe(350)
    })

    it('should handle zero panels', () => {
      const cost = calculatePanelCost({})

      expect(cost).toBe(0)
    })

    it('should calculate Studio 8 cannon treatment cost', () => {
      const panelCounts = {
        '2_inch': 3, // $60
        '3_inch': 6, // $150
        '5_5_inch': 12, // $360
        '11_inch': 4, // $180
      }

      const cost = calculatePanelCost(panelCounts)

      expect(cost).toBe(750) // Total: $750
    })
  })

  describe('calculateTotalPanels', () => {
    it('should sum panel counts correctly', () => {
      const panelCounts = {
        '2_inch': 3,
        '3_inch': 6,
        '5_5_inch': 12,
        '11_inch': 4,
      }

      const total = calculateTotalPanels(panelCounts)

      expect(total).toBe(25)
    })

    it('should handle zero panels', () => {
      const total = calculateTotalPanels({})

      expect(total).toBe(0)
    })

    it('should handle partial panel types', () => {
      const panelCounts = {
        '3_inch': 5,
        '5_5_inch': 10,
      }

      const total = calculateTotalPanels(panelCounts)

      expect(total).toBe(15)
    })
  })
})