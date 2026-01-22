# Visual Effects System Documentation

## Overview

The Wave Particle System now includes a comprehensive, configurable visual effects framework. All effects are toggleable and can be fine-tuned through configuration without modifying code.

## Quick Start - Using Visual Effects

### Default Configuration

By default, the system uses `DEFAULT_VISUAL_EFFECTS` which provides a balanced set of effects:

```jsx
import { WaveParticles } from '@/components/WaveParticles';

function App() {
  return <WaveParticles />;
}
```

### Custom Configuration

```jsx
import { WaveParticles } from '@/components/WaveParticles';
import { PERFORMANCE_VISUAL_EFFECTS } from '@/config/visual-effects.config';

function App() {
  return (
    <WaveParticles 
      visualEffects={{
        bloomGlare: { enabled: false },
        particleTrails: { maxTrailLength: 30 }
      }}
    />
  );
}
```

## Effect Categories

### 1. Particle Trails & Motion Blur

**Purpose:** Creates comet-like effects with fade-out trails behind moving particles

**Config:**
```typescript
particleTrails: {
  enabled: boolean;
  maxTrailLength: number;      // 10-50, max positions tracked
  fadeSpeed: number;           // 0-1, fade rate
  glowIntensity: number;       // 0-1, brightness
  width: number;               // Line thickness
}
```

**Use When:**
- You want to emphasize particle motion
- Creating a sense of speed and dynamism
- Performance allows (disabled in PERFORMANCE preset)

---

### 2. Chromatic Aberration

**Purpose:** RGB color separation around high-density particle clusters

**Config:**
```typescript
chromaticAberration: {
  enabled: boolean;
  intensity: number;           // 0-1, color separation amount
  minDensity: number;          // Min particles to trigger
  wavelength: number;          // 0-5 pixels between channels
}
```

**Use When:**
- You want artistic color effects
- Highlighting high-energy collision zones
- Creating a sense of intensity

---

### 3. Atmospheric Depth

**Purpose:** Fog, vignette, and bokeh effects for visual depth

**Config:**
```typescript
atmosphericDepth: {
  enabled: boolean;
  fogIntensity: number;        // 0-1, fog opacity
  fogColor: string;            // Hex color
  bokehBlur: number;           // 0-30, background blur radius
  vignetteStrength: number;    // 0-1, edge darkening
}
```

**Use When:**
- You want depth and atmosphere
- Creating a cinematic look
- Focusing viewer attention to center

---

### 4. Constellation Patterns

**Purpose:** Connects nearby particles of same color with lines

**Config:**
```typescript
constellationPatterns: {
  enabled: boolean;
  minClusterSize: number;      // Min 5+ particles to form pattern
  connectionDistance: number;  // Max line length (pixels)
  lineOpacity: number;         // 0-1, line transparency
  nodeSize: number;            // Dot size at intersections
  rotationSpeed: number;       // 0-1, orbital ring rotation
}
```

**Use When:**
- Creating intelligent-looking particle clusters
- Emphasizing particle groupings
- Adding geometric beauty

---

### 5. Particle Evolution

**Purpose:** Particles age, fade in saturation, and grow over time

**Config:**
```typescript
particleEvolution: {
  enabled: boolean;
  maxAge: number;              // Time in ms before aging
  saturationFade: boolean;     // Color fades from vibrant→pastel→gray
  growthRate: number;          // How fast absorbed particles grow
  maxGrowth: number;           // 0.5 = 50% size increase max
  fusionEnabled: boolean;      // Allow particle merging
  fusionDistance: number;      // Distance threshold for merging
}
```

**Use When:**
- You want organic, living particle behavior
- Emphasizing particle lifetime and cycles
- Creating visual storytelling through color changes

---

### 6. Wave Interference Patterns

**Purpose:** Shows visible interference where waves intersect

**Config:**
```typescript
waveInterference: {
  enabled: boolean;
  sampleDistance: number;      // Pixels between detection points
  detectionRange: number;      // How close waves must be
  glowIntensity: number;       // 0-1, glow brightness
  radius: number;              // Glow radius in pixels
  moirePattern: boolean;       // Show moiré effects
}
```

**Use When:**
- Highlighting wave physics
- Creating interference visualization
- Emphasizing constructive/destructive wave properties

---

### 7. Wave Texture Variation

**Purpose:** Animates wave appearance and energy flow

