/**
 * RT60 (Reverberation Time) Calculation Module
 *
 * Implements Sabine and Eyring equations for calculating reverberation time.
 * RT60 is the time it takes for sound to decay by 60 dB.
 *
 * References:
 * - ISO 3382-1: Acoustics - Measurement of room acoustic parameters
 * - Sabine equation: RT60 = 0.161 * V / (S * α)
 * - Eyring equation: RT60 = 0.161 * V / (-S * ln(1 - α))
 *
 * Source: Ported from treatment_simulator.py (lines 194-236)
 */

/**
 * Calculate RT60 using the Sabine equation
 *
 * The Sabine equation is the classic formula for reverberation time,
 * suitable for rooms with relatively low absorption (α < 0.3).
 *
 * Formula: RT60 = 0.161 * V / (S * α)
 * Where:
 * - 0.161 = constant (metric) derived from sound decay physics
 * - V = room volume (cubic meters)
 * - S = total surface area (square meters)
 * - α = average absorption coefficient (0-1)
 *
 * @param volume Room volume in cubic meters
 * @param surfaceArea Total surface area in square meters
 * @param absorptionCoeff Average absorption coefficient (0-1)
 * @returns RT60 time in seconds
 * @throws Error if absorption coefficient is zero (infinite RT60)
 */
export function calculateRT60Sabine(
  volume: number,
  surfaceArea: number,
  absorptionCoeff: number
): number {
  if (absorptionCoeff <= 0) {
    throw new Error('Absorption coefficient must be greater than zero')
  }
  if (absorptionCoeff >= 1) {
    throw new Error('Absorption coefficient must be less than 1')
  }

  return (0.161 * volume) / (surfaceArea * absorptionCoeff)
}

/**
 * Calculate RT60 using the Eyring equation
 *
 * The Eyring equation is more accurate for rooms with higher absorption.
 * It accounts for the fact that sound doesn't reflect perfectly.
 *
 * Formula: RT60 = 0.161 * V / (-S * ln(1 - α))
 *
 * @param volume Room volume in cubic meters
 * @param surfaceArea Total surface area in square meters
 * @param absorptionCoeff Average absorption coefficient (0-1)
 * @returns RT60 time in seconds
 */
export function calculateRT60Eyring(
  volume: number,
  surfaceArea: number,
  absorptionCoeff: number
): number {
  if (absorptionCoeff <= 0) {
    throw new Error('Absorption coefficient must be greater than zero')
  }
  if (absorptionCoeff >= 1) {
    throw new Error('Absorption coefficient must be less than 1')
  }

  return (0.161 * volume) / (-surfaceArea * Math.log(1 - absorptionCoeff))
}

/**
 * Calculate absorption coefficient from RT60 measurement (inverse Sabine)
 *
 * Useful for deriving absorption from measured RT60 values.
 * From treatment_simulator.py lines 203-206.
 *
 * Formula: α = (0.161 * V) / (RT60 * S)
 *
 * @param rt60 Measured reverberation time in seconds
 * @param volume Room volume in cubic meters
 * @param surfaceArea Total surface area in square meters
 * @returns Average absorption coefficient (0-1)
 */
export function calculateAbsorptionFromRT60(
  rt60: number,
  volume: number,
  surfaceArea: number
): number {
  if (rt60 <= 0) {
    throw new Error('RT60 must be greater than zero')
  }

  return (0.161 * volume) / (rt60 * surfaceArea)
}

/**
 * Calculate RT60 with added acoustic panels
 *
 * This function calculates the new RT60 after adding acoustic treatment panels.
 * Ported from treatment_simulator.py calculate_rt60_with_panels (lines 194-236).
 *
 * @param currentRT60 Current RT60 values by frequency (Hz -> seconds)
 * @param volume Room volume in cubic meters
 * @param surfaceArea Total surface area in square meters
 * @param addedAbsorption Added absorption by frequency (Hz -> absorption units)
 * @param drapeRemoval Absorption lost from drape removal (Hz -> absorption units)
 * @returns New RT60 values by frequency
 */
export function calculateRT60WithPanels(
  currentRT60: Record<number, number>,
  volume: number,
  surfaceArea: number,
  addedAbsorption: Record<number, number>,
  drapeRemoval: Record<number, number> = {}
): Record<number, number> {
  const newRT60: Record<number, number> = {}

  for (const [freqStr, rt60] of Object.entries(currentRT60)) {
    const freq = Number(freqStr)

    // Calculate current absorption coefficient from RT60
    const currentAlpha = calculateAbsorptionFromRT60(rt60, volume, surfaceArea)

    // Add panel absorption
    const addedAlpha = addedAbsorption[freq] || 0

    // Subtract drape absorption if removing drape
    const drapeAlpha = drapeRemoval[freq] || 0

    // New total absorption coefficient
    let newAlpha = currentAlpha + addedAlpha - drapeAlpha

    // Clamp to realistic range (0.01 to 0.99)
    newAlpha = Math.max(0.01, Math.min(0.99, newAlpha))

    // Calculate new RT60
    newRT60[freq] = calculateRT60Sabine(volume, surfaceArea, newAlpha)
  }

  return newRT60
}

/**
 * Calculate average RT60 across frequency bands
 *
 * @param rt60ByFreq RT60 values by frequency
 * @returns Average RT60 in seconds
 */
export function calculateAverageRT60(rt60ByFreq: Record<number, number>): number {
  const values = Object.values(rt60ByFreq)
  return values.reduce((sum, val) => sum + val, 0) / values.length
}
