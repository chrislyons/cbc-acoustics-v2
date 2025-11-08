/**
 * Unit conversion utilities
 */

export const CONVERSIONS = {
  // Length
  feetToMeters: 0.3048,
  metersToFeet: 3.28084,

  // Area
  squareFeetToMeters: 0.092903,
  squareMetersToFeet: 10.7639,

  // Volume
  cubicFeetToMeters: 0.0283168,
  cubicMetersToFeet: 35.3147,
} as const

/**
 * Speed of sound in air (feet per second)
 * Used for room mode calculations
 */
export const SPEED_OF_SOUND_FT_S = 1130 // ft/s at room temperature

/**
 * Speed of sound in air (meters per second)
 */
export const SPEED_OF_SOUND_M_S = 343 // m/s at room temperature