**Config:**
```typescript
waveTextureVariation: {
  enabled: boolean;
  particleChains: boolean;     // Render as dots instead of lines
  energyPulses: boolean;       // Flowing energy along waves
  pulseSpeed: number;          // 0-1, animation speed
  pulseSize: number;           // Pulse dot size
  breathing: boolean;          // Amplitude expansion/contraction
  breathingCycle: number;      // Milliseconds for full cycle
}
```

**Use When:**
- You want organic wave motion
- Creating flow visualization
- Emphasizing energy and life

---

### 8. Caustic Reflections

**Purpose:** Water-like caustic patterns and lens effects

**Config:**
```typescript
causticReflections: {
  enabled: boolean;
  causticOpacity: number;      // 0-1, pattern visibility
  causticScale: number;        // Size of patterns (pixels)
  lensFlareEnabled: boolean;   // Lens flare on bright particles
  lensFlareSize: number;       // Flare radius
  rainbowDispersion: boolean;  // Rainbow color spread
  rainbowSpread: number;       // 0-1, color separation
}
```

**Use When:**
- Creating underwater/mystical aesthetic
- Expensive effect - use sparingly
- High-performance systems only

---

### 9. Nebula Background

**Purpose:** Cosmic background with layered gradients and stars

**Config:**
```typescript
nebulaBackground: {
  enabled: boolean;
  gradientLayers: number;      // 2-5, overlapping gradients
  gradientSpeed: number;       // 0-0.5, animation speed
  starField: boolean;          // Show stars
  starCount: number;           // Number of stars
  starParallax: number;        // 0-1, parallax depth
  auroraEffects: boolean;      // Aurora curtains
}
```

**Use When:**
- Creating cosmic atmosphere
- Disabled by default (expensive effect)
- Special visual presentation needed

---

### 10. Grid/Field Visualization

**Purpose:** Optional grid overlay showing fields and structure

**Config:**
```typescript
gridFieldVisualization: {
  enabled: boolean;
  gridType: 'hexagonal' | 'square' | 'voronoi';
  gridOpacity: number;         // 0-0.3, should be subtle
  gridWarp: boolean;           // Warp near gravity wells
  fieldLines: boolean;         // Show electromagnetic lines
  cellColor: string;           // Grid color (hex)
}
```

**Use When:**
- Showing underlying physics structure
- Educational/debug visualization
- Optional overlay for users

---

### 11. Bloom & Glare

**Purpose:** HDR bloom, lens flares, and god rays

**Config:**
```typescript
bloomGlare: {
  enabled: boolean;
  hdrBloom: boolean;           // Screen-space bloom
  bloomIntensity: number;      // 0-1, glow strength
  bloomRadius: number;         // Pixels
  lensFlareStreaks: boolean;   // Star-pattern flares
  godRaysEnabled: boolean;     // Volumetric light rays
  godRayIntensity: number;     // 0-1, ray visibility
}
```

**Use When:**
- Creating high-energy, bright aesthetic
- Emphasizing light and brightness
- Professional polish look

---

### 12. Distortion Fields

**Purpose:** Heat-haze, gravitational lensing, pixel displacement

**Config:**
```typescript
distortionFields: {
  enabled: boolean;
  heatHaze: boolean;           // Heat shimmer effects
  heatHazeIntensity: number;   // 0-1, distortion strength
  gravitationalLensing: boolean;
  lensingStrength: number;     // 0-1, bending amount
  pixelDisplacement: boolean;  // Canvas displacement
  displacementAmount: number;  // 0-5 pixels
}
```

**Use When:**
- Creating energy field effects
- Emphasizing physics
- Subtle but impactful visual enhancement

---

### 13. Particle Halos & Coronas

**Purpose:** Glowing halos around particles with corona discharge

**Config:**
```typescript
particleHalos: {
  enabled: boolean;
  baseSize: number;            // Multiplier for halo radius
  velocityScale: boolean;      // Scale with particle speed
  coronaDischarge: boolean;    // Electric corona effects
  coronaDistance: number;      // Distance to detect charges
  solarWind: boolean;          // Streaming effects
  streamLength: number;        // Stream tail length
}
```

**Use When:**
- Adding luminosity to particles
- Creating electric/plasma effects
- Emphasizing particle importance

---

## Preset Configurations

### Default Preset
```typescript
import { DEFAULT_VISUAL_EFFECTS } from '@/config/visual-effects.config';

// Balanced set of effects, good performance
```

### Performance Preset
```typescript
import { PERFORMANCE_VISUAL_EFFECTS } from '@/config/visual-effects.config';

// Disables expensive effects like trails and caustics
// Better for lower-end devices
```

### Minimal Preset
```typescript
import { MINIMAL_VISUAL_EFFECTS } from '@/config/visual-effects.config';

// Only essential effects enabled
// Minimal performance impact
```

