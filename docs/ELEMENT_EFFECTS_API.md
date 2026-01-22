# Interactive DOM Effects API

A comprehensive API for applying particle, wave, and wave-based visual effects to any DOM element. Enable interactive, responsive effects on buttons, inputs, cards, text, and more.

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { ParticleSystemProvider } from '@/context/ParticleSystemContext';
import { ElementEffectsProvider } from '@/hooks/useElementEffects';

export default function App() {
  return (
    <ParticleSystemProvider>
      <ElementEffectsProvider>
        {/* Your app content */}
      </ElementEffectsProvider>
    </ParticleSystemProvider>
  );
}
```

### 2. Apply effects to elements

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

function InteractiveButton() {
  const ref = useRef<HTMLButtonElement>(null);
  
  useElementEffects(ref, BUTTON_PRESET_ENERGETIC);
  
  return (
    <button ref={ref} className="px-6 py-2 bg-blue-500 rounded-lg">
      Click me!
    </button>
  );
}
```

## Available Presets

### Button Effects

- **`BUTTON_PRESET_ENERGETIC`** - Burst particles on click, high energy (8 particles, 280° hue)
- **`BUTTON_PRESET_SUBTLE`** - Gentle hover effect (2 particles, 200° hue)
- **`BUTTON_PRESET_MYSTICAL`** - Large glowing particles on hover and click (5 particles, 260° hue)
- **`BUTTON_PRESET_SUBMIT`** - Success button effect with explosive particles (12 particles, green)
- **`BUTTON_PRESET_DANGER`** - Delete/danger button with red particles (10 particles, red)

### Input Effects

- **`INPUT_PRESET_FOCUS`** - Particles emit on focus/input (4 particles, cyan)

### Card/Container Effects

- **`CARD_PRESET_HOVER`** - Subtle animation on card hover (3 particles, blue)

### Link Effects

- **`LINK_PRESET_DIRECTIONAL`** - Particles follow cursor direction (3 particles, gold)

### Notification Effects

- **`NOTIFICATION_PRESET_SUCCESS`** - Green particles for success messages
- **`NOTIFICATION_PRESET_WARNING`** - Orange particles for warnings
- **`NOTIFICATION_PRESET_ERROR`** - Red particles for errors

### Hero/Header Effects

- **`HERO_PRESET_AMBIENT`** - Continuous ambient particles on hover (2 particles, magenta)

## Effect Configuration

All effects accept an `ElementEffectConfig` object:

```typescript
interface ElementEffectConfig {
  // Trigger options
  emitOnHover?: boolean;        // Emit particles on mouse enter
  emitOnClick?: boolean;        // Emit particles on click
  emitOnFocus?: boolean;        // Emit particles on focus (inputs)
  
  // Particle properties
  particlesPerEvent?: number;   // How many particles per event (default: 3)
  particleHue?: number;         // HSL hue 0-360 (default: random)
  particleSize?: number;        // Size in pixels (default: 2)
  particleLifetime?: number;    // Duration in ms (default: 2000)
  
  // Visual properties
  glowIntensity?: number;       // 0-1 glow strength (default: 0.8)
  rippleOnInteract?: boolean;   // Show ripple effect
  
  // Physics
  particleVelocity?: number;    // Speed 0-5 (default: 2)
  particleSpread?: number;      // Angle spread in degrees (default: 360)
  gravityStrength?: number;     // Gravity pull 0-1 (default: 0.05)
  
  // Animation
  scaleOnInteract?: number;     // Scale factor (1.05 = 5% bigger)
  rotateOnInteract?: number;    // Rotation in degrees
  duration?: number;            // Animation duration in ms
  
  // Callbacks
  onParticleEmit?: (particles) => void;
  onInteract?: (element, event) => void;
}
```

## Usage Examples

### Example 1: Basic Button with Preset

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

export function ActionButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useElementEffects(ref, BUTTON_PRESET_ENERGETIC);
  
  return (
    <button 
      ref={ref}
      onClick={() => console.log('Clicked!')}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:shadow-lg transition-shadow"
    >
      Perform Action
    </button>
  );
}
```

### Example 2: Custom Effect Configuration

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';

export function CustomButton() {
  const ref = useRef<HTMLButtonElement>(null);
  
  useElementEffects(ref, {
    emitOnClick: true,
    emitOnHover: true,
    particlesPerEvent: 6,
    particleHue: 180,           // Cyan
    particleSize: 2.5,
    particleVelocity: 3,
    glowIntensity: 0.9,
    scaleOnInteract: 1.1,
    rotateOnInteract: 8,
    duration: 250,
  });
  
  return (
    <button ref={ref} className="px-6 py-3 bg-teal-500 text-white rounded-lg">
      Custom Effect Button
    </button>
  );
}
```

### Example 3: Form with Multiple Interactive Elements

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import {
  INPUT_PRESET_FOCUS,
  BUTTON_PRESET_SUBMIT,
  BUTTON_PRESET_DANGER,
} from '@/utils/element-effects-presets';

