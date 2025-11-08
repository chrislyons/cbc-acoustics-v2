# Sprint 2: Modern Frontend Architecture

**Sprint Goal:** Choose framework, design component hierarchy, scaffold application shell  
**Prerequisites:** ACU002 complete (data migrated, calculations validated)  
**Estimated Effort:** 2-3 days  
**Status:** 📋 Not Started

---

## Context

With data and calculations validated, this sprint establishes the frontend architecture:
- Framework selection (Next.js, Vue, or alternative)
- Component design system
- State management approach
- Build and dev tooling
- Basic app shell (layout, navigation, routing)

**Goal:** Running dev server with navigable shell (no visualizations yet).

---

## Objectives

- [ ] Evaluate and choose web framework
- [ ] Set up build tooling (Vite/Next/etc)
- [ ] Design component architecture
- [ ] Create design system (Tailwind config, tokens)
- [ ] Implement base layout (header, sidebar, main)
- [ ] Set up routing/navigation
- [ ] Configure state management
- [ ] Create component storybook/demo
- [ ] Document architecture decisions

---

## Acceptance Criteria

- [ ] Dev server runs (`npm run dev` or equivalent)
- [ ] Basic layout renders (header, nav, content area)
- [ ] Navigation works (4-5 main routes)
- [ ] Design tokens defined (colors, spacing, typography)
- [ ] Component library scaffold exists
- [ ] State management configured
- [ ] Hot reload working
- [ ] Build process works (`npm run build`)
- [ ] Architecture documented in sprint notes

---

## Implementation Notes

### Framework Selection Decision Matrix

Evaluate based on:
1. **Performance:** Time to interactive, bundle size
2. **DX (Developer Experience):** Tooling, debugging, hot reload
3. **Ecosystem:** Component libraries, visualization support
4. **Deployment:** Cloudflare Pages/Vercel compatibility
5. **Chris's Familiarity:** Existing experience/preferences

**Options:**

**A. Next.js (React)**
- ✅ Excellent performance (RSC, automatic optimization)
- ✅ Strong ecosystem (shadcn/ui, Recharts, Tailwind)
- ✅ Great Cloudflare Pages support
- ✅ TypeScript first-class
- ⚠️ More opinionated (app router learning curve)

**B. Vue 3 + Vite**
- ✅ Simple, intuitive API
- ✅ Excellent performance
- ✅ Great DX (Vite is very fast)
- ✅ Good component library (Vuetify, PrimeVue)
- ⚠️ Smaller ecosystem than React

**C. Astro + React Islands**
- ✅ Ultra-fast (mostly static)
- ✅ Can use React components where needed
- ✅ Great for content-heavy sites
- ⚠️ Overkill for this (needs full interactivity)

**Recommendation:** Next.js
- Best balance of performance, ecosystem, and deployment
- Chris has Cloudflare Workers experience (Next.js works great with CF Pages)
- shadcn/ui provides excellent component foundation
- Three.js and D3 integrate well with React

---

## Architecture Design

### Tech Stack (Proposed)
```
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- State: React Context (start simple, can add Zustand later)
- 3D: Three.js + @react-three/fiber
- Charts: Recharts (react-three/drei for 3D charts if needed)
- Build: Turbopack (built into Next.js)
- Deploy: Cloudflare Pages
```

### Component Hierarchy

```
App
├── Layout
│   ├── Header (logo, nav links, theme toggle)
│   ├── Sidebar (optional, collapsible menu)
│   └── Footer (minimal)
│
├── Pages (Routes)
│   ├── / (Home/Dashboard overview)
│   ├── /visualizer (3D room model)
│   ├── /frequency (frequency analysis)
│   ├── /simulator (treatment simulator)
│   └── /about (project info, standards)
│
└── Components (Reusable)
    ├── Controls/
    │   ├── Slider
    │   ├── Select
    │   ├── Button
    │   └── Toggle
    ├── Visualizations/
    │   ├── RoomModel3D (Sprint 3)
    │   ├── FrequencyChart (Sprint 3)
    │   └── HeatmapPlot (Sprint 3)
    ├── Metrics/
    │   ├── RT60Display
    │   ├── STIDisplay
    │   └── CostTracker
    └── UI/ (shadcn components)
        ├── Card
        ├── Tabs
        ├── Dialog
        └── ... (as needed)
```