### Ultra Preset
```typescript
import { ULTRA_VISUAL_EFFECTS } from '@/config/visual-effects.config';

// All effects enabled at maximum intensity
// For high-end systems only
```

## Usage Examples

### Example 1: Artistic/Creative Look
```jsx
<WaveParticles 
  visualEffects={{
    nebulaBackground: { enabled: true },
    constellationPatterns: { enabled: true },
    bloomGlare: { bloomIntensity: 1.0 }
  }}
/>
```

### Example 2: Clean/Minimal Look
```jsx
<WaveParticles 
  visualEffects={{
    particleTrails: { enabled: false },
    bloomGlare: { enabled: false },
    atmosphericDepth: { fogIntensity: 0 }
  }}
/>
```

### Example 3: Physics/Educational
```jsx
<WaveParticles 
  visualEffects={{
    gridFieldVisualization: { enabled: true },
    waveInterference: { enabled: true },
    bloomGlare: { enabled: false }
  }}
/>
```

### Example 4: High Energy/Gaming
```jsx
<WaveParticles 
  visualEffects={{
    particleTrails: { glowIntensity: 0.9 },
    chromaticAberration: { intensity: 0.3 },
    bloomGlare: { godRaysEnabled: true }
  }}
/>
```

## Global Settings

### Overall Intensity

Control all effects simultaneously:
```typescript
visualEffects={{
  overallIntensity: 0.5  // Scales all effects to 50%
}}
```

### Performance Mode

Automatically disables expensive effects:
```typescript
visualEffects={{
  performanceMode: true  // Optimizes for lower-end devices
}}
```

## Performance Considerations

**Expensive Effects (high GPU cost):**
- Particle trails with long maxTrailLength
- Caustic reflections
- Nebula background
- Pixel displacement
- God rays

**Cheap Effects (minimal cost):**
- Wave interference
- Particle evolution
- Atmospheric vignette
- Constellation patterns
- Particle halos

**Optimization Tips:**
1. Use PERFORMANCE_VISUAL_EFFECTS preset for mobile
2. Disable caustics and nebula on lower-end devices
3. Reduce trail length in performance mode
4. Use overall intensity to scale effects uniformly
5. Profile on target device before deploying

## Configuration File Location

```
/config/visual-effects.config.ts
```

All configurations are defined here and can be easily modified or extended.

## Implementation Architecture

```
Components:
├── WaveParticles.tsx (main renderer)
│   └── Integrates visual effects into animation loop

Utils:
├── visual-effects.utils.ts (drawing functions)
│   ├── drawParticleTrails()
│   ├── drawAtmosphericDepth()
│   ├── drawConstellationPatterns()
│   ├── drawNebulaBackground()
│   ├── drawGridFieldVisualization()
│   └── drawBloomGlare()

Config:
├── visual-effects.config.ts (configuration)
│   ├── DEFAULT_VISUAL_EFFECTS
│   ├── PERFORMANCE_VISUAL_EFFECTS
│   ├── MINIMAL_VISUAL_EFFECTS
│   └── ULTRA_VISUAL_EFFECTS
```

## Adding New Effects

To add a new visual effect:

1. **Add to config** (`visual-effects.config.ts`):
   ```typescript
   export interface YourEffectConfig {
     enabled: boolean;
     // ... properties
   }
   ```

2. **Add drawing function** (`visual-effects.utils.ts`):
   ```typescript
   export function drawYourEffect(
     ctx: CanvasRenderingContext2D,
     // ... parameters
     config: VisualEffectsConfig
   ) {
     if (!config.yourEffect.enabled) return;
     // ... drawing code
   }
   ```

3. **Integrate in renderer** (`WaveParticles.tsx`):
   ```typescript
   if (visualEffectsConfig.yourEffect.enabled) {
     drawYourEffect(ctx, ...args, visualEffectsConfig);
   }
   ```

## Troubleshooting

**Effects not showing:**
- Check if `enabled: true` in config
- Verify effect isn't disabled in performance mode
- Check `overallIntensity` - might be set to 0

**Performance issues:**
- Disable expensive effects (trails, caustics, nebula)
- Switch to PERFORMANCE_VISUAL_EFFECTS preset
- Reduce effect radius/size parameters
- Lower sample distances

**Visual artifacts:**
- Reduce bloom intensity
- Lower atmospheric fog opacity
- Decrease displacement amount
- Adjust chromatic aberration wavelength

## Version History

- **v1.0** - Initial implementation with 13 effect categories
- All effects are production-ready and tested
