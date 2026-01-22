# Interactive Element Effects API - Complete Documentation

A production-ready API for applying sophisticated particle, wave, and visual effects to any DOM element. Enable interactive animations on buttons, inputs, cards, links, notifications, and more.

## 🚀 Quick Start

### 1. Installation & Setup

The ElementEffectsProvider is already integrated into your app layout:

```tsx
// app/layout.tsx
<ParticleSystemProvider>
  <ElementEffectsProvider>
    {children}
  </ElementEffectsProvider>
</ParticleSystemProvider>
```

### 2. Apply Effects to Elements

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

export function MyButton() {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Apply effect configuration to button
  useElementEffects(ref, BUTTON_PRESET_ENERGETIC);
  
  return <button ref={ref}>Click me!</button>;
}
```

## 📦 What's Included

### Core Files

- **`/hooks/useElementEffects.ts`** - Main hook and context provider
- **`/utils/element-effects-presets.ts`** - 12+ effect presets for common UI elements
- **`/utils/element-effects-advanced.ts`** - Advanced utilities for complex scenarios
- **`/app/effects-showcase/page.tsx`** - Interactive demo of all effects
- **`/docs/ELEMENT_EFFECTS_API.md`** - Comprehensive documentation

### Available Presets

#### Button Effects
- `BUTTON_PRESET_ENERGETIC` - High-energy burst on click
- `BUTTON_PRESET_SUBTLE` - Gentle hover effect
- `BUTTON_PRESET_MYSTICAL` - Large glowing particles
- `BUTTON_PRESET_SUBMIT` - Success/submit button
- `BUTTON_PRESET_DANGER` - Delete/danger button

#### Input Effects
- `INPUT_PRESET_FOCUS` - Particles on focus/input

#### Container Effects
- `CARD_PRESET_HOVER` - Card hover animation
- `HERO_PRESET_AMBIENT` - Ambient header effect

#### Link Effects
- `LINK_PRESET_DIRECTIONAL` - Directional particle tracking

#### Notification Effects
- `NOTIFICATION_PRESET_SUCCESS` - Green success effect
- `NOTIFICATION_PRESET_WARNING` - Orange warning effect
- `NOTIFICATION_PRESET_ERROR` - Red error effect

## 🎨 Configuration

### ElementEffectConfig Interface

```typescript
interface ElementEffectConfig {
  // Trigger options
  emitOnHover?: boolean;        // Emit on mouse enter
  emitOnClick?: boolean;        // Emit on click
  emitOnFocus?: boolean;        // Emit on focus (inputs)
  
  // Particle properties
  particlesPerEvent?: number;   // Particles per trigger (default: 3)
  particleHue?: number;         // HSL hue 0-360
  particleSize?: number;        // Size in pixels
  particleLifetime?: number;    // Duration in ms
  
  // Visual properties
  glowIntensity?: number;       // 0-1 glow strength
  
  // Physics
  particleVelocity?: number;    // Speed 0-5
  particleSpread?: number;      // Angle spread in degrees
  gravityStrength?: number;     // Gravity 0-1
  
  // Animation
  scaleOnInteract?: number;     // Scale factor (1.1 = 10% bigger)
  rotateOnInteract?: number;    // Rotation in degrees
  duration?: number;            // Animation duration ms
  
  // Callbacks
  onParticleEmit?: (particles) => void;
  onInteract?: (element, event) => void;
}
```

## 🎯 Usage Examples

### Basic Button with Preset

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

export function ActionButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useElementEffects(ref, BUTTON_PRESET_ENERGETIC);
  
  return (
    <button ref={ref} className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold">
      Perform Action
    </button>
  );
}
```

### Custom Configuration

```tsx
export function CustomButton() {
  const ref = useRef<HTMLButtonElement>(null);
  
  useElementEffects(ref, {
    emitOnClick: true,
    emitOnHover: true,
    particlesPerEvent: 10,
    particleHue: 180,           // Cyan
    particleSize: 2.5,
    particleVelocity: 3,
    glowIntensity: 0.9,
    scaleOnInteract: 1.1,
    rotateOnInteract: 8,
    duration: 250,
  });
  
  return <button ref={ref}>Custom Effect</button>;
}
```

### Merging Presets

```tsx
import { BUTTON_PRESET_ENERGETIC, mergeEffects } from '@/utils/element-effects-presets';

const customEffect = mergeEffects(BUTTON_PRESET_ENERGETIC, {
  particleHue: 60,             // Change to yellow
  scaleOnInteract: 1.2,        // More dramatic scale
});

useElementEffects(ref, customEffect);
```

### Form with Multiple Elements

```tsx
export function InteractiveForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  useElementEffects(inputRef, INPUT_PRESET_FOCUS);
  useElementEffects(submitRef, BUTTON_PRESET_SUBMIT);
  useElementEffects(cancelRef, BUTTON_PRESET_DANGER);
  
  return (
    <form>
      <input ref={inputRef} type="email" placeholder="Email..." />
      <button ref={submitRef} type="submit">Submit</button>
      <button ref={cancelRef} type="button">Cancel</button>
    </form>
  );
}
```

### Notifications with Dynamic Effects

```tsx
export function Notification({ type = 'success' }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const effectMap = {
    success: NOTIFICATION_PRESET_SUCCESS,
    warning: NOTIFICATION_PRESET_WARNING,
    error: NOTIFICATION_PRESET_ERROR,
  };
  
  useElementEffects(ref, effectMap[type]);
  
  return <div ref={ref}>{type} notification</div>;
}
```

### Conditional Effects with Callbacks

