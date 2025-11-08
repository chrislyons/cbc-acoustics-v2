# CBC Studio 8 Acoustics Dashboard v2

**Modern rebuild** of interactive acoustics visualization platform for CBC Radio 3 Studio 8.

🔗 **Original Project:** [github.com/chrislyons/cbc-acoustics-dashboard](https://github.com/chrislyons/cbc-acoustics-dashboard)  
🌐 **Live v1 Dashboard:** [cbc-acoustics-dashboard.streamlit.app](https://cbc-acoustics-dashboard.streamlit.app/)

---

## What's New in v2

### Preserved
✅ **Real measurement data** (July 15, 2025 tests)  
✅ **Acoustics calculation models** (RT60, STI, modal analysis)  
✅ **Business case metrics** (ROI, timeline, cost optimization)

### Rebuilt
🎨 **Modern web framework** (no Streamlit dependency)  
📊 **Enhanced visualizations** (current best practices)  
⚡ **Performance optimized** (<100ms interactions)  
📱 **Fully responsive** (mobile → desktop)  
♿ **Accessible design** (WCAG 2.1 AA)

---

## Documentation PREFIX Registry

| Prefix | Purpose |
|--------|---------|
| **ACU** | Acoustics project documentation |

---

## Quick Start

```bash
# Clone and setup
git clone [your-repo-url] ~/dev/cbc-acoustics-v2
cd ~/dev/cbc-acoustics-v2

# Install dependencies
npm install  # or: pip install -r requirements.txt

# Run development server
npm run dev  # or: python src/main.py
```

---

## For Claude Code: Autonomous Rebuild

This project is designed for **self-directed Claude Code operation**:

1. **Read:** [`CLAUDE.md`](./CLAUDE.md) for development guidelines
2. **Start:** [`docs/acu/ACU001 Project Vision.md`](./docs/acu/ACU001%20Project%20Vision.md)
3. **Execute:** Sprint documents ACU002 → ACU005 sequentially
4. **Reference:** Original implementation at `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/`

---

## Project Context

### Studio 8 Acoustics Problem
- **Room:** CBC Radio 3 Studio 8 (broadcast control room)
- **Issue:** Long RT60 (0.92s vs 0.3s target) degrading speech intelligibility
- **Data:** Real Smaart measurements from 7 positions, 20Hz-20kHz
- **Solution:** Acoustic treatment optimization within $1,200 budget

### Technical Specifications
- **Standards:** ITU-R BS.1116, EBU R128
- **Metrics:** RT60 (reverberation time), STI (speech transmission index)
- **Analysis:** Modal analysis, frequency response, position heatmaps
- **Treatment:** 2-4" acoustic panels with drape compensation

---

## Repository Structure

```
cbc-acoustics-v2/
├── docs/acu/           # Sprint & design documentation
├── data/               # Measurement CSVs (preserved from v1)
├── src/                # Application source code
│   ├── components/     # UI components
│   ├── visualizations/ # Charts and 3D models
│   └── analysis/       # Acoustics calculations
├── tests/              # Test suite
└── .claude/            # Claude Code configuration
    └── context/        # Original implementation analysis
```

---

## Development

See [`CLAUDE.md`](./CLAUDE.md) for comprehensive development conventions and autonomous operation guidelines.

---

## License

Original v1 implementation © Chris Lyons  
v2 rebuild preserves original data and acoustics models with modernized presentation.

---

**Status:** 🚧 In Development (Sprint-based rebuild via Claude Code)  
**Next Sprint:** See `docs/acu/ACU002 Sprint 1 Setup.md`