### File Structure

```
cbc-acoustics-v2/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Home
│   │   ├── visualizer/
│   │   │   └── page.tsx
│   │   ├── frequency/
│   │   │   └── page.tsx
│   │   ├── simulator/
│   │   │   └── page.tsx
│   │   └── about/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── controls/
│   │   │   ├── Slider.tsx
│   │   │   ├── Select.tsx
│   │   │   └── ...
│   │   ├── metrics/
│   │   │   ├── RT60Display.tsx
│   │   │   └── ...
│   │   └── ui/           # shadcn components
│   │       └── ...
│   │
│   ├── lib/              # From Sprint 1
│   │   ├── acoustics/
│   │   ├── data/
│   │   └── utils/
│   │
│   ├── hooks/            # React hooks
│   │   ├── useAcoustics.ts
│   │   ├── useData.ts
│   │   └── ...
│   │
│   ├── context/          # React context providers
│   │   ├── AcousticsContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   └── styles/
│       └── globals.css
│
├── public/
│   ├── data/             # JSON files from Sprint 1
│   └── assets/           # Images, icons
│
└── tests/
    ├── unit/
    └── integration/
```

### Design System (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#f0f9ff',
          // ... (use shadcn color scale)
          600: '#0284c7', // Main brand color
          // ...
        },
        // Acoustics-specific
        rt60: {
          good: '#10b981',    // <0.3s (green)
          warning: '#f59e0b', // 0.3-0.6s (yellow)
          bad: '#ef4444'      // >0.6s (red)
        },
        sti: {
          excellent: '#10b981', // >0.75
          good: '#3b82f6',      // 0.6-0.75
          fair: '#f59e0b',      // 0.45-0.6
          poor: '#ef4444'       // <0.45
        }
      },
      spacing: {
        // Custom spacing for dashboard layout
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  }
};
```

### State Management Structure

```typescript
// src/context/AcousticsContext.tsx
type AcousticsState = {
  // Current measurement data
  selectedPosition: string;
  measurementData: MeasurementData;
  
  // Treatment simulation
  panelCount: number;
  panelThickness: 2 | 4;
  drapeCompensation: number;
  
  // Calculated metrics
  currentRT60: number;
  targetRT60: number;
  currentSTI: number;
  estimatedCost: number;
  
  // UI state
  viewMode: '2D' | '3D';
  frequencyRange: [number, number];
  showModalAnalysis: boolean;
};

type AcousticsActions = {
  setSelectedPosition: (pos: string) => void;
  updatePanelCount: (count: number) => void;
  updatePanelThickness: (thickness: 2 | 4) => void;
  updateDrapeCompensation: (value: number) => void;
  setFrequencyRange: (range: [number, number]) => void;
  toggleViewMode: () => void;
  // ...
};

export const AcousticsContext = createContext<
  AcousticsState & AcousticsActions
