# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
This opens the app automatically at `http://localhost:3001` with hot module reloading enabled.

### 3. Build for Production
```bash
npm run build
```
Creates a `/dist` folder with your production-ready app.

---

## Available Scripts

```bash
# Development - start local server with HMR
npm run dev

# Production build - creates /dist folder
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

---

## Key Features

- **Wave Animations**: Beautiful animated wave patterns
- **Particle System**: Interactive particles with gravity wells
- **Real-time Effects**: 
  - Particle evolution with color harmonics
  - Wave breathing animations
  - Energy cascades and shockwaves
  - Chromatic aberration effects
  - Distortion fields
- **Performance**: 60+ FPS with real-time FPS monitor

---

## Project Structure

```
├── src/
│   ├── App.tsx              # Main component
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles
│   ├── components/          # React components
│   ├── hooks/               # Custom hooks
│   ├── context/             # React Context
│   ├── config/              # Configuration
│   ├── types/               # TypeScript types
│   └── utils/               # Utilities
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

---

## Development Tips

### Hot Module Reloading (HMR)
Changes to `.tsx`, `.ts`, and `.css` files automatically reload in the browser without losing state.

### TypeScript Support
Full TypeScript support with strict mode enabled. IDE autocomplete works out of the box.

### Path Aliases
Use `@/` to import from the project root:
```ts
import { WaveParticles } from '@/components/WaveParticles'
import { useTheme } from '@/hooks/useTheme'
```

### Tailwind CSS
Tailwind CSS is pre-configured with dark mode support. All CSS is compiled at build time to static files.

---

## Production Deployment

### Option 1: Vercel (Recommended)
```bash
# Connect your repo to Vercel
# It auto-detects Vite and deploys the /dist folder
```

### Option 2: Any Static Host
```bash
npm run build
# Upload contents of /dist folder to:
# - Netlify, GitHub Pages, AWS S3, etc.
```

### Option 3: Docker
```bash
docker build -t wave-particle .
docker run -p 3000:80 wave-particle
```

---

## Troubleshooting

### Port Already in Use
If port 3001 is in use, edit `vite.config.ts`:
```ts
server: {
  port: 3002,  // Change to any available port
}
```

### Module Not Found
Ensure imports use the `@/` alias:
```ts
// ✅ Correct
import { Button } from '@/components/Button'

// ❌ Wrong
import { Button } from '../components/Button'
```

### Tailwind Not Applying
Make sure `src/index.css` is imported in `src/main.tsx`:
```ts
import './index.css'  // This line must be present
```

---

## Need Help?

- Check `README.md` for detailed documentation
- See `MIGRATION_GUIDE.md` for Next.js to React migration details
- Review the browser console for error messages
- Clear cache: `rm -rf dist node_modules && npm install`

---

## Next: Explore the Code

The Wave Particle System includes:
- **Real-time canvas rendering** with optimized drawing
- **Particle physics** with gravity and collision
- **Wave generation** with multiple frequencies
- **Color harmonics** based on particle density
- **Context-based state** for particle system management

Happy coding! 🚀
