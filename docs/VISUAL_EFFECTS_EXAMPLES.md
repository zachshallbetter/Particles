# Visual Effects Examples

## Quick Examples

All of these examples can be copy-pasted directly into your app.

---

## Example 1: Cinematic Nebula Look

Perfect for movie intros or premium brand presentations.

```jsx
import { WaveParticles } from '@/components/WaveParticles';

export function CinematicView() {
  return (
    <WaveParticles
      visualEffects={{
        nebulaBackground: {
          enabled: true,
          gradientLayers: 5,
          starField: true,
          starCount: 200,
          auroraEffects: true
        },
        bloomGlare: {
          enabled: true,
          bloomIntensity: 1.0,
          godRaysEnabled: true
        },
        atmosphericDepth: {
          vignetteStrength: 0.25
        }
      }}
    />
  );
}
```

**Visual Effect:** Dark space background with shimmering stars, cosmic gradients, aurora waves, and volumetric god rays with bloom.

---

## Example 2: Clean Professional

Minimalist design suitable for corporate or SaaS applications.

```jsx
export function ProfessionalView() {
  return (
    <WaveParticles
      visualEffects={{
        particleTrails: { enabled: false },
        chromaticAberration: { enabled: false },
        nebulaBackground: { enabled: false },
        gridFieldVisualization: { enabled: false },
        causticReflections: { enabled: false },
        bloomGlare: { bloomIntensity: 0.3 },
        atmosphericDepth: { fogIntensity: 0 },
        overallIntensity: 0.7
      }}
    />
  );
}
```

**Visual Effect:** Clean waves with subtle halos and minimal glow. Professional, sleek appearance.

---

## Example 3: Gaming/High Energy

Intense, action-packed aesthetic for games or interactive experiences.

```jsx
export function GamingView() {
  return (
    <WaveParticles
      visualEffects={{
        particleTrails: {
          enabled: true,
          maxTrailLength: 40,
          glowIntensity: 0.95
        },
        chromaticAberration: {
          enabled: true,
          intensity: 0.25
        },
        bloomGlare: {
          bloomIntensity: 1.2,
          godRaysEnabled: true,
          godRayIntensity: 0.5
        },
        constellationPatterns: {
          enabled: true,
          connectionDistance: 100
        },
        distortionFields: {
          heatHazeIntensity: 0.15
        }
      }}
    />
  );
}
```

**Visual Effect:** High-energy with motion trails, color separation, intense bloom, connecting particle constellations, and heat distortion.

---

## Example 4: Calming/Meditative

Smooth, peaceful aesthetic for meditation apps or relaxation content.

```jsx
export function MeditativeView() {
  return (
    <WaveParticles
      visualEffects={{
        particleTrails: {
          enabled: true,
          maxTrailLength: 15,
          fadeSpeed: 0.05,
          glowIntensity: 0.4
        },
        waveTextureVariation: {
          breathing: true,
          breathingCycle: 6000, // Slower breathing
          energyPulses: true,
          pulseSpeed: 0.1 // Slow pulses
        },
        bloomGlare: {
          bloomIntensity: 0.5
        },
        atmosphericDepth: {
          vignetteStrength: 0.1
        },
        constellationPatterns: {
          enabled: false
        },
        overallIntensity: 0.8
      }}
    />
  );
}
```

**Visual Effect:** Gentle waves with slow breathing, soft trails, minimal energy. Calming and meditative.

---

## Example 5: Scientific/Educational

Shows underlying physics and field structures.

```jsx
export function EducationalView() {
  return (
    <WaveParticles
      visualEffects={{
        gridFieldVisualization: {
          enabled: true,
          gridType: 'hexagonal',
          gridOpacity: 0.2,
          fieldLines: true
        },
        waveInterference: {
          enabled: true,
          glowIntensity: 0.3,
          moirePattern: true
        },
        constellationPatterns: {
          enabled: true
        },
        bloomGlare: { enabled: false },
        atmosphericDepth: { enabled: false },
        particleTrails: { enabled: false }
      }}
    />
  );
}
```

**Visual Effect:** Hexagonal grid overlay, visible wave interference patterns, particle constellations. Educational and structural.

---

## Example 6: Cyberpunk/Neon

Bold, neon-colored, futuristic aesthetic.

```jsx
export function CyberpunkView() {
  return (
    <WaveParticles
      visualEffects={{
        chromaticAberration: {
          enabled: true,
          intensity: 0.3,
          wavelength: 4
        },
        bloomGlare: {
          enabled: true,
          bloomIntensity: 1.5,
          lensFlareStreaks: true
        },
        distortionFields: {
          gravitationalLensing: true,
          lensingStrength: 0.2,
          heatHazeIntensity: 0.12
        },
        particleHalos: {
          baseSize: 4,
          coronaDischarge: true,
          solarWind: true
        },
        atmosphericDepth: {
          fogIntensity: 0.1,
          vignetteStrength: 0.2
        }
      }}
    />
  );
}
```

