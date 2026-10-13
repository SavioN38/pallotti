# Project Memory (`memory.md`)

> **CRITICAL OPERATIONAL DIRECTIVE:**
> This memory file tracks the evolving state, conventions, decisions, and history of the **Pallotti Hill Public School Website**.
> **EVERY TIME A CHANGE IS MADE TO THIS PROJECT, THIS FILE MUST BE UPDATED.**
> Record the date, author/agent, description of changes, rationale, and modified files in the [Changelog](#changelog--session-history) section below.

---

## 1. Project Snapshot

| Property | Value |
| :--- | :--- |
| **Project Name** | Pallotti Hill Public School Website |
| **GitHub Repository** | [https://github.com/SavioN38/pallotti](https://github.com/SavioN38/pallotti) |
| **Live Production Deployment** | [https://savion38.github.io/pallotti/](https://savion38.github.io/pallotti/) |
| **Hosting Platform** | GitHub Pages (`gh-pages` / static deployment via GitHub Actions) |
| **Active Branch** | `main` |
| **Frameworks & Core Tech** | React 18, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, React Router DOM 7.18 (HashRouter) |
| **Status of Build (`npm run build`)** | ✅ PASSING |
| **Status of Typecheck (`npm run typecheck`)** | ✅ PASSING (0 errors) |
| **Status of Linter (`npm run lint`)** | ✅ PASSING (0 errors) |
| **Last Verified Date** | October 13, 2026 |

---

## 2. Invariants & Development Conventions

Whenever modifying or extending this codebase, adhere strictly to these rules:

1. **GitHub Pages Routing Strategy (`HashRouter`)**:
   - The application is hosted as static files on GitHub Pages.
   - Do **NOT** replace `HashRouter` with `BrowserRouter` unless server-side fallback rules or an SPA 404 redirect script (e.g., `spa-github-pages`) are implemented.
   - Route links must use `<Link>`, `<NavLink>`, or `#` hash routes.

2. **Base URL Resolution for Static Assets**:
   - Always prepend `import.meta.env.BASE_URL.replace(/\/$/, '')` when referencing images, videos, or public files in code:
     ```ts
     const base = import.meta.env.BASE_URL.replace(/\/$/, '');
     const imageSrc = `${base}/images/school/logo.png`;
     ```
   - In `vite.config.ts`, `base` is configured dynamically (`command === 'serve' ? '/' : '/pallotti/'`).

3. **Path Aliasing**:
   - Always import modules from `src/` using the `@/` prefix (e.g., `@/components/AppHeader`, `@/data/gallery`), never long relative paths like `../../components/`.

4. **Zero-Lint Standard**:
   - Always run `npm run lint` and `npm run typecheck` before finishing any task.
   - Remove unused imports and variables immediately.

5. **Gallery Data Management**:
   - All gallery events are configured in [src/data/gallery.ts](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/data/gallery.ts).
   - Photos must be placed in `public/images/gallery-{year}/{Event Name}/` and referenced in `gallery.ts`.

6. **Design Aesthetics & Color System**:
   - Maintain the school's luxury and heritage aesthetic:
     - Deep Petrol Teal: `#173c46` / `#0d242b`
     - Sand & Warm Gold: `#d7b76d` / `#af8742` / `#f2d48e`
     - Linen/Alabaster: `#f6f5f0` / `#e4ebe8`
     - Slate/Sage text: `#426069` / `#5e757a`
   - Use Serif fonts (Georgia, Times New Roman) for headings and Inter for body text.

---

## 3. Changelog & Session History

### Entry 2026-10-13 (Automatic Date Scheduling for Christmas Theme)
- **Author/Agent**: Antigravity Assistant & SavioN38
- **Summary**: Implemented automatic calendar date scheduling for the seasonal theme:
  - Added `getAutoScheduledSeason()` in [`src/config/themeConfig.ts`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/config/themeConfig.ts):
    - **Today (Oct 13, 2026)**: Resolves to `'default'` (Classic Petrol Teal).
    - **Tomorrow (Oct 14, 2026) onwards**: Automatically activates `'christmas'` (Regal Burgundy & Champagne Gold) for user verification test.
    - **Annual Real Christmas Season**: Automatically activates December 1 through January 10.
  - Updated [`src/context/ThemeContext.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/context/ThemeContext.tsx) to read from automatic date schedule by default, while supporting interactive manual preview via `sessionStorage`.
- **Files Modified**:
  - [`src/config/themeConfig.ts`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/config/themeConfig.ts)
  - [`src/context/ThemeContext.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/context/ThemeContext.tsx)
- **Verification**:
  - `npm run lint`: Passed with 0 errors.
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Production bundle built cleanly in 27s.

---

### Entry 2026-10-13 (Photorealistic Christmas Santa Hat on School Logos)
- **Author/Agent**: Antigravity Assistant & SavioN38
- **Summary**: Upgraded and tailored the school crest Santa hat to look naturally worn:
  - Positioned hat over the upper-right curve of the crest with a natural `-6deg` tilt matching the user's mockup.
  - Hover animation: the hat smoothly floats upwards (`-translate-y-2`) while the crest spins, maintaining 100% constant size and shape without shrinking or distortion.
- **Files Modified**:
  - [`src/components/SantaHat.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/SantaHat.tsx): Enforced block-level non-distorting picture layout.
  - [`src/components/AppHeader.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/AppHeader.tsx): Placed at `-top-4 left-4` with `-rotate-[6deg]` tilt and `group-hover:-translate-y-2`.
  - [`src/components/AppFooter.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/AppFooter.tsx): Placed at `-top-3.5 left-3.5` with `-rotate-[6deg]` tilt and `group-hover:-translate-y-2`.
- **Verification**:
  - `npm run lint`: Passed with 0 errors.
  - `npm run typecheck`: Passed with 0 errors.
  - **Browser Verification**: Tested on `http://localhost:5173/`, verified both header and footer logos.

---

### Entry 2026-10-13 (Performance & Lag Reduction Optimizations)
- **Author/Agent**: Antigravity Assistant & SavioN38
- **Summary**: Identified and resolved browser rendering bottlenecks causing scroll lag:
  1. **Canvas Snowfall**: Eliminated expensive `ctx.shadowBlur` Gaussian blur rasterization on every frame; lowered particle count to 24 lightweight particles; completely cancel `requestAnimationFrame` loop when Hero section is out of view; added GPU layer promotion (`will-change-transform [transform:translateZ(0)]`).
  2. **Hero Video**: Added an `IntersectionObserver` to automatically pause the 53MB 1080p hero background video when scrolled away, saving substantial CPU/GPU decoding resources on the rest of the page.
  3. **Header Scroll Listener**: Throttled `onScroll` using `requestAnimationFrame` and added `{ passive: true }` to eliminate main-thread scroll blocking.
  4. **CSS Repaint Elimination**: Removed document-wide `transition: background-color, color` from `body` in `index.css` to prevent full-viewport repaint recalculations during scrolling.
- **Verification**:
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run typecheck`: 0 errors.
  - `npm run build`: Production bundle compiles in 6.97s (down from 10.1s).
  - **Browser Verification**: Tested on `http://localhost:5173/`, confirmed 60fps buttery smooth scroll performance through the entire 7000px page height.

---

### Entry 2026-10-13 (Seasonal Christmas Theme & Global Theme Switch Engine)
- **Author/Agent**: Antigravity Assistant & SavioN38
- **Summary**: Implemented a non-destructive seasonal theme system transforming the website into a Regal Burgundy & Champagne Gold palette for Christmas, controlled via a single global switch (`CURRENT_SEASON = 'christmas'`). Includes live `ThemeSwitcher` in header, canvas snowfall in hero, festive greeting banner, Christmas calendar events, and holiday chatbot assistant FAQs.
- **Files Created**:
  - [`src/config/themeConfig.ts`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/config/themeConfig.ts): Master seasonal configuration controlling active theme, greetings, banners, and snowfall settings.
  - [`src/context/themeContextDef.ts`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/context/themeContextDef.ts): Strongly typed React Context definition.
  - [`src/context/ThemeContext.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/context/ThemeContext.tsx): ThemeProvider component managing HTML document attributes and localStorage persistence.
  - [`src/hooks/useTheme.ts`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/hooks/useTheme.ts): Custom hook to consume seasonal theme state anywhere.
  - [`src/components/Snowfall.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/Snowfall.tsx): Lightweight, GPU-friendly canvas particle snowfall.
  - [`src/components/ThemeSwitcher.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/ThemeSwitcher.tsx): Interactive header button allowing real-time switching between 🎄 Festive and 🏛️ Classic.
- **Files Modified**:
  - [`src/index.css`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/index.css): Added seasonal CSS tokens and clean `[data-theme="christmas"]` color transformation overrides.
  - [`src/main.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/main.tsx): Wrapped application in `ThemeProvider`.
  - [`src/components/AppHeader.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/AppHeader.tsx): Integrated `ThemeSwitcher` and dynamic background glassmorphism variables.
  - [`src/pages/HomePage.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/pages/HomePage.tsx): Added `Snowfall`, dynamic hero scrims, seasonal greeting banner, and Christmas Carol Service in Calendar.
  - [`src/components/SchoolChatbot.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/SchoolChatbot.tsx): Added holiday greeting and Christmas FAQs.
- **Verification**:
  - `npm run lint`: Passed with 0 errors, 0 warnings.
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Production bundle built cleanly in ~10.1s.
  - **Browser Verification**: Tested on `http://localhost:5173/`, confirmed smooth instant theme toggling with zero reload.

---

### Entry 2026-10-13 (Documentation & Lint Cleanup)
- **Author/Agent**: Antigravity Assistant
- **Summary**: Comprehensive codebase audit, full project documentation creation, memory file initialization, and zero-lint cleanup.
- **Files Created**:
  - [`project.md`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/project.md): Complete technical blueprint, directory structure, hosting configuration, and component breakdown.
  - [`memory.md`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/memory.md): Continuous memory file initialized to record project conventions and ongoing changes.
- **Files Modified**:
  - [`src/components/LazyImage.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/LazyImage.tsx): Removed unused `isInView` state and redundant IntersectionObserver that remained after switching to native `loading="lazy"`. Removed unreferenced `containerRef`.
  - [`src/components/SchoolChatbot.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/components/SchoolChatbot.tsx): Removed 10 unused Lucide icon imports (`Sparkles`, `Phone`, `Mail`, `MapPin`, `Clock`, `GraduationCap`, `Bus`, `CreditCard`, `ChevronRight`, `HelpCircle`).
  - [`src/pages/HomePage.tsx`](file:///c:/SavioN/Pallotti_Hill_Public_School_Website/src/pages/HomePage.tsx): Removed 6 unused Lucide icon imports (`ChevronDown`, `Heart`, `MapPin`, `MoveUpRight`, `Phone`, `ArrowUpRight`).
- **Verification**:
  - `npm run lint`: Passed with 0 errors (was previously failing with 17 errors).
  - `npm run typecheck`: Passed with 0 errors.
  - `npm run build`: Production bundle built cleanly in ~9.5s.

---

### Previous Commits Reference
- `8e982755` — *Update footer copyright to 2026 SavioN38*
- `de68cd9c` — *perf: instant native image loading with fast 300ms shimmer fade*
- `952f4fa9` — *fix(mobile): minimize chatbot floating button to compact icon on phone screens*
- `597c4ffa` — *feat: skeleton shimmer photo loading, intersection observer lazy loading, and interactive school assistant chatbot*
- `d0fa45a0` — *feat: add smooth header scroll morphing and golden micro-interactions*

---

## 4. Current Roadmap & Backlog

- [ ] **Image Format Modernization**: Consider transcoding high-res event JPEGs to `.webp` or `.avif` for faster mobile load times over cellular networks.
- [ ] **Dynamic Admission Inquiries Form**: Connect the `@supabase/supabase-js` client to a Supabase table for saving contact and admission inquiries submitted via the website.
- [ ] **Archived Years Data Fill**: Populate photo collections for academic years 2022-23, 2021-22, 2020-21, and 2019-20 (currently marked as `active: false` in `src/data/gallery.ts`).
- [ ] **Automated Lint Check in CI**: Consider adding `npm run lint` step into `.github/workflows/static.yml` prior to `npm run build` to maintain zero-lint regressions automatically.
