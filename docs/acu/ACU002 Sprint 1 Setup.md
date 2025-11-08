# Sprint 1: Project Setup & Data Migration

**Sprint Goal:** Scaffold v2 repository, migrate measurement data, validate calculation functions
**Prerequisites:** ACU001 complete, original v1 repo accessible
**Estimated Effort:** 1-2 days
**Actual Effort:** ~2 hours
**Status:** ✅ Complete (2025-11-07)

---

## Context

This sprint establishes the technical foundation for the v2 rebuild by:
1. Setting up the development environment
2. Migrating CSV data to optimized JSON format
3. Porting acoustics calculation functions from v1
4. Validating calculations against v1 outputs

**Critical:** All data and calculations must be byte-for-byte identical to v1.

---

## Objectives

- [ ] Clone original v1 repo for reference
- [ ] Convert CSV measurement data to JSON
- [ ] Port RT60 calculation functions (Sabine/Eyring)
- [ ] Port STI degradation models
- [ ] Port room mode identification logic
- [ ] Write comprehensive unit tests
- [ ] Validate outputs match v1 (within 0.1% tolerance)
- [ ] Document any deviations with rationale

---

## Acceptance Criteria

### Data Migration
- [ ] All v1 CSV files copied to `data/measurements/`
- [ ] JSON conversion script created (`scripts/csv-to-json.js` or similar)
- [ ] JSON files generated in `public/data/`
- [ ] Data validation: frequency ranges, position names, value ranges
- [ ] File size optimized (gzip compression ready)

### Calculation Functions
- [ ] `calculate_rt60()` implemented and tested
- [ ] `calculate_sti_degradation()` implemented and tested
- [ ] `identify_room_modes()` implemented and tested
- [ ] `calculate_panel_absorption()` implemented and tested
- [ ] Test suite: >90% coverage for calculation modules
- [ ] All tests passing (100%)

### Validation
- [ ] Spot-check: 10 random measurements match v1 exactly
- [ ] RT60 calculations match v1 within 0.1%
- [ ] STI calculations match v1 within 0.1%
- [ ] Room modes identified match v1 list
- [ ] Documentation: any formula adjustments justified

---

## Implementation Notes

### Data Migration Strategy

1. **Locate Original CSVs**
   ```bash
   cd /Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard
   ls -1 *.csv
   ```
   Expected files:
   - `HostA.csv`, `HostB.csv`, `HostC.csv`
   - `Position1.csv`, `Position2.csv`, `Position3.csv`, `Position4.csv`
   
2. **CSV Format Analysis**
   ```csv
   timestamp,frequency,spl,phase,position
   2025-07-15T10:30:00,20,45.2,-12.5,HostA
   ```
   
3. **JSON Target Format**
   ```json
   {
     "measurements": {
       "HostA": [
         { "freq": 20, "spl": 45.2, "phase": -12.5 },
         ...
       ]
     },
     "metadata": {
       "date": "2025-07-15",
       "reference": "HostA",
       "frequency_range": [20, 20000]
     }
   }
   ```

4. **Validation Checks**
   - Frequency range: 20-20000 Hz
   - SPL range: 30-110 dB (realistic bounds)
   - Phase range: -180 to +180 degrees
   - All positions present
   - No missing/NaN values

### Calculation Function Porting

**Priority Order:**
1. RT60 (highest priority - core metric)
2. STI degradation (second priority - intelligibility)
3. Room modes (third - visualization feature)
4. Panel absorption (fourth - treatment simulator)

**Porting Process:**
For each function:
1. Find implementation in v1 (e.g., `treatment_simulator.py`)
2. Extract formula and constants
3. Document formula in code comments
4. Implement in TypeScript/JavaScript
5. Create test cases from v1 code
6. Run tests, verify within 0.1% tolerance
7. Document in API docs

**Example: RT60 Calculation**

From `treatment_simulator.py`:
```python
def calculate_rt60(volume, surface_area, absorption_coefficient):
    """Sabine equation for reverberation time"""
    return 0.161 * volume / (surface_area * absorption_coefficient)
```

Port to TypeScript:
```typescript
/**
 * Calculate RT60 reverberation time using Sabine equation
 * @param volume Room volume in cubic meters
 * @param surfaceArea Total surface area in square meters
 * @param absorptionCoeff Average absorption coefficient (0-1)
 * @returns RT60 time in seconds
 * 
 * Formula: RT60 = 0.161 * V / (S * α)
 * Reference: ISO 3382, Sabine equation
 */
export function calculateRT60(
  volume: number,
  surfaceArea: number,
  absorptionCoeff: number
): number {
  if (absorptionCoeff === 0) {
    throw new Error('Absorption coefficient cannot be zero');
  }
  return 0.161 * volume / (surfaceArea * absorptionCoeff);
}
```

Test case:
```typescript
describe('calculateRT60', () => {
  it('matches v1 output for Studio 8 baseline', () => {
    const volume = 1068.46; // cubic feet → m³ conversion
    const surfaceArea = 588.5; // square feet → m² conversion
    const alpha = 0.15; // measured baseline
    
    const result = calculateRT60(volume, surfaceArea, alpha);
    const expected = 0.92; // v1 measured RT60
    
    expect(result).toBeCloseTo(expected, 2); // within 0.01s
  });
});
```