>(/* ... */);
```

---

## Tasks Breakdown

### Phase 1: Framework Setup (4-6 hours)
- [ ] Create Next.js project: `npx create-next-app@latest`
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Set up Tailwind: `npx shadcn-ui@latest init`
- [ ] Install dependencies:
  ```bash
  npm install three @react-three/fiber @react-three/drei
  npm install recharts
  npm install clsx tailwind-merge
  npm install -D @types/three
  ```
- [ ] Configure `next.config.js` for Cloudflare Pages
- [ ] Set up environment variables (`.env.local`)

### Phase 2: Design System (3-4 hours)
- [ ] Configure Tailwind colors (RT60/STI scales)
- [ ] Add shadcn/ui components:
  ```bash
  npx shadcn-ui@latest add button card tabs slider dialog
  ```
- [ ] Create custom components:
  - `Slider.tsx` (with RT60/STI color coding)
  - `MetricCard.tsx` (for displaying calculations)
  - `PositionSelector.tsx` (dropdown for measurement positions)
- [ ] Set up global styles (`globals.css`)
- [ ] Create component demo page (`/demo` route)

### Phase 3: Layout & Navigation (4-6 hours)
- [ ] Create `Header` component
  - Logo/title
  - Navigation links (Home, 3D, Frequency, Simulator, About)
  - Theme toggle (dark/light mode)
- [ ] Create `Sidebar` (optional, collapsible)
  - Quick links
  - Current metrics summary
- [ ] Create `Footer` component (minimal)
- [ ] Implement routing (5 main pages)
- [ ] Add loading states
- [ ] Add error boundaries

### Phase 4: State Management (3-4 hours)
- [ ] Create `AcousticsContext`
- [ ] Implement state actions (panel updates, position selection)
- [ ] Create custom hooks:
  - `useAcoustics()` - access context
  - `useRT60Calculation()` - recalculate RT60
  - `useSTICalculation()` - recalculate STI
- [ ] Connect to calculation functions from Sprint 1
- [ ] Add localStorage persistence (optional)

### Phase 5: Placeholder Pages (2-3 hours)
- [ ] Create `/` (home) - project overview
- [ ] Create `/visualizer` - "3D view coming in Sprint 3"
- [ ] Create `/frequency` - "Frequency analysis coming in Sprint 3"
- [ ] Create `/simulator` - Basic controls (no viz yet)
- [ ] Create `/about` - Standards, references, credits
- [ ] Test navigation between pages

### Phase 6: Integration & Testing (2-3 hours)
- [ ] Wire up simulator controls to state
- [ ] Display calculated RT60/STI in simulator page
- [ ] Test hot reload
- [ ] Test build process
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Run lighthouse audit (aim for >90 performance)

---

## Validation Checklist

- [ ] `npm run dev` starts server successfully
- [ ] All 5 pages render without errors
- [ ] Navigation works (click links, browser back/forward)
- [ ] Theme toggle works (dark/light mode)
- [ ] Simulator controls update state
- [ ] RT60/STI calculations display correctly
- [ ] Responsive on mobile (320px width)
- [ ] Build succeeds: `npm run build`
- [ ] Preview build: `npm run start`
- [ ] Lighthouse score >90 (performance)
- [ ] No console errors
- [ ] Documentation updated

---

## Architecture Decisions

**Document in `.claude/scratch/sprint-notes.md`:**

1. **Framework Choice:** [Next.js / Vue / Other]
   - Rationale: ...
   - Trade-offs considered: ...

2. **State Management:** [Context / Zustand / Other]
   - Rationale: ...
   - Future scalability: ...

3. **Styling Approach:** [Tailwind / CSS Modules / Styled Components]
   - Rationale: ...
   - Component library: ...

4. **3D Library:** [Three.js + R3F / Babylon.js / Other]
   - Rationale: ...
   - Performance considerations: ...

5. **Chart Library:** [Recharts / D3 / Plotly / Other]
   - Rationale: ...
   - Accessibility features: ...

---

## References

[1] Next.js docs: https://nextjs.org/docs  
[2] shadcn/ui: https://ui.shadcn.com/  
[3] Tailwind CSS: https://tailwindcss.com/docs  
[4] React Three Fiber: https://docs.pmnd.rs/react-three-fiber  
[5] Recharts: https://recharts.org/  
[6] Cloudflare Pages Next.js guide: https://developers.cloudflare.com/pages/framework-guides/nextjs/

---

**Next:** ACU004 Sprint 3: Core Visualization Components

**For Claude Code:** Execute autonomously. Document framework choice and architecture decisions in sprint notes.
