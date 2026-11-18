# Wave Particle System

A beautiful, high-performance particle and wave animation system built with React and Vite.

## 🚀 Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:4222 (the port set in vite.config.ts)
```

## 📚 Documentation

**All documentation has been organized in `/docs/`:**

- **[QUICK_START](/docs/QUICK_START.md)** - Get running in 3 steps
- **[README](/docs/README.md)** - Complete project overview
- **[DEVELOPMENT](/docs/DEVELOPMENT.md)** - Architecture & coding guide
- **[PROJECT_STRUCTURE](/docs/PROJECT_STRUCTURE.md)** - File organization
- **[MIGRATION_GUIDE](/docs/MIGRATION_GUIDE.md)** - Why we switched from Next.js
- **[FEATURES_IMPLEMENTATION](/docs/FEATURES_IMPLEMENTATION.md)** - Feature checklist
- **[DOCS_INDEX](/docs/DOCS_INDEX.md)** - All documentation index

## ✨ Features

- Wave animations with real-time particle effects
- Interactive particle emitters with physics
- 60+ FPS optimized rendering
- Color-responsive wave harmonics
- Distortion fields and visual effects
- Complete TypeScript support

## 🎯 Next Steps

1. **Get Started**: `npm run dev`
2. **Read Docs**: Start with `/docs/QUICK_START.md`
3. **Deploy**: `npm run build` then upload `/dist`

## 📊 Project Status

- ✅ Production Ready
- ✅ 0 Type Errors
- ✅ 60+ FPS Performance
- ✅ Comprehensive Documentation
- ✅ Works Anywhere (Static Build)

See **[HOUSEKEEPING_SUMMARY.md](./docs/HOUSEKEEPING_SUMMARY.md)** for full details on what's been implemented and organized.

## Repository map

- `src/`: the Vite app entry (`main.tsx`, `App.tsx`), contexts, controllers, hooks, services and the test setup in `src/test/`.
- `components/`, `controllers/`, `context/`, `config/`, `hooks/`, `lib/`, `utils/`: the particle, wave and UI components and their configuration.
- `app/`: Next.js-style pages (`page.tsx`, `sandbox`, `elements`, `effects-showcase`).
- `docs/`: the guides listed above.
- `vite.config.ts`, `vitest.config.ts`: build and test configuration.

## How to verify

```bash
npm run build       # tsc -b && vite build
npm run test:run    # vitest, one run (tests are src/**/*.test.ts(x))
```

## Limitations

The Project Status checklist above is the maintainer's own and is not backed by a check in this repository (there is no
CI). When this section was written, `npm run test:run` failed in all 59 test files (imports such as
`./ElementParticleContext` do not resolve) and `tsc -b` reported 69 type errors, so `npm run build` failed at its
`tsc -b` step. `vite build` alone completed. The package is version 0.1.0 and no release is tagged.

## License

MIT. See [LICENSE](LICENSE).