export function InteractiveForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  useElementEffects(inputRef, INPUT_PRESET_FOCUS);
  useElementEffects(submitRef, BUTTON_PRESET_SUBMIT);
  useElementEffects(cancelRef, BUTTON_PRESET_DANGER);
  
  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          ref={inputRef}
          type="email"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
      
      <div className="flex gap-3">
        <button ref={submitRef} type="submit" className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold">
          Submit
        </button>
        <button ref={cancelRef} type="button" className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold">
          Cancel
        </button>
      </div>
    </form>
  );
}
```

### Example 4: Card with Hover Effects

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { CARD_PRESET_HOVER } from '@/utils/element-effects-presets';

export function InteractiveCard() {
  const ref = useRef<HTMLDivElement>(null);
  
  useElementEffects(ref, CARD_PRESET_HOVER);
  
  return (
    <div
      ref={ref}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
    >
      <h3 className="text-xl font-bold text-white mb-2">Interactive Card</h3>
      <p className="text-slate-300">Hover over this card to see particle effects!</p>
    </div>
  );
}
```

### Example 5: Notification with Dynamic Effects

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import {
  NOTIFICATION_PRESET_SUCCESS,
  NOTIFICATION_PRESET_ERROR,
  NOTIFICATION_PRESET_WARNING,
} from '@/utils/element-effects-presets';

export function Notification({ type = 'success' }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const presetMap = {
    success: NOTIFICATION_PRESET_SUCCESS,
    error: NOTIFICATION_PRESET_ERROR,
    warning: NOTIFICATION_PRESET_WARNING,
  };
  
  useElementEffects(ref, presetMap[type as keyof typeof presetMap]);
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  }[type];
  
  return (
    <div ref={ref} className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
      Notification with {type} effects!
    </div>
  );
}
```

### Example 6: Advanced - Merging and Customizing Presets

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { BUTTON_PRESET_ENERGETIC, mergeEffects } from '@/utils/element-effects-presets';

export function AdvancedButton() {
  const ref = useRef<HTMLButtonElement>(null);
  
  // Merge preset with custom overrides
  const customEffect = mergeEffects(BUTTON_PRESET_ENERGETIC, {
    particleHue: 60,            // Change to yellow
    glowIntensity: 1.2,
    scaleOnInteract: 1.2,       // More dramatic scale
    duration: 400,              // Slower animation
  });
  
  useElementEffects(ref, customEffect);
  
  return (
    <button ref={ref} className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-bold">
      Advanced Effect Button
    </button>
  );
}
```

### Example 7: Text Link with Directional Effect

```tsx
import { useRef } from 'react';
import { useElementEffects } from '@/hooks/useElementEffects';
import { LINK_PRESET_DIRECTIONAL } from '@/utils/element-effects-presets';

export function InteractiveLink() {
  const ref = useRef<HTMLAnchorElement>(null);
  
  useElementEffects(ref, LINK_PRESET_DIRECTIONAL);
  
  return (
    <a
      ref={ref}
      href="#"
      className="text-blue-500 hover:text-blue-600 underline font-semibold transition-colors"
    >
      Interactive Link with Directional Particles
    </a>
  );
}
```

## Advanced Features

### Random Effects

Generate randomized effects for variety:

```tsx
import { createRandomEffect } from '@/utils/element-effects-presets';
import { BUTTON_PRESET_ENERGETIC } from '@/utils/element-effects-presets';

const randomEffect = createRandomEffect(BUTTON_PRESET_ENERGETIC);
useElementEffects(ref, randomEffect);
```

### Color Gradient Effects

Create effects that transition through multiple colors:

```tsx
import { createGradientEffect } from '@/utils/element-effects-presets';
import { BUTTON_PRESET_SUBTLE } from '@/utils/element-effects-presets';

// Create 5 effect variations transitioning from purple (270°) to cyan (180°)
const gradientEffects = createGradientEffect(
  BUTTON_PRESET_SUBTLE,
  270, // purple
  180, // cyan
  5    // steps
);

// Use them in sequence or randomly
useElementEffects(ref, gradientEffects[0]);
```

### Custom Callbacks

Track and respond to particle emission:

```tsx
useElementEffects(ref, {
  emitOnClick: true,
  particlesPerEvent: 5,
  onParticleEmit: (particles) => {
    console.log(`Emitted ${particles.length} particles`);
    // Send to analytics, trigger other effects, etc.
  },
  onInteract: (element, event) => {
    console.log('Element interacted:', element, event);
  },
});
```

## Performance Considerations

1. **Particle Limits**: Keeps particle counts reasonable (typically 2-12 per event)
2. **Animation Frames**: Uses Web Animations API for smooth 60fps rendering
3. **Event Pooling**: Reuses particle objects to minimize GC pressure
4. **Cleanup**: Automatically removes effects when components unmount

## Browser Support

- Modern browsers with support for:
  - Web Animations API
  - Canvas API
  - ES6+ JavaScript
  - CSS Transforms

## Integration with Existing Systems

The Element Effects API integrates seamlessly with:
- The particle system context for emitting particles
- Wave animation systems for wave-based effects
- Visual effects utilities for rendering and styling
- Event systems for custom callbacks and tracking
