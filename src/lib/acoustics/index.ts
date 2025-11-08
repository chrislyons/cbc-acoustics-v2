/**
 * Acoustics Calculation Library - Public API
 *
 * Exports all acoustics calculation functions for use throughout the application.
 *
 * Modules:
 * - RT60: Reverberation time calculations (Sabine, Eyring equations)
 * - STI: Speech Transmission Index (intelligibility metrics)
 * - Modes: Room mode identification and analysis
 * - Absorption: Acoustic panel absorption characteristics
 */

// RT60 calculations
export {
  calculateRT60Sabine,
  calculateRT60Eyring,
  calculateAbsorptionFromRT60,
  calculateRT60WithPanels,
  calculateAverageRT60,
} from './rt60'

// STI calculations
export {
  calculateSTIImprovement,
  estimateSTIFromRT60,
  calculatePositionSTI,
  classifySTI,
} from './sti'

// Room mode analysis
export {
  identifyRoomModes,
  findModesNear,
  calculateModalDensity,
  findModeClusters,
  getAxialModes,
  type RoomMode,
} from './modes'

// Panel absorption
export {
  getAbsorptionCurve,
  getPanelSpec,
  calculatePanelAbsorption,
  getDrapeAbsorption,
  calculateDrapeAbsorption,
  calculatePanelCost,
  calculateTotalPanels,
  type PanelThickness,
  type PanelSpec,
} from './absorption'