```tsx
export function SmartButton({ isLoading, onSubmit }) {
  const ref = useRef<HTMLButtonElement>(null);
  
  useElementEffects(ref, {
    emitOnClick: !isLoading,
    particlesPerEvent: isLoading ? 2 : 8,
    particleHue: isLoading ? 200 : 280,
    glowIntensity: isLoading ? 0.4 : 1.0,
    onInteract: (element, event) => {
      console.log('Button interacted');
      onSubmit?.();
    },
    onParticleEmit: (particles) => {
      console.log(`Emitted ${particles.length} particles`);
    },
  });
  
  return (
    <button ref={ref} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Submit'}
    </button>
  );
}
```

## 🔧 Advanced Features

### Theme-Aware Effects

```tsx
import { createThemeAwareEffect } from '@/utils/element-effects-advanced';

const themeEffects = createThemeAwareEffect({
  light: { particleHue: 240, glowIntensity: 0.6 },
  dark: { particleHue: 180, glowIntensity: 0.9 },
}, 'dark');

useElementEffects(ref, themeEffects);
```

### Semantic Effects

```tsx
import { SEMANTIC_EFFECTS } from '@/utils/element-effects-advanced';

// Form validation effect
useElementEffects(inputRef, SEMANTIC_EFFECTS.form.valid);

// Loading effect
useElementEffects(buttonRef, SEMANTIC_EFFECTS.loading.active);

// User feedback
useElementEffects(confirmRef, SEMANTIC_EFFECTS.feedback.confirm);
```

### Performance Optimization

```tsx
import { getPerformancePreset } from '@/utils/element-effects-advanced';

// Adapt effects based on FPS
const preset = getPerformancePreset(currentFPS);
const config = PERFORMANCE_PRESETS[preset];
useElementEffects(ref, config);
```

### Effect Composition

```tsx
import { EffectComposer } from '@/utils/element-effects-advanced';

const composer = new EffectComposer()
  .add('base', { emitOnClick: true, particlesPerEvent: 5 })
  .add('emphasis', { scaleOnInteract: 1.1, duration: 300 })
  .add('glow', { glowIntensity: 0.9 });

const composedEffect = composer.merge('base', 'emphasis', 'glow');
useElementEffects(ref, composedEffect);
```

## 📊 Interactive Demo

Visit `/effects-showcase` to see all effects in action:

```bash
# Start dev server
npm run dev

# Navigate to
http://localhost:3000/effects-showcase
```

## ⚡ Performance Considerations

- **Particle Pooling**: Reuses particle objects to minimize garbage collection
- **Adaptive Quality**: Automatic reduction on low-end devices
- **Efficient Rendering**: Uses Web Animations API for 60fps
- **Event Delegation**: Single event listener per element
- **Auto-Cleanup**: Removes effects when components unmount

## 🔌 Integration Points

### With Particle System
- Emits particles through the global particle system context
- Particles inherit all physics and visual effects

### With Wave System
- Can integrate with wave-based interactions
- Supports wave-triggered particle emission

### With Visual Effects
- Uses the same visual effects rendering pipeline
- Supports custom color, glow, and visual styling

## 🎓 Best Practices

1. **Use Presets First** - Start with built-in presets before custom config
2. **Merge for Customization** - Use `mergeEffects()` to tweak presets
3. **Semantic Meaning** - Use effects that match the action/state semantically
4. **Performance** - Test on low-end devices; use `getPerformancePreset()`
5. **Accessibility** - Ensure effects don't distract from functionality
6. **Callbacks** - Use callbacks for analytics and state management

## 🛠️ Creating Custom Effects

```tsx
// Define reusable effect
const myCustomEffect: ElementEffectConfig = {
  emitOnClick: true,
  emitOnHover: true,
  particlesPerEvent: 6,
  particleHue: 240,
  particleSize: 2,
  particleLifetime: 1500,
  glowIntensity: 0.8,
  scaleOnInteract: 1.08,
  duration: 200,
};

// Use in component
useElementEffects(ref, myCustomEffect);
```

## 📚 File Structure

```
/hooks
  ├── useElementEffects.ts          # Main hook and provider
  └── useWaveParticleEvents.ts      # Event integration

/utils
  ├── element-effects-presets.ts    # 12+ presets
  ├── element-effects-advanced.ts   # Advanced utilities
  └── visual-effects.utils.ts       # Rendering system

/context
  └── ParticleSystemContext.tsx     # Particle emission system

/app
  ├── layout.tsx                    # Provider integration
  └── effects-showcase/page.tsx     # Interactive demo

/docs
  └── ELEMENT_EFFECTS_API.md        # Full documentation
```

## 🚀 Future Enhancements

- More presets (sliders, toggles, menu items)
- SVG element support
- Transition effects between states
- Mobile-optimized variants
- Sound effects integration
- Analytics tracking
- A11y enhancements

## 💡 Tips & Tricks

**Tip 1: Creating Gradient Effects**
```tsx
import { createGradientEffect } from '@/utils/element-effects-presets';

const gradients = createGradientEffect(
  BUTTON_PRESET_SUBTLE,
  270,  // purple
  180,  // cyan
  5     // steps
);
```

**Tip 2: Random Variety**
```tsx
import { createRandomEffect } from '@/utils/element-effects-presets';

// Each render gets slightly different effect
const randomEffect = createRandomEffect(BUTTON_PRESET_ENERGETIC);
```

**Tip 3: Disable Effects Gracefully**
```tsx
useElementEffects(ref, {
  emitOnClick: !disabled,
  particlesPerEvent: disabled ? 0 : 5,
  glowIntensity: disabled ? 0.2 : 0.8,
});
```

## 📖 Related Documentation

- See `/docs/ELEMENT_EFFECTS_API.md` for detailed API reference
- See `ElementEffectsShowcase` component for full examples
- See presets files for preset configurations
- See advanced utils for complex scenarios

---

**Made with ✨ by the Wave Particle System team**
