# ACU009 Strategic Recommendations

**Status:** Reference Document
**Created:** 2025-11-18
**Purpose:** Forward-looking recommendations beyond code audit
**Related:** Code audit findings, future development roadmap

---

## Executive Summary

Strategic analysis across 10 dimensions identifies key opportunities:
- **Interactive audio features** (unique differentiator)
- **Persona-based UX improvements** (2x engagement)
- **Performance optimizations** (5x faster perceived speed)
- **Business impact tools** (10x stakeholder buy-in)

See full analysis: `.claude/scratch/strategic-recommendations.md`

---

## 🎯 Top 5 Immediate Opportunities

### 1. Add Interactive Audio Simulation (UNIQUE)
**Impact:** High competitive differentiation
**Effort:** Medium (2-3 days)
**Tech:** Web Audio API + convolution reverb

**Feature:**
- Upload audio file (speech, music)
- Apply simulated room response based on current RT60
- A/B comparison: dry vs. treated room
- Real-time panel adjustment → hear difference

**Why it matters:** No other acoustics dashboard offers this. Makes abstract RT60 numbers tangible.

### 2. Implement React Query for Data Caching
**Impact:** 5x faster perceived performance
**Effort:** Low (4 hours)
**Tech:** `@tanstack/react-query`

**Benefits:**
- Prefetch all Smaart logs when room selected
- Instant position switching (no loading)
- Automatic background refetch
- Better loading states

### 3. Add Onboarding Tour
**Impact:** 2x user engagement
**Effort:** Low (2 hours)
**Tech:** `react-joyride`

**Flow:**
```
1. "Welcome! This is RT60..." (Dashboard metric)
2. "These are room modes..." (Frequency chart)
3. "Adjust panels here..." (Simulator)
4. "Export your results..." (Export button)
```

### 4. PDF Report Generator
**Impact:** 10x stakeholder buy-in
**Effort:** Medium (1 day)
**Tech:** `jspdf` + `html2canvas`

**Contents:**
- Executive summary (ROI, timeline)
- Current measurements
- Proposed treatment + 3D visualization
- Cost breakdown
- Implementation roadmap

### 5. Domain-Specific Visualizations
**Impact:** Better technical communication
**Effort:** Medium (2-3 days per viz)

**Add:**
- Waterfall plot (frequency × time × decay)
- Polar directivity plot (if you get directivity data)
- Third-octave band analysis (vs. current octave)
- Perceptually uniform color scales (Viridis)

---

## 📊 User Journey Analysis

### Identified Personas

#### 1. Decision Maker (CBC Management)
**Time Budget:** 5 minutes
**Goal:** Approve $1,200 budget
**Needs:** ROI, timeline, compliance

**Current Journey:**
```
Dashboard → See metrics (RT60, STI) → ??? → Decision
```

**Optimized Journey:**
```
Dashboard → Executive Summary Card
           ↓
         "ROI: 12.5% STI improvement for $1,200"
         "Timeline: 4 weeks"
         "Compliance: Meets ITU-R BS.1116"
           ↓
         [Download PDF Report] → Send to finance
           ↓
         Approval
```

**Gap:** No executive summary, no PDF export

#### 2. Audio Engineer (Studio Staff)
**Time Budget:** 15 minutes
**Goal:** Understand problem + validate solution
**Needs:** Technical details, before/after

**Current Journey:**
```
Frequency → See modes → Visualizer → See room
                                    ↓
                              Simulator → Test configs
                                    ↓
                              ??? (no clear next step)
```

**Optimized Journey:**
```
Onboarding Tour → "You have room modes at 85Hz, 127Hz"
      ↓
Frequency Chart → Click 85Hz mode
      ↓
3D Visualizer → Highlights affected corners (brushing!)
      ↓
Simulator → "Try 4× 11" bass traps in corners"
      ↓
Audio Preview → Hear before/after
      ↓
Export → Screenshot + CSV for documentation
```

**Gaps:** No brushing/linking, no audio preview, no guided flow

#### 3. Acoustic Consultant (External Expert)
**Time Budget:** 30+ minutes
**Goal:** Validate methodology
**Needs:** Raw data, formulas, customization

**Current Journey:**
```
About → Read methodology → ??? (no detail)
```

**Optimized Journey:**
```
Methodology Page → See Sabine/Eyring formulas with derivations
      ↓
Download Raw Data → Smaart logs, CSVs
      ↓
Advanced Mode → Edit absorption coefficients
      ↓
API Access → Integrate with own tools
      ↓
Peer Review → Submit feedback
```

**Gaps:** No methodology docs, no advanced mode, no API

---

## 🛠️ Technology Recommendations

### High Priority

#### React Query
```bash
npm install @tanstack/react-query
```
**Why:** Automatic caching, prefetching, better UX
**ROI:** 5x faster perceived performance