**Visual Effect:** Intense RGB color separation, bright neon glow, lensing effects, electric halos, dark vignette edges.

---

## Example 7: Nature/Organic

Flowing, organic patterns reminiscent of natural phenomena.

```jsx
export function NatureView() {
  return (
    <WaveParticles
      visualEffects={{
        particleEvolution: {
          enabled: true,
          saturationFade: true,
          fusionEnabled: true
        },
        waveTextureVariation: {
          breathing: true,
          energyPulses: true,
          pulseSpeed: 0.15
        },
        constellationPatterns: {
          enabled: true,
          connectionDistance: 60
        },
        particleTrails: {
          enabled: true,
          fadeSpeed: 0.08
        },
        bloomGlare: {
          bloomIntensity: 0.6
        },
        nebulaBackground: { enabled: false }
      }}
    />
  );
}
```

**Visual Effect:** Evolving particles with aging, organic wave breathing, connecting constellations, motion trails, soft glow.

---

## Example 8: Mobile-Optimized

Best performance for mobile devices and lower-end hardware.

```jsx
import { PERFORMANCE_VISUAL_EFFECTS } from '@/config/visual-effects.config';

export function MobileView() {
  return (
    <WaveParticles
      visualEffects={PERFORMANCE_VISUAL_EFFECTS}
    />
  );
}
```

**Visual Effect:** Essential effects only, optimized for 60 FPS on mobile devices.

---

## Example 9: Dynamic Configuration

Change effects based on user interaction or app state.

```jsx
import { useState } from 'react';
import { WaveParticles } from '@/components/WaveParticles';
import { DEFAULT_VISUAL_EFFECTS, ULTRA_VISUAL_EFFECTS } from '@/config/visual-effects.config';

export function DynamicView() {
  const [intensity, setIntensity] = useState('default');

  const visualEffectsConfig = intensity === 'ultra' ? ULTRA_VISUAL_EFFECTS : DEFAULT_VISUAL_EFFECTS;

  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 10 }}>
        <button onClick={() => setIntensity('default')}>Default</button>
        <button onClick={() => setIntensity('ultra')}>Ultra</button>
      </div>
      <WaveParticles visualEffects={visualEffectsConfig} />
    </div>
  );
}
```

**Behavior:** Switch between different effect intensities based on user selection.

---

## Example 10: Progressive Enhancement

Start minimal and enhance based on device capabilities.

```jsx
export function ProgressiveView() {
  const [enhanced, setEnhanced] = useState(false);

  return (
    <WaveParticles
      visualEffects={{
        particleTrails: { enabled: enhanced },
        bloomGlare: { bloomIntensity: enhanced ? 1.0 : 0.5 },
        atmosphericDepth: { fogIntensity: enhanced ? 0.1 : 0.05 },
        nebulaBackground: { enabled: enhanced }
      }}
    />
  );
}
```

**Behavior:** Start with minimal effects, enhance when user action indicates they want it.

---

## Example 11: Time-Based Effects

Change effects based on time of day or app state.

```jsx
export function TimeBasedView() {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour > 18;

  return (
    <WaveParticles
      visualEffects={{
        nebulaBackground: {
          enabled: isNight,
          starField: isNight,
          auroraEffects: isNight
        },
        bloomGlare: {
          bloomIntensity: isNight ? 1.0 : 0.5
        },
        atmosphericDepth: {
          vignetteStrength: isNight ? 0.3 : 0.1
        }
      }}
    />
  );
}
```

**Behavior:** Show dark nebula at night, bright minimal effects during day.

---

## Example 12: Theme Switching

Different effects for different app themes.

```jsx
export function ThemedView({ theme }) {
  const effectConfigs = {
    light: {
      bloomGlare: { bloomIntensity: 0.4 },
      atmosphericDepth: { fogIntensity: 0.05 },
      particleTrails: { enabled: false }
    },
    dark: {
      bloomGlare: { bloomIntensity: 0.8 },
      atmosphericDepth: { fogIntensity: 0.12 },
      particleTrails: { enabled: true }
    },
    electric: {
      chromaticAberration: { enabled: true, intensity: 0.3 },
      bloomGlare: { bloomIntensity: 1.2 },
      distortionFields: { gravitationalLensing: true }
    }
  };

  return <WaveParticles visualEffects={effectConfigs[theme]} />;
}
```

**Behavior:** Switch visual effects based on selected theme.

---

## Example 13: A/B Testing

Compare two different effect configurations.

