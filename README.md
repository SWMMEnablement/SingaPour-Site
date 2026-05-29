# SingaPour-Site

A Singapore-focused **stormwater hydrology** web app — the name is a play on **Singapore + "pour"** — with interactive simulation tools for **rainfall, runoff, and discharge** analysis. Built as a TypeScript full-stack app and hosted on Replit.

**Live app:** [replit.com/@robertdickinson/SingaPour-Site](https://replit.com/@robertdickinson/SingaPour-Site)

---

## What it does

Singapore has some of the most intense tropical rainfall in the world, and managing that water is a core engineering challenge. SingaPour-Site is a lightweight, browser-based companion to that work:

- **Rainfall** — enter or generate a design storm hyetograph.
- **Runoff** — transform rainfall into runoff using simple surface-response models.
- **Discharge** — route runoff into a discharge hydrograph you can inspect and compare.
- **About / concept diagram** — the in-app About section explains the workflow with a concept diagram.

It's intentionally a *site*, not a full hydraulic model: clean charts, fast iteration, and just enough physics to build intuition before moving to SWMM5 / ICM for a full design.

---

## Features

- **Rainfall input / design storms** — specify intensity, duration, and pattern.
- **Runoff transformation** — convert rainfall to surface runoff with adjustable parameters.
- **Discharge analysis** — view the resulting discharge hydrograph.
- **Concept diagram** — in the About section, illustrating the rainfall → runoff → discharge chain.
- **Singapore framing** — design centered on tropical, high-intensity storm context.
- **TypeScript end-to-end** — shared types between client and server.

---

## Tech stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React + Vite + TypeScript |
| Charts      | Recharts / Plotly (via the chart component layer) |
| UI          | Tailwind CSS + component registry (`components.json`) |
| Backend     | Node.js + Express (`server/`) |
| Database    | Drizzle ORM (`drizzle.config.ts`) for any persistence |
| Shared code | `shared/` types & schema |
| Scripts     | `script/` for utility / batch tasks |
| Hosting     | Replit (`.replit` config) |

---

## Repository structure

```text
SingaPour-Site/
├── client/              # React + Vite frontend (rainfall, runoff, discharge UIs)
├── server/              # Express API and simulation endpoints
├── shared/              # Shared types & schema
├── script/              # Utility scripts (data prep, batch runs)
├── attached_assets/     # Visuals, including the concept diagram
├── drizzle.config.ts    # Drizzle ORM configuration
├── components.json      # UI component registry
├── package.json         # Scripts and dependencies
└── .replit              # Replit run/deploy configuration
```

---

## The rainfall → runoff → discharge chain

```
  Rainfall (mm/h)
        │
        ▼                          surface storage,
  +-------------+   losses    losses (infiltration, depression)
  |   Runoff    |  ◀────────
  +-------------+
        │
        ▼                          flow routing,
  +-------------+                  channel & pipe attenuation
  |  Discharge  |  ◀────────
  +-------------+
        │
        ▼
   Outlet hydrograph
```

Each stage is exposed in the UI so you can tweak parameters and see immediately how a tropical-intensity event propagates from sky to outfall.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

### Clone the repo

```bash
git clone https://github.com/SWMMEnablement/SingaPour-Site.git
cd SingaPour-Site
```

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The Express server serves the API and the Vite-built client.

### Build for production

```bash
npm run build
npm start
```

---

## Usage

1. Open the app and skim the **About** section for the concept diagram.
2. Enter a rainfall input (intensity / duration, or a design storm pattern).
3. Set runoff parameters (loss model, response time, area).
4. Run the simulation and inspect the **discharge hydrograph**.
5. Adjust and re-run to see how each parameter shapes the outlet response.

---

## Roadmap / ideas

- **Singapore design-storm library** — PUB / NEA standard storms baked in.
- **Multi-event compare** — plot several storms side-by-side.
- **Catchment library** — sample sub-catchments with realistic Singapore parameters.
- **Climate-change scaling** — IDF curve scaling factors for future scenarios.
- **SWMM5 export** — send the configured event into a real SWMM5 input file.
- **Bridge with Green-Infiltration** — use Green–Ampt loss output as the runoff loss model here.

---

## About

Part of the **SWMMEnablement** organization — a set of small, focused tools that pair with SWMM5 hydraulic modeling work. SingaPour-Site is the **regional / scenario** entry, focused on Singapore-style tropical rainfall.

Companion to:

- [SWMM5InpReader](https://github.com/SWMMEnablement/SWMM5InpReader) — inspect SWMM5 input files.
- [SWMM5ReportReader](https://github.com/SWMMEnablement/SWMM5ReportReader) — analyze SWMM5 report (`.RPT`) output.
- [Green-Infiltration](https://github.com/SWMMEnablement/Green-Infiltration) — interactive Green–Ampt infiltration explorer.
- [Temp-Monitor](https://github.com/SWMMEnablement/Temp-Monitor) — climate / temperature boundary-condition monitor.

Built by **Robert Dickinson**.

## License

MIT
