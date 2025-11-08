/**
 * STI (Speech Transmission Index) Calculation Module
 *
 * STI is a measure of speech intelligibility ranging from 0 to 1.
 * - 0.0-0.3: Bad
 * - 0.3-0.45: Poor
 * - 0.45-0.6: Fair
 * - 0.6-0.75: Good
 * - 0.75-1.0: Excellent
 *
 * References:
 * - IEC 60268-16: Sound system equipment - Part 16: Objective rating of speech intelligibility
 *
 * Source: Ported from treatment_simulator.py (lines 238-251)
 */

/**
 * Calculate STI improvement based on RT60 reduction
 *
 * This uses an empirical relationship: STI improves as RT60 approaches
 * the target value. The improvement is conservative (70% of theoretical maximum).
 *
 * From treatment_simulator.py lines 238-251.
 *
 * @param currentSTI Current Speech Transmission Index (0-1)
 * @param targetSTI Target STI (typically 0.75 for broadcast)
 * @param rt60Improvement RT60 reduction in seconds (current - new)
 * @returns Predicted new STI value (0-1)
 */
export function calculateSTIImprovement(
  currentSTI: number,
  targetSTI: number,
  rt60Improvement: number
): number {
  // Normalize RT60 improvement to 0.3s reference (0 to 1 factor)
  const rt60Factor = Math.min(1.0, rt60Improvement / 0.3)

  // STI improvement (conservative: 70% of theoretical maximum)
  const stiDelta = rt60Factor * (targetSTI - currentSTI) * 0.7

  // Return new STI, capped at target
  return Math.min(targetSTI, currentSTI + stiDelta)
}

/**
 * Calculate STI from RT60 values
 *
 * Simplified empirical relationship between RT60 and STI.
 * Lower RT60 generally means higher STI (better intelligibility).
 *
 * @param avgRT60 Average RT60 across frequencies (seconds)
 * @param targetRT60 Target RT60 for optimal intelligibility (seconds)
 * @returns Estimated STI value (0-1)
 */
export function estimateSTIFromRT60(avgRT60: number, targetRT60: number = 0.4): number {
  // Empirical model: STI degrades as RT60 increases above target
  if (avgRT60 <= targetRT60) {
    return 0.95 // Excellent intelligibility
  }

  // Linear degradation model (simplified)
  const rt60Ratio = avgRT60 / targetRT60
  const sti = 0.95 / rt60Ratio

  // Clamp to valid range
  return Math.max(0.3, Math.min(0.95, sti))
}

/**
 * Calculate position-specific STI improvement
 *
 * Different positions in the room benefit differently from acoustic treatment.
 * Corners typically see more improvement than center positions.
 *
 * From treatment_simulator.py lines 575-611 (position_improvement_heatmap).
 *
 * @param currentSTI Current STI at this position
 * @param baseImprovement Base improvement factor from RT60 reduction
 * @param positionType Type of position: 'corner', 'talent', or 'general'
 * @returns Predicted new STI for this position
 */
export function calculatePositionSTI(
  currentSTI: number,
  baseImprovement: number,
  positionType: 'corner' | 'talent' | 'general' = 'general'
): number {
  // Position-specific benefit factors
  const positionFactors = {
    corner: 1.3, // Corners benefit more from treatment (30% boost)
    talent: 1.2, // Key positions get priority benefit (20% boost)
    general: 1.0, // Standard benefit
  }

  const factor = positionFactors[positionType]
  const stiImprovement = baseImprovement * factor

  // New STI, capped at 0.95 (realistic maximum)
  return Math.min(0.95, currentSTI + stiImprovement)
}

/**
 * Classify STI quality rating
 *
 * @param sti Speech Transmission Index (0-1)
 * @returns Quality rating string
 */
export function classifySTI(sti: number): string {
  if (sti >= 0.75) return 'Excellent'
  if (sti >= 0.6) return 'Good'
  if (sti >= 0.45) return 'Fair'
  if (sti >= 0.3) return 'Poor'
  return 'Bad'
}