```jsx
import { MINIMAL_VISUAL_EFFECTS, ULTRA_VISUAL_EFFECTS } from '@/config/visual-effects.config';

export function ABTestView({ variant }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {variant === 'a' && <WaveParticles visualEffects={MINIMAL_VISUAL_EFFECTS} />}
      {variant === 'b' && <WaveParticles visualEffects={ULTRA_VISUAL_EFFECTS} />}
    </div>
  );
}
```

**Behavior:** Display different effect configurations side-by-side for comparison.

---

## Example 14: Conditional Features

Enable/disable specific features based on conditions.

```jsx
export function ConditionalView({ isPremium, isLowPower }) {
  return (
    <WaveParticles
      visualEffects={{
        bloomGlare: {
          enabled: isPremium,
          godRaysEnabled: isPremium && !isLowPower
        },
        causticReflections: {
          enabled: isPremium && !isLowPower
        },
        nebulaBackground: {
          enabled: isPremium && !isLowPower
        },
        particleTrails: {
          enabled: !isLowPower,
          maxTrailLength: isLowPower ? 0 : 30
        }
      }}
    />
  );
}
```

**Behavior:** Enable premium effects only for premium users and power-saving mode users.

---

## Example 15: Full Custom Configuration

Complete granular control.

```jsx
export function FullCustomView() {
  return (
    <WaveParticles
      visualEffects={{
        // Particle effects
        particleTrails: {
          enabled: true,
          maxTrailLength: 25,
          fadeSpeed: 0.12,
          glowIntensity: 0.7,
          width: 1.5
        },
        particleEvolution: {
          enabled: true,
          maxAge: 7000,
          saturationFade: true,
          growthRate: 0.12,
          maxGrowth: 0.6,
          fusionEnabled: true,
          fusionDistance: 20
        },
        particleHalos: {
          enabled: true,
          baseSize: 3.5,
          velocityScale: true,
          coronaDischarge: true,
          coronaDistance: 90,
          solarWind: true,
          streamLength: 35
        },

        // Wave effects
        waveTextureVariation: {
          enabled: true,
          energyPulses: true,
          pulseSpeed: 0.25,
          pulseSize: 2.5,
          breathing: true,
          breathingCycle: 4500
        },
        waveInterference: {
          enabled: true,
          sampleDistance: 35,
          detectionRange: 15,
          glowIntensity: 0.15,
          radius: 20,
          moirePattern: true
        },

        // Atmosphere
        atmosphericDepth: {
          enabled: true,
          fogIntensity: 0.1,
          fogColor: '#001a33',
          bokehBlur: 10,
          vignetteStrength: 0.18
        },

        // Clustering
        constellationPatterns: {
          enabled: true,
          minClusterSize: 4,
          connectionDistance: 85,
          lineOpacity: 0.35,
          nodeSize: 2.2,
          rotationSpeed: 0.25
        },

        // Bloom
        bloomGlare: {
          enabled: true,
          hdrBloom: true,
          bloomIntensity: 0.85,
          bloomRadius: 16,
          lensFlareStreaks: true,
          godRaysEnabled: false
        },

        // Distortion
        distortionFields: {
          enabled: true,
          heatHaze: true,
          heatHazeIntensity: 0.09,
          gravitationalLensing: true,
          lensingStrength: 0.11,
          pixelDisplacement: false,
          displacementAmount: 0
        },

        // Optional/disabled
        chromatic: { enabled: false },
        causticReflections: { enabled: false },
        nebulaBackground: { enabled: false },
        gridFieldVisualization: { enabled: false },

        // Global
        overallIntensity: 1.0,
        performanceMode: false
      }}
    />
  );
}
```

**Visual Effect:** Fine-tuned, professional configuration with all parameters explicitly set.

---

## Quick Copy-Paste Reference

### Disable Everything (Debug)
```jsx
<WaveParticles visualEffects={{ enabled: false }} />
```

### 50% Intensity
```jsx
<WaveParticles visualEffects={{ overallIntensity: 0.5 }} />
```

### Performance Mode
```jsx
<WaveParticles visualEffects={{ performanceMode: true }} />
```

### Single Effect On
```jsx
<WaveParticles 
  visualEffects={{
    // Disable all
    particleTrails: { enabled: false },
    bloomGlare: { enabled: false },
    // ... etc
    // Enable only one
    constellationPatterns: { enabled: true }
  }}
/>
```

---

## Tips & Tricks

1. **Start with defaults**, then customize specific effects
2. **Test on target device** before finalizing parameters
3. **Use presets as starting points**, then fine-tune
4. **Lower numbers first**, then increase for visual impact
5. **Combine complementary effects** for best visual results
6. **Disable expensive effects** on mobile/low-power devices
7. **Use overall intensity** to scale everything uniformly
