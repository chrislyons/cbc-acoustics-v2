/**
 * Acoustic Panel Absorption Module
 *
 * Defines absorption characteristics for different panel thicknesses
 * and calculates total absorption from panel configurations.
 *
 * Panel Types:
 * - 2" panels: High-frequency absorption (1kHz+), budget option
 * - 3" panels: Mid-to-high frequency (500Hz+), good all-around
 * - 5.5" panels: Broadband absorption (125Hz+), excellent low-freq
 * - 11" panels: Superior bass traps (63Hz+), maximum low-freq control
 *
 * Source: Ported from treatment_simulator.py (lines 175-192)
 */

export type PanelThickness = '2_inch' | '3_inch' | '5_5_inch' | '11_inch'

export interface PanelSpec {
  thickness: PanelThickness
  size: number // square feet (typically 2'x4' = 8 sq ft)
  nrc: number // Noise Reduction Coefficient (average absorption)
  cost: number // dollars per panel
  absorptionCurve: Record<number, number> // frequency -> absorption coefficient
}

/**
 * Get frequency-dependent absorption coefficients for a panel thickness
 *
 * These curves are based on manufacturer specifications for mineral wool
 * acoustic panels with fabric wrapping.
 *
 * From treatment_simulator.py lines 175-192 (_get_absorption_curve).
 *
 * @param thickness Panel thickness
 * @returns Absorption coefficient by frequency (0-1+, can exceed 1)
 */
export function getAbsorptionCurve(thickness: PanelThickness): Record<number, number> {
  const curves: Record<PanelThickness, Record<number, number>> = {
    '2_inch': {
      125: 0.15,
      250: 0.4,
      500: 0.75,
      1000: 0.8,
      2000: 0.85,
      4000: 0.85,
    },
    '3_inch': {
      125: 0.25,
      250: 0.6,
      500: 0.9,
      1000: 0.95,
      2000: 0.98,
      4000: 0.98,
    },
    '5_5_inch': {
      125: 0.45,
      250: 0.8,
      500: 1.05,
      1000: 1.15,
      2000: 1.18,
      4000: 1.15,
    },
    '11_inch': {
      125: 0.75,
      250: 1.1,
      500: 1.25,
      1000: 1.35,
      2000: 1.3,
      4000: 1.2,
    },
  }

  return curves[thickness]
}

/**
 * Get panel specifications
 *
 * From treatment_simulator.py lines 23-49 (panel_specs).
 *
 * @param thickness Panel thickness
 * @returns Complete panel specification
 */
export function getPanelSpec(thickness: PanelThickness): PanelSpec {
  const specs: Record<PanelThickness, PanelSpec> = {
    '2_inch': {
      thickness: '2_inch',
      size: 8, // 2'x4' = 8 sq ft
      nrc: 0.8,
      cost: 20,
      absorptionCurve: getAbsorptionCurve('2_inch'),
    },
    '3_inch': {
      thickness: '3_inch',
      size: 8,
      nrc: 0.95,
      cost: 25,
      absorptionCurve: getAbsorptionCurve('3_inch'),
    },
    '5_5_inch': {
      thickness: '5_5_inch',
      size: 8,
      nrc: 1.15,
      cost: 30,
      absorptionCurve: getAbsorptionCurve('5_5_inch'),
    },
    '11_inch': {
      thickness: '11_inch',
      size: 8,
      nrc: 1.35,
      cost: 45,
      absorptionCurve: getAbsorptionCurve('11_inch'),
    },
  }

  return specs[thickness]
}

/**
 * Calculate total absorption added by acoustic panels
 *
 * From treatment_simulator.py lines 208-218 (calculate_rt60_with_panels).
 *
 * @param panelCounts Number of panels by thickness
 * @param roomSurfaceArea Total room surface area (sq ft)
 * @returns Absorption coefficient added by frequency
 */
export function calculatePanelAbsorption(
  panelCounts: Partial<Record<PanelThickness, number>>,
  roomSurfaceArea: number
): Record<number, number> {
  // Standard frequency bands
  const frequencies = [125, 250, 500, 1000, 2000, 4000]

  const totalAbsorption: Record<number, number> = {}
  frequencies.forEach(freq => {
    totalAbsorption[freq] = 0
  })

  // Sum absorption from all panel types
  for (const [thickness, count] of Object.entries(panelCounts)) {
    if (!count || count <= 0) continue

    const spec = getPanelSpec(thickness as PanelThickness)
    const panelAbsorption = spec.absorptionCurve

    for (const freq of frequencies) {
      const alpha = panelAbsorption[freq] || 0
      const addedAbsorption = (count * spec.size * alpha) / roomSurfaceArea
      totalAbsorption[freq] += addedAbsorption
    }
  }

  return totalAbsorption
}

/**
 * Get drape absorption coefficients
 *
 * Absorption from velvet drapes (30-40 lbs, lighting grid).
 * From treatment_simulator.py lines 75-100 (_load_drape_data fallback).
 *
 * @returns Absorption coefficient by frequency
 */
export function getDrapeAbsorption(): Record<number, number> {
  return {
    125: 0.15,
    250: 0.3,
    500: 0.55,
    1000: 0.75,
    2000: 0.8,
    4000: 0.7,
  }
}

/**
 * Calculate drape absorption impact
 *
 * @param roomSurfaceArea Total room surface area (sq ft)
 * @param drapeSize Drape coverage (sq ft, default: 40)
 * @returns Absorption coefficient by frequency
 */
export function calculateDrapeAbsorption(
  roomSurfaceArea: number,
  drapeSize: number = 40
): Record<number, number> {
  const drapeCoeffs = getDrapeAbsorption()
  const result: Record<number, number> = {}

  for (const [freqStr, coeff] of Object.entries(drapeCoeffs)) {
    const freq = Number(freqStr)
    result[freq] = (coeff * drapeSize) / roomSurfaceArea
  }

  return result
}

/**
 * Calculate total panel cost
 *
 * @param panelCounts Number of panels by thickness
 * @returns Total cost in dollars
 */
export function calculatePanelCost(
  panelCounts: Partial<Record<PanelThickness, number>>
): number {
  let total = 0

  for (const [thickness, count] of Object.entries(panelCounts)) {
    if (!count || count <= 0) continue
    const spec = getPanelSpec(thickness as PanelThickness)
    total += spec.cost * count
  }

  return total
}

/**
 * Calculate total number of panels
 *
 * @param panelCounts Number of panels by thickness
 * @returns Total panel count
 */
export function calculateTotalPanels(
  panelCounts: Partial<Record<PanelThickness, number>>
): number {
  return Object.values(panelCounts).reduce((sum, count) => sum + (count || 0), 0)
}
