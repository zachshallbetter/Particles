# Complete Element Effects API Implementation Guide

## What Has Been Built

### 1. Core Infrastructure
- **`useElementEffects` Hook** - Main API for registering elements with effects
- **`ElementEffectsProvider`** - Global context for managing all effects
- **Full TypeScript support** - Complete type definitions for all configurations

### 2. Comprehensive Presets
16+ pre-built effect configurations including:
- **Buttons**: Energetic, Subtle, Mystical, Submit, Danger
- **Forms**: Input Focus effect
- **Containers**: Card Hover effect
- **Navigation**: Link Directional effect
- **Notifications**: Success, Warning, Error effects
- **Special**: Hero Ambient effect
- **Theme system**: Semantic naming for all effects

### 3. Utility Functions
- `mergeEffects()` - Combine presets with custom overrides
- `createRandomEffect()` - Generate varied effects with randomization
- `createGradientEffect()` - Create color transitions between hues
- `createCallbackEffect()` - Add callbacks to effect triggers
- `getThemeEffect()` - Access effects by semantic name

### 4. Sandbox Experiments (6 Unique Tools)
- **Gravity Well** - Central attraction physics
- **Wave Emitter** - Oscillating particle patterns
- **Particle Slicer** - Cursor deflection force field
- **Synchronizer** - Harmonic motion patterns
- **Color Shift Ray** - Cursor-based hue manipulation
- **Resonator** - Clustering and pulse effects

### 5. Reusable Portfolio Components
- `PortfolioNavigation` - Interactive nav links
- `ProjectCard` - Hover-enabled project displays
- `CallToActionSection` - Primary/secondary buttons
- `SkillTags` - Varied skill tag effects
- `InteractiveFormField` - Focus-reactive inputs
- `MysticalButton`, `SubmitButton`, `DangerButton` - Semantic buttons
- `SkillGrid` - Organized skill display

## Quick Start

### 1. Basic Usage

```tsx
import { useRef, useEffect } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

export function MyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    registerElement(buttonRef, BUTTON_PRESET_ENERGETIC);
  }, [registerElement]);

  return <button ref={buttonRef}>Click me!</button>;
}
```

### 2. Custom Effect

```tsx
registerElement(buttonRef, {
  emitOnClick: true,
  particlesPerEvent: 10,
  particleHue: 200,
  scaleOnInteract: 1.15,
  duration: 300,
});
```

### 3. Merge Presets

```tsx
import { mergeEffects, BUTTON_PRESET_SUBTLE } from '@/utils/element-effects-presets';

const customEffect = mergeEffects(BUTTON_PRESET_SUBTLE, {
  particleHue: 120, // Green
  glowIntensity: 0.9,
});

registerElement(buttonRef, customEffect);
```

### 4. Use Theme System

```tsx
import { getThemeEffect } from '@/utils/element-effects-presets';

registerElement(submitRef, getThemeEffect('submit'));
registerElement(deleteRef, getThemeEffect('error'));
registerElement(linkRef, getThemeEffect('link'));
```

## Effect Configuration Reference

```typescript
interface ElementEffectConfig {
  // EMISSION TRIGGERS
  emitOnHover?: boolean;           // Emit on mouse enter
  emitOnClick?: boolean;           // Emit on click
  emitOnFocus?: boolean;           // Emit on focus

  // PARTICLE PROPERTIES
  particlesPerEvent?: number;      // Count per event (2-12 typical)
  particleHue?: number;            // Color 0-360 (0=red, 120=green, 180=cyan, 240=blue, 280=purple)
  particleSize?: number;           // Size 1-5 (1=tiny, 3=medium, 5=large)
  particleLifetime?: number;       // Duration in ms (800-2000 typical)
  particleVelocity?: number;       // Speed 0.5-4 (1=slow, 2.5=medium, 4=fast)
  particleSpread?: number;         // Angle 0-360° (360=all directions, 90=quarter circle)
  glowIntensity?: number;          // Glow 0-1.2 (0.5=subtle, 0.8=normal, 1.2=intense)

  // ELEMENT TRANSFORMS
  scaleOnInteract?: number;        // Scale 1.0-1.3 (1.02=subtle, 1.1=noticeable)
  rotateOnInteract?: number;       // Rotation °(-20 to 20 typical)
  duration?: number;               // Animation ms (100-500 typical)

  // CALLBACKS
  onHover?: () => void;
  onClick?: () => void;
  onFocus?: () => void;
}
```

## Hue Values Quick Reference

```
0°    - Red
30°   - Orange
60°   - Yellow
120°  - Green
180°  - Cyan
200°  - Light Blue
220°  - Blue
260°  - Purple
280°  - Violet
```

## Common Patterns

