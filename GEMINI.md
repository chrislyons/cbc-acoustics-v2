# CBC Acoustics Dashboard v2 Development Guide

**Workspace:** Inherits conventions from `~/chrislyons/dev/GEMINI.md`
**Documentation PREFIX:** ACU
**Original Implementation:** https://github.com/chrislyons/cbc-acoustics-dashboard
**Live Site (v1):** https://cbc-acoustics-dashboard.streamlit.app/

---

## Project Context

### Purpose
Complete rebuild of CBC Studio 8 acoustics visualization dashboard with:
- **Preserved Backend:** All original measurement data remains authoritative
- **Modern Frontend:** Current web visualization best practices
- **Autonomous Execution:** Gemini self-directed sprint workflows

### Original Implementation Reference
Located at: `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/`

Key components to analyze:
- `web_acoustic_dashboard.py` - Streamlit app structure
- `enhanced_3d_visualizer.py` - 3D room visualization logic
- `frequency_response_explorer.py` - Frequency analysis algorithms
- `treatment_simulator.py` - RT60/STI calculation models
- `*.csv` - July 15, 2025 measurement data (ground truth)

---

## Configuration Inheritance

1. **This file (GEMINI.md)** – Repository-specific rules
2. **Workspace config** (`~/chrislyons/dev/GEMINI.md`) – Cross-repo patterns
3. **Global config** (`~/.gemini/GEMINI.md`) – Universal rules

**Conflict Resolution:** Repo > Workspace > Global

---

## Efficiency

**BEFORE large refactors:**
1. Use targeted `read_file` and `glob` to understand the relevant parts of the codebase.
2. For broader understanding, use `codebase_investigator`.
3. Archive docs >63 days old: `bash ~/dev/scripts/archive-old-docs.sh cbc-acoustics-v2 ACU`

**Doc reading priority:** ACU### sprint docs → v1 reference implementation → data schemas

**File boundaries (Never Read):**
- `node_modules/`, `.pnpm-store/`, `build/`, `dist/`
- `data/cache/`, `data/raw/*.sqlite` (v1 data)
- `.venv/`, `__pycache__/`, `*.pyc`
- `*.log`, `.DS_Store`, `*.swp`

**File boundaries (Read First):**
- `GEMINI.md`, `README.md`
- `docs/acu/` sprint documents (ACU001, ACU002, etc.)
- v1 reference: `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/` (on demand)

**File boundaries (Read On Demand):**
- v1 implementation files (for algorithm reference)
- Measurement data CSVs (July 15, 2025)

**63-day archive policy:** Automated via workspace script, keeps active docs focused

---

## Autonomous Operation Guidelines

### Sprint-Based Workflow

Gemini should operate in **self-directed sprints** following ACU00X documents:

1. **ACU001** - Project vision and original implementation analysis
2. **ACU002** - Sprint 1: Setup and data migration
3. **ACU003** - Sprint 2: Architecture decisions
4. **ACU004** - Sprint 3: Core visualization components
5. **ACU005** - Sprint 4: Interactive features and polish

### Execution Protocol

**Before Starting Work:**
1. Read relevant ACU00X sprint document completely.
2. Use `codebase_investigator` or `read_file` on original implementation files for reference (if needed).
3. Verify acceptance criteria understanding.
4. Note any blockers or clarifications needed.

**During Sprint:**
1. Work autonomously unless blocked.
2. Use `write_todos` to create and track sub-tasks for complex goals.
3. Document important decisions or findings in `docs/acu/sprint-notes.md`.
4. Run tests continuously.

**Sprint Completion:**
1. Verify all acceptance criteria met.
2. Update sprint status in the relevant ACU00X document.
3. Document any deviations or improvements.
4. Signal readiness for the next sprint.

---

## Documentation Discovery (On-Demand Only)

**CRITICAL:** PREFIX docs in `docs/acu/` are excluded from auto-indexing. Access them on-demand only.

**Find highest 6 docs:**
```bash
ls -1 docs/acu/ACU*.md | sort -V | tail -6
```

**Read specific doc (example):**
```bash
# Use read_file tool with specific path:
docs/acu/ACU006 Sprint 3 Completion Report.md
```

