# Connections → Circles (React + Vite + Tailwind)

An interactive prototype site for **Dr. Bowtie Brian** to run the Connections → Circles playbook.

## Features
- Hero with CTA + **Starter Kit** modal (copy-to-clipboard)
- **Dashboard** with charts (Recharts) and Say=Do tracker
- **Playbook** (accordion), **Run-of-Show**, **Scripts & CTAs**
- **Events** panel (invite copier), **Newsletter Composer**
- **Circle Roster & Commitments** (editable table)
- Clean Tailwind styling, Framer Motion animations, Lucide icons

## Local Dev
```bash
npm i
npm run dev
```
Visit http://localhost:5173

## Build
```bash
npm run build
npm run preview
```

## Deploy (Netlify)
1. Push to GitHub.
2. In Netlify: **New site from Git**, choose the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. (Optional) Add `netlify.toml` in repo root (already included).

## Notes
- No external APIs required.
- All data is mock/demo; edit in `src/data.ts`.
- Adjust brand (colors/typography) in `src/styles.css`.
