# Development Guide

## Getting Started

See [QUICK_START.md](./QUICK_START.md) for the 3-step setup.

## Project Architecture

### Wave Particle System Overview

The project visualizes a dynamic system of colored waves with particles that emit, interact, and get absorbed back into emitters. It's built on a high-performance canvas renderer with sophisticated physics.

**Core Components**:
- **WaveParticles** - Main canvas renderer handling all animations
- **ParticleEmitter** - Visual representation of particle emitters
- **ParticleBackground** - Container managing the full system
- **FPSMonitor** - Performance measurement

### State Management

**Global State** (React Context):
- `ParticleSystemContext` - Manages particle emission, collisions, and absorption
- `useTheme` - Manages dark/light theme

**Local State** (React Hooks):
- `useWaves` - Wave state and updates
- `useParticles` - Particle generation and management
- Canvas refs and animation frame references

### Rendering Pipeline

```
WaveParticles Component
├── Clear canvas with background
├── Draw wave interference patterns
├── Draw distortion fields around emitters
├── Draw absorption burst effects (ripples, shockwaves)
├── Draw emitted particles with evolution effects
└── Draw each wave with integrated particles
```

## Adding Features

### Add a New Visual Effect

1. Create a new drawing function in `components/WaveParticles.tsx`:

```typescript
const drawMyEffect = useCallback((ctx: CanvasRenderingContext2D, config: WaveParticleConfig) => {
  // Your effect code
}, [dependencies]);
```

2. Call it in the animation loop:

```typescript
const animate = () => {
  // ... existing code
  drawMyEffect(ctx, waveConfig);
  // ... more code
};
```

3. Add it to the useEffect dependencies array.

### Modify Particle Behavior

Edit `context/ParticleSystemContext.tsx`:

1. Add new properties to `EmittedParticle` interface
2. Update particle creation in `createParticleForEmitter`
3. Update physics in `applyEmitterGravity` or `applyParticleCollisions`
4. Render changes in `WaveParticles` component

### Adjust Wave Parameters

Edit `config/wave.config.ts`:

```typescript
export const DEFAULT_WAVE_CONFIG: WaveParticleConfig = {
  lines: [
    {
      verticalPosition: new MutableRef(20),  // % from top
      frequency: 0.05,                       // Wave frequency
      amplitude: 30,                         // Wave height
      speed: 2,                              // Animation speed
      hue: 180,                              // Color (0-360)
      opacity: 0.8,
      // ... more properties
    },
  ],
  // ... other config
};
```

## Performance Optimization

### Current Optimizations

✅ **Object Pooling** - Particles reuse allocated memory
✅ **Canvas Batching** - Draw calls grouped by composite mode
✅ **Spatial Partitioning** - Collision detection uses proximity
✅ **Refs for Animation** - Avoids re-renders on every frame
✅ **Callback Memoization** - useCallback prevents recreation

### Monitoring Performance

Use the FPSMonitor component (visible in top-right corner):
- Green = 60 FPS (optimal)
- Yellow = 30-60 FPS (acceptable)
- Red = <30 FPS (needs optimization)

### If Performance Drops

1. **Reduce particle count**: `config/wave.config.ts` → `emittedParticles.emission.rate`
2. **Reduce visual effects**: Disable specific drawing functions (distortion, interference)
3. **Simplify waves**: Reduce number of wave lines or complexity
4. **Profile**: Check which function takes the most time in DevTools Performance tab

## Testing Changes Locally

### Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to components/utils/config
# Changes auto-reload (Vite HMR)

# 3. Test build
npm run build

# 4. Preview production build
npm run preview
```

### Common Issues

**Issue**: Changes don't reflect
- **Solution**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**Issue**: Build succeeds but doesn't work when deployed
- **Solution**: Check for environment-specific code or path issues. Run `npm run preview` first.

**Issue**: Performance degrades over time
- **Solution**: Check browser DevTools → Memory tab for leaks. Likely refs not properly cleaned up.

## Code Style

### Import Organization

```typescript
// 1. React imports
import React, { useRef, useCallback } from 'react';

// 2. Local imports
import { useParticleSystem } from '@/context/ParticleSystemContext';
import { WaveConfig } from '@/types/wave.types';
import { drawWave } from '@/utils/wave.utils';

// 3. Constants/config
import { ANIMATION_CONFIG } from '@/config';
```

### Naming Conventions

- Components: PascalCase (`WaveParticles.tsx`)
- Hooks: camelCase with `use` prefix (`useWaves.ts`)
- Utils: camelCase (`wave.utils.ts`)
- Types: PascalCase interfaces (`WaveParticleConfig`)
- Constants: UPPER_SNAKE_CASE (`ANIMATION_SPEED`)

### Documentation

Document complex logic with comments:

```typescript
// Why: Ripple effect pushes particles outward from absorption point
// When: Triggered when particle is absorbed by emitter
// Impact: Creates energy cascade visual effect
for (const nearbyParticle of particles) {
  const pushForce = (1 - distance / 60) * 0.5;
  nearbyParticle.vx += (dx / distance) * pushForce;
}
```

## Debugging

### Console Logging

Add temporary debug logs with `[v0]` prefix:

```typescript
console.log('[v0] Particle count:', particles.length);
console.log('[v0] FPS:', fps);
```

Remove these before committing (search for `[v0]` to find them).

### React DevTools

1. Install React DevTools Chrome extension
2. Open DevTools → React tab
3. Select components to inspect props/state
4. Use "Highlight updates when components render" to find unnecessary re-renders

### Canvas Debugging

Enable visual debugging in `WaveParticles.tsx`:

```typescript
// Draw grid to verify coordinates
ctx.strokeStyle = 'rgba(255,255,255,0.1)';
for (let x = 0; x < canvas.width; x += 50) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height);
  ctx.stroke();
}
```

## Deployment

### Build for Production

```bash
npm run build
```

Creates `/dist` folder with:
- Optimized JavaScript bundles
- Minified CSS
- Static assets

### Deploy to Vercel

```bash
# One-time setup
vercel

# Deploy (automatic on push)
git push
```

### Deploy to Other Hosts

**Netlify**:
```bash
npm run build
# Drag /dist to Netlify
```

**GitHub Pages**:
```bash
# Update package.json: "homepage": "https://username.github.io/wave-particle-system"
npm run build
# Commit /dist and push
```

**Local Server**:
```bash
npm install -g serve
serve -s dist
```

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Wave Physics](https://en.wikipedia.org/wiki/Wave)

## Getting Help

1. Check existing code patterns in similar files
2. Search codebase for similar functionality
3. Review type definitions in `/types` for API contracts
4. Check debug logs in browser console
5. Profile performance in DevTools Performance tab