**Search for topic:**
```bash
grep -l "acoustics" docs/acu/*.md
```

---

## Documentation Standards

### Naming Convention

**Pattern:** `{ACU###} {Verbose Title}.md`

**Examples (CORRECT):**
- `ACU001 Project Vision.md`
- `ACU042 Frequency Analysis Algorithm.md`
- `ACU100 Deployment Strategy.md`

### Sprint Documents Structure

```markdown
# Title

**Sprint Goal:** One-sentence objective
**Prerequisites:** Required sprints/setup
**Estimated Effort:** Hours/days
**Status:** [Not Started | In Progress | Complete | Blocked]

## Context

Background and motivation.

## Objectives

- [ ] Objective 1
- [ ] Objective 2

## Acceptance Criteria

- [ ] Criterion 1 (testable/verifiable)
- [ ] Criterion 2

## Implementation Notes

Technical guidance and constraints.

## References

[1] https://example.com/resource
```

---

## Project Structure

```
cbc-acoustics-v2/
├── GEMINI.md                      # This file
├── README.md                      # Project overview
├── docs/acu/                      # Sprint & design docs
│   ├── ACU001 Project Vision.md
│   ├── ACU002 Sprint 1 Setup.md
│   └── ...
├── data/                          # Acoustic measurements
│   ├── measurements/              # Real data (from v1)
│   └── synthetic/                 # Generated fallbacks
├── src/                           # Application code
│   ├── components/                # UI components
│   ├── visualizations/            # Chart/3D logic
│   ├── analysis/                  # Acoustics calculations
│   └── utils/                     # Helpers
├── tests/                         # Test suite
├── .gemini/                       # Gemini config & scratchpad
│   ├── tmp/                       # Temporary files
│   └── context/                   # Distilled knowledge
│       └── original-implementation.md
└── public/                        # Static assets
```

---

## Technical Constraints

### Backend Data (IMMUTABLE)
- **Source:** July 15, 2025 Smaart measurements
- **Format:** CSV files with timestamp, frequency, SPL, phase
- **Reference:** HostA (4" from source) = baseline
- **Standards:** ITU-R BS.1116, EBU R128 broadcast specs

### Acoustics Formulas (PRESERVE)
- **RT60 Calculation:** Sabine/Eyring equations from v1
- **STI Degradation:** IEC 60268-16 models
- **Modal Analysis:** Room mode identification algorithms

### Frontend Technology (FLEXIBLE)
- Modern web stack (React, Next.js, Vue - your choice)
- No Streamlit dependency (rebuild as web app)
- Consider: D3.js, Three.js, Canvas API for visualizations
- Plotly optional (evaluate alternatives)

---

## Quality Standards

### Code
- Type safety (TypeScript preferred if JS-based)
- Unit tests for calculations (RT60, STI, modes)
- Visual regression tests for charts
- Performance: <100ms interaction response

### Visualization
- Responsive design (mobile → desktop)
- Accessible (WCAG 2.1 AA minimum)
- Professional aesthetics (not "default chart" look)
- Real-time interactions (<16ms frame time for 3D)

### Documentation
- Every sprint tracked in ACU00X docs
- API documentation for calculation functions
- Deployment guide for Cloudflare/Vercel/etc
- Maintenance runbook

---

## Autonomous Decision Authority

Gemini has **full authority** to make decisions on:
- Framework/library selection (justify in sprint docs)
- Component architecture and file structure
- Visual design details (colors, layouts, animations)
- Testing strategies and tools
- Build and deployment configuration

Gemini **must consult** Chris on:
- Deviations from preserved backend data
- Changes to acoustics calculation formulas
- Blocking technical issues preventing sprint completion
- Major architectural pivots not in sprint plans

---

## References

- **Original v1 code:** `/Users/chrislyons/Documents/CL/dev/std8/cbc-interactive-dashboard/`
- **Live v1 site:** https://cbc-acoustics-dashboard.streamlit.app/
- **GitHub v1:** https://github.com/chrislyons/cbc-acoustics-dashboard
- **Workspace config:** `~/chrislyons/dev/GEMINI.md`

---

**Last Updated:** 2025-11-16