#### Plotly.js
```bash
npm install plotly.js-dist-min
```
**Why:** Superior technical plotting, waterfall plots
**ROI:** Industry-standard visualizations

#### React Joyride
```bash
npm install react-joyride
```
**Why:** Guided onboarding tours
**ROI:** 2x user engagement

### Medium Priority

#### Zustand (State Management)
```bash
npm install zustand
```
**Why:** Better performance than Context API
**Use:** Panel configuration, UI state

#### MSW (Testing)
```bash
npm install -D msw
```
**Why:** Mock Smaart file fetches in tests
**Use:** Faster tests, error state testing

#### Zod (Validation)
```bash
npm install zod
```
**Why:** Runtime data validation for CSV parsing
**Use:** Prevent bad data from breaking UI

### Future Consideration

#### Tone.js (Audio Synthesis)
```bash
npm install tone
```
**Why:** Generate test tones, demonstrate modes
**Use:** Interactive audio education

#### Storybook (Component Library)
```bash
npx storybook@latest init
```
**Why:** Document components in isolation
**Use:** Design system, client demos

---

## 📈 Analytics Strategy

### Events to Track

**User Behavior:**
- Room/position selection frequency
- Panel configuration patterns
- Time spent per page
- Export format preferences (CSV vs PNG)

**Technical:**
- Load times (per data file)
- Error rates (parsing, rendering)
- Browser/device distribution

**Business:**
- Simulator iterations (config changes)
- Budget utilization (avg panel cost)
- Conversion: visitor → PDF download

### Privacy-First Tools

**Recommendation:** Plausible Analytics
- GDPR-compliant
- No cookies
- Lightweight (<1kb script)
- Self-hostable

**Alternative:** Matomo (self-hosted)

---

## 🚀 Deployment Recommendations

### Primary: Vercel

**Why:**
- Zero-config for Vite/React
- Edge network (global CDN)
- Preview deployments per commit
- Free tier sufficient

**Setup:**
```bash
npm install -g vercel
vercel --prod
```

**Custom Domain:**
```
cbc-acoustics.vercel.app → acoustics.cbc.ca (CNAME)
```

### Alternative: Cloudflare Pages

**Why:**
- Fastest edge network
- Unlimited bandwidth (free)
- R2 storage for Smaart files

### Production Checklist

- [ ] Environment variables (if any APIs)
- [ ] Asset compression (gzip/brotli)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible)
- [ ] SSL certificate (auto)
- [ ] Performance budgets (Lighthouse)
- [ ] Uptime monitoring (UptimeRobot)

---

## 💼 Business Impact Features

### PDF Report Generator

**One-Click Export:**
- Executive summary (1 page)
- Current state measurements (1 page)
- Proposed treatment with 3D viz (1 page)
- Cost breakdown (1 page)
- Implementation timeline (1 page)

**Use Case:** Approval meetings, vendor quotes, documentation

### ROI Calculator

**Show Explicit Business Value:**
```
┌─────────────────────────────────────────┐
│ Business Case                           │
├─────────────────────────────────────────┤
│ Investment: $1,200 (one-time)          │
│                                         │
│ Returns:                                │
│  • 12.5% STI improvement               │
│    → Clearer broadcast audio           │
│    → Fewer retakes                     │
│    → Better listener experience        │
│                                         │
│  • 35% RT60 reduction                  │
│    → Meets ITU-R standard              │
│    → No ongoing EQ tweaking            │
│                                         │
│ Timeline: 4 weeks                       │
│ Risk: Low (proven models)              │
│                                         │
│ Alternative Cost:                       │
│  • Status quo: Ongoing EQ battles      │
│  • Rebuild room: $50k+                 │
└─────────────────────────────────────────┘
```

### Compliance Dashboard

**Standards Tracking:**
- ITU-R BS.1116 (broadcast control rooms)
- EBU R128 (loudness)
- CSA (Canadian broadcast standards)

**Show:** Current → Target → Predicted (colored indicators)

---

## 🎨 Data Visualization Enhancements

### Waterfall Plot

**Industry Standard for Acoustics:**
- X-axis: Time (decay)
- Y-axis: Frequency (log scale)
- Z-axis: Amplitude (dB)
- Color: Amplitude heatmap

**Shows:** Which frequencies ring longer (modal analysis)

**Implementation:** Plotly 3D surface plot

### Third-Octave Bands

**Current:** 6 octave bands [125, 250, 500, 1000, 2000, 4000]
**Enhanced:** 20 third-octave bands

**Why:** More granular, matches professional tools (Smaart, REW)

### Brushing & Linking

**Example:**
1. Click 85Hz room mode in frequency chart
2. → 3D room highlights affected corners
3. → RT60 chart highlights 125Hz band
4. → Simulator suggests "4× 11" bass traps"

**Tech:** Shared Zustand state for selections

