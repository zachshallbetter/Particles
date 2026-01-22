# Project Structure

## Current Layout

```
wave-particle-system/
├── src/                          # React entry point
│   ├── main.tsx                 # Vite entry point
│   ├── App.tsx                  # Root component
│   └── index.css                # Global styles
│
├── components/                   # React components
│   ├── WaveParticles.tsx        # Main canvas component
│   ├── ParticleEmitter.tsx      # Emitter visualization
│   ├── FPSMonitor.tsx           # Performance monitor
│   ├── ParticleBackground.tsx   # Background container
│   ├── Waves.tsx                # Wave controls
│   ├── theme-provider.tsx       # Theme context
│   └── ui/                      # UI component library (shadcn)
│
├── hooks/                        # React hooks
│   ├── useTheme.ts              # Theme management
│   ├── useWaves.ts              # Wave state management
│   ├── useParticles.ts          # Particle generation
│   ├── useWaveParticleController.ts
│   ├── useWaveParticleEvents.ts
│   └── use-mobile.ts            # Mobile detection
│
├── context/                      # React context
│   └── ParticleSystemContext.tsx # Particle system state
│
├── config/                       # Configuration files
│   ├── index.ts                 # Main config export
│   ├── colors.config.ts         # Color definitions
│   ├── wave.config.ts           # Wave settings
│   └── theme.config.ts          # Theme configuration
│
├── utils/                        # Utility functions
│   ├── wave.utils.ts            # Wave calculations
│   ├── math.utils.ts            # Math helpers
│   ├── theme.utils.ts           # Theme utilities
│   ├── performance.utils.ts     # Performance tools
│   ├── gravity-well.utils.ts    # Physics calculations
│   ├── particle-pool.utils.ts   # Object pooling
│   └── categorize-skill.utils.ts
│
├── types/                        # TypeScript types
│   ├── wave.types.ts            # Wave/particle types
│   ├── wave-control.types.ts    # Control types
│   ├── colors.types.ts          # Color types
│   └── theme.types.ts           # Theme types
│
├── events/                       # Event system
│   └── WaveParticleEventEmitter.ts
│
├── controllers/                  # Controllers
│   └── WaveParticleController.ts
│
├── lib/                          # Shared utilities
│   └── utils.ts                 # Tailwind cn() helper
│
├── public/                       # Static assets
│   ├── icon.svg
│   ├── placeholder-*.svg/jpg
│   └── icon-*-32x32.png
│
├── app/                          # ⚠️ OLD Next.js files (to be removed)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── index.html                    # HTML entry point
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
└── README.md                     # Project documentation
```

## Path Aliases (tsconfig.json)

All imports use the `@/` prefix which resolves to the root directory:

```typescript
"@/components"      → /components
"@/hooks"           → /hooks
"@/context"         → /context
"@/config"          → /config
"@/utils"           → /utils
"@/types"           → /types
"@/events"          → /events
"@/controllers"     → /controllers
"@/lib"             → /lib
"@/public"          → /public
```

## File Organization Rules

1. **Components** - React functional components with hooks
2. **Hooks** - Custom React hooks for state/effects
3. **Context** - React Context providers for global state
4. **Config** - Configuration constants and settings
5. **Utils** - Pure utility functions and helpers
6. **Types** - TypeScript interfaces and types
7. **Events** - Event emitters and handlers
8. **Controllers** - State controllers and managers

## Dependencies

### Core
- `react` - UI framework
- `react-dom` - React DOM rendering

### Styling
- `tailwindcss` - Utility-first CSS
- `autoprefixer` - PostCSS plugin
- `@tailwindcss/postcss` - Tailwind CSS plugin

### Build Tools
- `vite` - Fast build tool
- `@vitejs/plugin-react` - Vite React plugin
- `typescript` - Type checking

## Cleanup Status

- ✅ Removed Next.js dependencies
- ✅ Created Vite configuration
- ✅ Created React entry points (src/main.tsx, src/App.tsx)
- ✅ Updated TypeScript configuration for React
- ✅ Created build configurations (PostCSS, Tailwind)
- ⏳ Migration pending: Move app/ files to src/ (optional optimization)

## Scripts

```bash
npm run dev       # Start development server (port 3001)
npm run build     # Build for production (/dist)
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```
