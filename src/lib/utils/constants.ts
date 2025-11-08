/**
 * CBC Studio 8 Physical Constants and Measured Baseline Values
 * Source: July 15, 2025 Smaart measurements
 * Standards: ITU-R BS.1116, EBU R128
 */

export const STUDIO_8 = {
  // Room dimensions (feet)
  dimensions: {
    width: 12.3, // x-axis (feet)
    depth: 10.6, // y-axis (feet)
    height: 8.2, // z-axis (feet)
  },

  // Derived volumes and areas
  volume: 1068.46, // cubic feet (12.3 * 10.6 * 8.2)
  surfaceArea: 588.5, // square feet (calculated from dimensions)

  // Measured baseline (no acoustic treatment)
  measured: {
    rt60: 0.92, // seconds (average across frequencies)
    targetRT60: 0.3, // ITU-R BS.1116 target for broadcast
    averageSTI: 0.67, // Speech Transmission Index (measured baseline)
    targetSTI: 0.75, // Target STI for broadcast quality
  },

  // RT60 by frequency band (measured baseline)
  rt60ByFreq: {
    125: 0.85,
    250: 0.92,
    500: 0.78,
    1000: 0.71,
    2000: 0.68,
    4000: 0.55,
  },

  // STI by position (measured baseline)
  stiByPosition: {
    'Host A (Reference)': 0.95,
    'Host C (Talent)': 0.67,
    'Mid Room': 0.71,
    'NE Corner': 0.58,
    'SE Corner': 0.62,
    Ceiling: 0.64,
  },

  // Reference position (0 degradation baseline)
  reference: 'HostA',
} as const

export const THE_HUB = {
  // Room dimensions (hexagonal space)
  dimensions: {
    width: 15.0, // approximate (feet)
    depth: 14.0, // approximate (feet)
    height: 9.0, // approximate (feet)
  },

  volume: 1900, // cubic feet (estimated)
  surfaceArea: 1400, // square feet (estimated)

  // Measured baseline
  measured: {
    rt60: 0.62, // seconds (average)
    targetRT60: 0.4,
    averageSTI: 0.71,
    targetSTI: 0.75,
  },

  // RT60 by frequency band
  rt60ByFreq: {
    125: 0.72,
    250: 0.78,
    500: 0.65,
    1000: 0.58,
    2000: 0.52,
    4000: 0.48,
  },

  reference: 'Chair 1',
} as const

export type Studio = typeof STUDIO_8 | typeof THE_HUB