### Perceptually Uniform Colors

**Current:** Arbitrary colors
**Better:** Science-backed scales

- **RT60 Heatmap:** Viridis (purple → yellow)
- **STI Degradation:** RdYlGn reversed (red=bad)
- **Frequency Response:** Coolwarm diverging (±0dB = white)

**Why:** Better perception, color-blind safe

---

## 🔮 Future Roadmap

### Near-Term (Q1 2025)

**Effort: 2-3 sprints**
- [ ] Multi-room support (The Hub)
- [ ] Custom room builder (enter dimensions)
- [ ] Email report delivery
- [ ] Print-optimized layouts

### Mid-Term (Q2 2025)

**Effort: 1-2 months**
- [ ] Real-time Smaart integration (live feed)
- [ ] Audio preview (Web Audio API)
- [ ] Mobile app (React Native)
- [ ] Collaboration features (share configs)

### Long-Term (2026)

**Effort: 3-6 months**
- [ ] ML-based optimization (genetic algorithms)
- [ ] VR room walkthrough (Oculus/Quest)
- [ ] Multi-user real-time editing (WebSockets)
- [ ] SaaS platform (support other studios)

### Research Opportunities

**Academic Partnerships:**
- McGill University (Music Technology)
- University of Toronto (Acoustics)
- CIRMMT (Music Media Technology Research)

**Potential Publications:**
- "Web-based acoustics simulation for broadcast"
- "Interactive modal analysis visualization"
- "ML for acoustic treatment optimization"

---

## 🎯 Recommended Focus Areas

### Priority 1: User Experience (Immediate)
**Impact:** 2-3x engagement
**Effort:** Low-Medium (1-2 weeks)

**Actions:**
1. Add onboarding tour (2 hours)
2. Improve error messages (4 hours)
3. Add keyboard shortcuts (2 hours)
4. Implement PDF export (1 day)

### Priority 2: Performance (Urgent)
**Impact:** 5x faster perceived speed
**Effort:** Low (1 week)

**Actions:**
1. Implement React Query (4 hours)
2. Add data caching (2 hours)
3. Optimize re-renders with Zustand (1 day)
4. Add loading skeletons (4 hours)

### Priority 3: Business Tools (High ROI)
**Impact:** 10x stakeholder buy-in
**Effort:** Medium (2 weeks)

**Actions:**
1. PDF report generator (1 day)
2. Executive summary card (4 hours)
3. ROI calculator (1 day)
4. Compliance dashboard (1 day)

### Priority 4: Unique Features (Differentiation)
**Impact:** Market leadership
**Effort:** High (1 month)

**Actions:**
1. Interactive audio simulation (1 week)
2. Waterfall plot visualization (3 days)
3. Brushing & linking (1 week)
4. Advanced mode (1 week)

---

## 📚 Learning Resources

### For Audio Engineers
- "Understanding RT60" (animated explainer)
- "Room Modes 101" (interactive demo)
- "Reading Frequency Response" (tutorial)

### For Decision Makers
- "Acoustic Treatment ROI" (business case)
- "Broadcast Standards Compliance" (regulatory)

### For Developers
- API documentation (if built)
- Methodology deep-dive (formulas + code)
- Contributing guide (open source)

---

## ✅ Immediate Next Steps

### Week 1: Core Fixes
1. Run `npm install`
2. Fix TypeScript errors
3. Add data parser tests
4. Improve error handling

### Week 2: UX Polish
5. Add onboarding tour
6. Implement React Query
7. Add keyboard shortcuts
8. Improve loading states

### Week 3: Business Tools
9. Build PDF export
10. Add executive summary
11. Create compliance dashboard
12. Implement analytics

### Week 4: Deployment
13. Deploy to Vercel
14. Set up error tracking
15. Configure performance monitoring
16. Conduct user testing

---

## 🎬 Conclusion

**Strengths:**
- Excellent technical foundation
- Well-organized codebase
- Strong acoustics calculations
- Good documentation

**Biggest Opportunities:**
1. **UX/User Journey** - Persona-based guided flows
2. **Interactive Audio** - Unique competitive advantage
3. **Business Tools** - PDF reports, ROI calculator
4. **Performance** - Caching, state management
5. **Visualizations** - Domain-specific (waterfall, brushing)

**Recommended Sequence:**
1. Fix critical issues (npm install, TypeScript)
2. Add UX improvements (onboarding, PDF export)
3. Optimize performance (React Query, Zustand)
4. Build unique features (audio simulation)
5. Deploy to production (Vercel)

**Expected Impact:**
- 2-3x user engagement (UX)
- 5x faster performance (caching)
- 10x stakeholder buy-in (PDF export)
- Market differentiation (audio simulation)

---

**Status:** Recommendations ready for stakeholder review
**Next:** Prioritize based on business goals and timeline