### Pattern 1: Form with Multiple Fields

```tsx
export function SignupForm() {
  const { registerElement } = useElementEffects();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerElement(emailRef, INPUT_PRESET_FOCUS);
    registerElement(passwordRef, INPUT_PRESET_FOCUS);
    registerElement(submitRef, BUTTON_PRESET_SUBMIT);
  }, [registerElement]);

  return (
    <form>
      <input ref={emailRef} type="email" placeholder="Email" />
      <input ref={passwordRef} type="password" placeholder="Password" />
      <button ref={submitRef} type="submit">Sign Up</button>
    </form>
  );
}
```

### Pattern 2: Action Buttons Group

```tsx
export function ActionButtons() {
  const { registerElement } = useElementEffects();
  const editRef = useRef<HTMLButtonElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerElement(editRef, getThemeEffect('primary'));
    registerElement(saveRef, getThemeEffect('success'));
    registerElement(deleteRef, getThemeEffect('error'));
  }, [registerElement]);

  return (
    <div className="flex gap-2">
      <button ref={editRef}>Edit</button>
      <button ref={saveRef}>Save</button>
      <button ref={deleteRef}>Delete</button>
    </div>
  );
}
```

### Pattern 3: Card Grid

```tsx
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { registerElement } = useElementEffects();

  useEffect(() => {
    cardRefs.current.forEach((ref) => {
      if (ref) registerElement({ current: ref }, CARD_PRESET_HOVER);
    });
  }, [registerElement]);

  return (
    <div className="grid gap-6">
      {projects.map((project, idx) => (
        <div
          key={project.id}
          ref={(el) => { cardRefs.current[idx] = el; }}
          className="p-6 border rounded-lg"
        >
          {/* Card content */}
        </div>
      ))}
    </div>
  );
}
```

### Pattern 4: Skill Tags with Random Variation

```tsx
export function SkillsList({ skills }: { skills: string[] }) {
  const { registerElement } = useElementEffects();
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    tagRefs.current.forEach((ref) => {
      if (ref) {
        const randomEffect = createRandomEffect(BUTTON_PRESET_SUBTLE, 0.2);
        registerElement({ current: ref }, randomEffect);
      }
    });
  }, [registerElement]);

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, idx) => (
        <span
          key={skill}
          ref={(el) => { tagRefs.current[idx] = el; }}
          className="px-3 py-1 bg-slate-700 rounded-full text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
```

## Integration with Existing Pages

### For Portfolio Homepage

```tsx
import {
  PortfolioNavigation,
  ProjectCard,
  CallToActionSection,
  SkillTags,
  SkillGrid,
} from '@/components/PortfolioEffects';

export default function PortfolioHome() {
  return (
    <div className="min-h-screen">
      <PortfolioNavigation />
      
      <section>
        <h2>Projects</h2>
        <div className="grid gap-6">
          <ProjectCard
            title="E-Commerce Platform"
            description="Modern e-commerce solution"
            tags={['React', 'TypeScript', 'PostgreSQL']}
            href="/projects/ecommerce"
          />
          {/* More cards */}
        </div>
      </section>

      <CallToActionSection />
      
      <section>
        <SkillGrid
          title="Frontend"
          skills={['React', 'TypeScript', 'Tailwind']}
        />
      </section>
    </div>
  );
}
```

## Performance Tips

1. **Batch Registrations** - Register all elements in a single effect
2. **Use Presets** - Pre-built presets are optimized
3. **Limit Particles** - Keep `particlesPerEvent` between 2-12
4. **Cleanup** - Effects auto-cleanup on unmount
5. **Memoization** - Use useMemo for complex effect configs

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Canvas API support
- Web Animations API recommended

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Particles not appearing | Ensure WaveParticles component is on page and ElementEffectsProvider wraps app |
| Effects not triggering | Check ref is properly connected, verify config has trigger enabled |
| Performance issues | Reduce particlesPerEvent, limit active elements with effects |
| Effects resetting | Element refs must be stable, don't recreate during renders |

## Next Steps

1. **Visit Sandbox** - `/sandbox` to see all experiment tools in action
2. **Visit Effects Showcase** - `/effects-showcase` for preset demonstrations
3. **Explore Code** - Check `/components/PortfolioEffects.tsx` for implementation examples
4. **Customize** - Use mergeEffects to create your own variations
5. **Integrate** - Add components to your pages using provided utilities

## Files Created

- `/hooks/useElementEffects.ts` - Core hook and provider
- `/utils/element-effects-presets.ts` - All presets and utilities
- `/components/PortfolioEffects.tsx` - Reusable components
- `/app/sandbox/page.tsx` - Experiment sandbox
- `/docs/ELEMENT_EFFECTS_API.md` - Full API documentation
