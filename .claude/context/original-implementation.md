# Original Implementation Analysis

**Source:** `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/`  
**GitHub:** https://github.com/chrislyons/cbc-acoustics-dashboard  
**Live:** https://cbc-acoustics-dashboard.streamlit.app/

---

## Architecture (v1)

### Stack
- **Framework:** Streamlit (Python web framework)
- **Visualization:** Plotly (charts) + custom 3D rendering
- **Data:** Pandas (CSV processing)
- **Deployment:** Streamlit Cloud

### File Structure
```
cbc-interactive-dashboard/
├── web_acoustic_dashboard.py      # Main Streamlit app (entry point)
├── enhanced_3d_visualizer.py      # 3D room model + panel placement
├── frequency_response_explorer.py # Frequency analysis plots
├── treatment_simulator.py         # RT60/STI calculations
├── *.csv                          # Real measurement data
├── static_dashboard_demo.html     # Static HTML preview
└── requirements.txt               # Python dependencies
```

---

## Core Components

### 1. Main Dashboard (`web_acoustic_dashboard.py`)
**Purpose:** Streamlit multi-tab interface

**Tabs:**
- Executive Dashboard (business metrics)
- 3D Room Visualization
- Frequency Analysis
- Treatment Simulator
- Complete Analysis (combined view)

**Key Features:**
- Streamlit session state for cross-tab updates
- CSV data loading with fallback to synthetic data
- Matplotlib/Plotly figure generation
- Export to reports/presentations

### 2. 3D Visualizer (`enhanced_3d_visualizer.py`)
**Purpose:** Interactive Studio 8 room model

**Features:**
- Room dimensions: 12.3' x 10.6' x 8.2' (set volume + ceiling cavity)
- Measurement positions: 7 points (HostA-HostC, Positions 1-4)
- Panel placement: slider-controlled acoustic treatment
- Color coding: STI degradation by position
- Rotation/zoom: Interactive Plotly 3D scatter

**Data Structure:**
```python
POSITIONS = {
    'HostA': (x, y, z),  # 4" from source (reference)
    'HostB': (x, y, z),  # Host position
    'HostC': (x, y, z),  # Guest position
    'Pos1': (x, y, z),   # Additional measurements
    ...
}
```

### 3. Frequency Explorer (`frequency_response_explorer.py`)
**Purpose:** Multi-position frequency response analysis

**Visualizations:**
- Frequency response curves (20Hz-20kHz)
- Modal analysis highlights (room resonances)
- Degradation heatmaps (position vs frequency)
- Interactive position selection

**Calculations:**
- SPL deviation from reference (HostA)
- Critical frequency bands (speech intelligibility)
- Room mode identification (length/width/height modes)

### 4. Treatment Simulator (`treatment_simulator.py`)
**Purpose:** Real-time treatment optimization

**Parameters:**
- Panel count (0-30)
- Panel thickness (2" or 4")
- Drape compensation factor (0.0-1.0)
- Budget constraint ($1,200)

**Outputs:**
- Predicted RT60 reduction
- STI improvement estimate
- Cost calculation
- Before/after visualizations

**Formulas (preserve these):**
```python
# RT60 Calculation (Sabine equation)
RT60 = 0.161 * Volume / (Surface_Area * Absorption_Coefficient)

# STI Degradation (from RT60 and noise)
STI_loss = f(RT60, background_noise, frequency_response)

# Panel absorption (frequency-dependent)
Alpha(f) = panel_data[thickness][frequency]
```

---

## Data Files (PRESERVE AS TRUTH)

### Measurement CSVs
**Source:** July 15, 2025 Smaart acoustic tests

**Format:**
```csv
timestamp,frequency,spl,phase,position
2025-07-15T10:30:00,20,45.2,-12.5,HostA
2025-07-15T10:30:00,25,46.8,-15.3,HostA
...
```

**Positions:**
- HostA: 4" from source (REFERENCE - no degradation)
- HostB, HostC: Host/guest positions
- Pos1-4: Additional measurement points

**Frequency Range:** 20Hz - 20kHz (1/3 octave bands)

### Reference Standards
- **ITU-R BS.1116:** Critical listening room standards
- **EBU R128:** Broadcast audio loudness spec
- **Target RT60:** 0.3s (broadcast control room)
- **Measured RT60:** 0.92s (requires treatment)

---

## Known Issues (v1)

### Performance
- Streamlit full page reloads on every interaction
- 3D rendering can be sluggish with many panels
- Large CSV files slow initial load

### Limitations
- No mobile responsiveness (desktop-only layout)
- Limited export options (basic PNG/PDF)
- Can't save/load treatment configurations
- No comparison mode (before/after side-by-side)

### Dependencies
- Streamlit Cloud free tier limitations
- Plotly free tier (should be fine, base library is free)
- Python 3.7+ required

---

## What to Preserve in v2

### ✅ Must Keep (Backend Truth)
1. **All CSV measurement data** (byte-for-byte)
2. **RT60 calculation formulas** (Sabine/Eyring)
3. **STI degradation models** (IEC 60268-16)
4. **Room dimensions and positions**
5. **Panel absorption coefficients**
6. **Budget constraints and costs**

### 🎨 Improve (Frontend)
1. **Framework:** Move away from Streamlit (full web app)
2. **3D Rendering:** Modern WebGL (Three.js or similar)
3. **Interactions:** Sub-100ms response, no page reloads
4. **Mobile:** Responsive design, touch-friendly
5. **Exports:** Better report generation, shareable links
6. **Aesthetics:** Professional, not "default Python chart"

---

## Migration Strategy

### Phase 1: Data Extraction
1. Copy all *.csv files to `data/measurements/`
2. Extract calculation functions from Python files
3. Document data schemas and units

### Phase 2: Algorithm Port
1. Reimplement RT60 calculations (preserve formula)
2. Port STI degradation logic
3. Extract room mode identification code
4. Unit test all calculations against v1 outputs

### Phase 3: Frontend Rebuild
1. Choose modern web framework
2. Recreate visualizations with better performance
3. Implement responsive design
4. Add new features (comparison mode, saved configs)

### Phase 4: Testing & Validation
1. Verify calculations match v1 exactly
2. Visual regression tests
3. Performance benchmarks
4. User acceptance testing

---

## References for v2 Development

**Original Files to Study:**
1. `web_acoustic_dashboard.py` - Overall app structure
2. `treatment_simulator.py` - Calculation logic (HIGH PRIORITY)
3. `enhanced_3d_visualizer.py` - 3D coordinate system
4. `frequency_response_explorer.py` - Frequency band analysis
5. `requirements.txt` - Python dependencies (for algorithm hints)

**Key Concepts:**
- Reverberation Time (RT60) - time for 60dB decay
- Speech Transmission Index (STI) - intelligibility metric (0-1 scale)
- Room Modes - resonances at f = c/(2*dimension)
- Absorption Coefficients - frequency-dependent material properties

**Standards Documents:**
- ITU-R BS.1116-3 (critical listening rooms)
- IEC 60268-16 (STI measurement)
- ISO 3382 (room acoustics measurement)

---

**For Claude Code:**
This document provides context without needing to load the entire original codebase. Reference specific files from the original repo only when implementing algorithms or validating calculations.