### Unit Conversion Constants

```typescript
// From v1 - Studio 8 dimensions
export const STUDIO_8 = {
  dimensions: {
    width: 12.3,   // feet
    depth: 10.6,   // feet
    height: 8.2    // feet
  },
  volume: 1068.46, // cubic feet
  surfaceArea: 588.5, // square feet
  
  // Measured baseline (no treatment)
  measured_rt60: 0.92, // seconds
  target_rt60: 0.3,    // ITU-R BS.1116 target
  
  // Reference position
  reference: 'HostA'
};

// Unit conversions
export const CONVERSIONS = {
  feetToMeters: 0.3048,
  metersToFeet: 3.28084,
  cubicFeetToMeters: 0.0283168,
  squareFeetToMeters: 0.092903
};
```

### Test Data Fixtures

Create `tests/fixtures/` with sample data:

```typescript
// tests/fixtures/measurements.ts
export const sampleMeasurements = {
  HostA: [
    { freq: 20, spl: 45.2, phase: -12.5 },
    { freq: 25, spl: 46.8, phase: -15.3 },
    // ... (10-20 representative samples)
  ],
  // Expected results
  expectedRT60: 0.92,
  expectedSTI: 0.48, // degraded from reference
  expectedModes: [
    { frequency: 55.8, type: 'length', order: 1 },
    { frequency: 64.2, type: 'width', order: 1 },
    // ...
  ]
};
```

### File Organization

```
src/
├── lib/
│   ├── acoustics/
│   │   ├── rt60.ts           # RT60 calculations
│   │   ├── sti.ts            # STI degradation
│   │   ├── modes.ts          # Room mode identification
│   │   ├── absorption.ts     # Panel absorption
│   │   └── index.ts          # Public API
│   ├── data/
│   │   ├── loader.ts         # JSON data loading
│   │   ├── validator.ts      # Data validation
│   │   └── index.ts
│   └── utils/
│       ├── conversions.ts    # Unit conversions
│       └── constants.ts      # Studio 8 constants
└── ...

tests/
├── unit/
│   ├── acoustics/
│   │   ├── rt60.test.ts
│   │   ├── sti.test.ts
│   │   ├── modes.test.ts
│   │   └── absorption.test.ts
│   └── data/
│       ├── loader.test.ts
│       └── validator.test.ts
└── fixtures/
    ├── measurements.ts
    └── expected-results.ts
```

---

## Tasks Breakdown

### Phase 1: Environment Setup (2 hours)
- [ ] Install Node.js dependencies (`pnpm install` or `npm install`)
- [ ] Set up testing framework (Vitest or Jest)
- [ ] Configure TypeScript (if using TS)
- [ ] Set up linting/formatting (ESLint, Prettier)

### Phase 2: Data Migration (4-6 hours)
- [ ] Copy CSV files to `data/measurements/`
- [ ] Write CSV→JSON conversion script
- [ ] Run conversion, generate JSON files
- [ ] Write data validation tests
- [ ] Verify JSON file integrity

### Phase 3: Calculation Functions (8-12 hours)
- [ ] Port RT60 calculation (2-3 hours)
  - Extract from `treatment_simulator.py`
  - Implement in TS/JS
  - Write 5-10 test cases
  - Validate against v1
  
- [ ] Port STI degradation (3-4 hours)
  - Extract from relevant v1 file
  - Implement frequency-dependent logic
  - Write test cases
  - Validate outputs
  
- [ ] Port room mode calculation (2-3 hours)
  - Extract modal frequency formula
  - Implement mode identification
  - Test against known modes
  
- [ ] Port panel absorption (2-3 hours)
  - Extract absorption coefficient data
  - Implement frequency-dependent lookup
  - Test with various panel configs

### Phase 4: Integration & Validation (4-6 hours)
- [ ] Create integration test suite
- [ ] Run full validation against v1 outputs
- [ ] Document any deviations
- [ ] Generate test coverage report (target: >90%)
- [ ] Update sprint status to "Complete"

---

## Validation Checklist

Before marking sprint complete, verify:

- [ ] All CSV files in `data/measurements/`
- [ ] All JSON files in `public/data/`
- [ ] JSON files load without errors
- [ ] Data validation tests pass (100%)
- [ ] RT60 calculation matches v1 (within 0.1%)
- [ ] STI calculation matches v1 (within 0.1%)
- [ ] Room modes list matches v1
- [ ] Panel absorption lookup works
- [ ] Test coverage >90% for `src/lib/acoustics/`
- [ ] All tests passing (100%)
- [ ] API documentation complete
- [ ] Sprint notes updated in `.claude/scratch/`

---

## References

[1] Original v1 code: `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/`  
[2] Sabine equation: ISO 3382-1  
[3] STI standard: IEC 60268-16  
[4] Room modes: f = c / (2 * dimension), where c = 1130 ft/s  
[5] Absorption data: Manufacturer specs (2" and 4" panels)

---

**Next:** ACU003 Sprint 2: Modern Frontend Architecture

**For Claude Code:** Execute this sprint autonomously. Update status and document any issues in `.claude/scratch/sprint-notes.md`. Signal when ready for ACU003.
