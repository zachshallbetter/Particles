'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { DEFAULT_VISUAL_EFFECTS } from '@/config/visual-effects.config';

/**
 * Emitted particle that will be injected into the rogue particle system
 */
export interface EmittedParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  opacity: number;
  lifetime: number;
  maxLifetime: number;
  glow: boolean;
  glowIntensity: number;
  // Optional: track which wave this particle is attracted to
  attractedToWave?: number;
  // Gravity/drag factors
  drag: number;
  gravity: number;
  // Mass affects how gravity influences the particle (heavier = less affected)
  mass: number;
  // Particle evolution properties
  age: number; // Time since creation
  saturation: number; // Color saturation (vibrant → pastel → faded)
  baseSize: number; // Original size for scaling
  absorptionTime?: number; // When particle was absorbed by wave (for growth)
  // Lifecycle events
  lastBurstTime?: number; // Track when particle last burst
  unstableCounter?: number; // Counter for unpredictable events
}

export interface AbsorptionBurst {
  id: string;
  x: number;
  y: number;
  hue: number; // Color of the absorbed particle
  emitterHue: number; // Color of the emitter that absorbed it
  startTime: number;
  duration: number; // milliseconds
  maxRadius: number;
  type?: 'absorption' | 'ripple' | 'shockwave'; // Different visual effects
}

interface EmitterConfig {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  hue: number;
  active: boolean;
  // Gravity properties - absorbs particles of OTHER colors
  gravityRadius: number; // radius in pixels where gravity affects particles
  gravityStrength: number; // how strongly it pulls particles
}

interface ParticleSystemContextValue {
  // Emitted particles that should be drawn by WaveParticles
  emittedParticlesRef: React.MutableRefObject<EmittedParticle[]>;
  // Absorption bursts for visual effects
  absorptionBurstsRef: React.MutableRefObject<AbsorptionBurst[]>;
  // Register an emitter
  registerEmitter: (config: EmitterConfig) => void;
  // Unregister an emitter
  unregisterEmitter: (id: string) => void;
  // Emit particles from a specific emitter
  emitParticles: (emitterId: string, count: number, options?: Partial<EmittedParticle>) => void;
  // Get all active emitters
  emitters: EmitterConfig[];
  // Apply emitter gravity (absorbs other-colored particles)
  applyEmitterGravity: () => void;
  // Apply particle-to-particle collisions and repulsion
  applyParticleCollisions: () => void;
  // Apply wave gravity (particles follow wave paths)
  applyWaveGravity: (waveLines: any[]) => void;
}

const ParticleSystemContext = createContext<ParticleSystemContextValue | null>(null);

let particleIdCounter = 0;

export const ParticleSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const emittedParticlesRef = useRef<EmittedParticle[]>([]);
  const absorptionBurstsRef = useRef<AbsorptionBurst[]>([]);
  const [emitters, setEmitters] = useState<EmitterConfig[]>([]);
  const emittersRef = useRef<EmitterConfig[]>([]);

  const registerEmitter = useCallback((config: EmitterConfig) => {
    setEmitters(prev => {
      const exists = prev.find(e => e.id === config.id);
      if (exists) {
        // Update existing emitter
        const updated = prev.map(e => e.id === config.id ? config : e);
        emittersRef.current = updated;
        return updated;
      }
      const newList = [...prev, config];
      emittersRef.current = newList;
      return newList;
    });
  }, []);

  const unregisterEmitter = useCallback((id: string) => {
    setEmitters(prev => {
      const filtered = prev.filter(e => e.id !== id);
      emittersRef.current = filtered;
      return filtered;
    });
  }, []);

  const emitParticles = useCallback((emitterId: string, count: number, options?: Partial<EmittedParticle>) => {
    const emitter = emittersRef.current.find(e => e.id === emitterId);
    if (!emitter || !emitter.active) {
      console.log('[PARTICLE] emitParticles: emitter not found or inactive', { emitterId, emitter, active: emitter?.active });
      return;
    }

    // Convert percentage position to actual screen coordinates
    const emitterX = (emitter.x / 100) * window.innerWidth;
    const emitterY = (emitter.y / 100) * window.innerHeight;

    const beforeCount = emittedParticlesRef.current.length;
    console.log('[PARTICLE] emitParticles: starting', { emitterId, count, emitterX, emitterY, beforeCount });

    for (let i = 0; i < count; i++) {
      // Random angle for emission direction
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      
      // Mass correlates with size - larger particles are heavier
      const size = 1.5 + Math.random() * 2.5;
      const mass = 0.5 + (size / 4) * 1.5; // Mass ranges from ~0.5 to ~1.5 based on size
      
      const particle: EmittedParticle = {
        id: `emitted-${particleIdCounter++}`,
        x: emitterX,
        y: emitterY,
        vx: Math.cos(angle) * speed * 0.5, // Initial outward velocity
        vy: Math.sin(angle) * speed * 0.5,
        size,
        hue: emitter.hue + (Math.random() - 0.5) * 30,
        opacity: 0.7 + Math.random() * 0.3,
        lifetime: 0,
        maxLifetime: Infinity, // Persistent - no fade/death
        glow: Math.random() < 0.15,
        glowIntensity: 0.4 + Math.random() * 0.4,
        drag: 0.999, // Very slight drag to slow down over time
        gravity: 0,
        mass, // Heavier particles are less affected by gravity
        age: 0,
        saturation: 70, // Start vibrant
        baseSize: size,
        ...options,
      };

      emittedParticlesRef.current.push(particle);
    }

    // Limit total emitted particles to prevent performance issues
    // Since particles are persistent, we cap at a reasonable number
    if (emittedParticlesRef.current.length > 150) {
      // Remove oldest particles
      emittedParticlesRef.current = emittedParticlesRef.current.slice(-120);
    }

    const afterCount = emittedParticlesRef.current.length;
    console.log('[PARTICLE] emitParticles: completed', { emitterId, count, beforeCount, afterCount, totalParticles: afterCount });
  }, []);

  /**
   * Apply wave gravity - particles follow and ride down their assigned wave paths
   * This is called AFTER emitter gravity so particles can be re-assigned to nearby waves
   */
  const applyWaveGravity = useCallback((waveLines: any[]) => {
    const particles = emittedParticlesRef.current;
    if (particles.length === 0 || !waveLines || waveLines.length === 0) return;

    const WAVE_TRACK_RADIUS = 40; // Distance from wave line to "grab" particles
    const WAVE_FOLLOW_STRENGTH = 0.3; // How strongly particles are pulled toward wave

    for (const particle of particles) {
      let closestWave: any = null;
      let closestDistance = WAVE_TRACK_RADIUS;
      let closestY = particle.y;

      // Find closest wave line
      for (const waveLine of waveLines) {
        if (!waveLine.visible) continue;

        // Estimate wave Y at particle's X position
        const frequency = waveLine.frequency || 0.02;
        const amplitude = waveLine.amplitude || 30;
        const timeStep = (Date.now() / 1000) * (waveLine.speed || 1);
        const waveY = (waveLine.verticalPosition / 100) * window.innerHeight + 
                      Math.sin(particle.x * frequency + timeStep) * amplitude;

        const distance = Math.abs(particle.y - waveY);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestWave = waveLine;
          closestY = waveY;
        }
      }

      // If particle is on a wave, make it ride along it
      if (closestWave && closestDistance < WAVE_TRACK_RADIUS) {
        // Pull particle toward the wave Y
        const yDiff = closestY - particle.y;
        particle.vy += yDiff * WAVE_FOLLOW_STRENGTH;
        
        // Particles move LEFT along the wave (negative velocity)
        particle.vx = -1.5 + Math.sin((Date.now() / 5000) * Math.PI * 2) * 0.5;
      }
    }
  }, []);

  /**
   * Apply particle-to-particle collisions and repulsion
   * Particles of different colors repel each other
   * Blue and teal particles absorb each other and merge
   */
  const applyParticleCollisions = useCallback(() => {
    const particles = emittedParticlesRef.current;
    if (particles.length < 2) return;

    const COLLISION_RADIUS = 15; // Distance at which particles interact
    const REPULSION_STRENGTH = 0.08; // How strongly particles push each other away
    const HUE_TOLERANCE = 50; // Color matching tolerance
    const BLUE_TEAL_RANGE = { min: 180, max: 240 }; // Blue-teal hue range

    // Simple O(n²) collision detection with early exits
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < COLLISION_RADIUS && distance > 0.1) {
          // Check if particles are blue/teal (absorb each other)
          const p1IsBlueTeal = p1.hue >= BLUE_TEAL_RANGE.min && p1.hue <= BLUE_TEAL_RANGE.max;
          const p2IsBlueTeal = p2.hue >= BLUE_TEAL_RANGE.min && p2.hue <= BLUE_TEAL_RANGE.max;
          
          if (p1IsBlueTeal && p2IsBlueTeal) {
            // Merge blue/teal particles - combine mass and grow
            const totalMass = (p1.mass || 1) + (p2.mass || 1);
            const avgSize = (p1.size + p2.size) / 2;
            const avgHue = (p1.hue + p2.hue) / 2;
            
            // Update p1 to be the merged particle
            p1.mass = totalMass;
            p1.size = Math.min(avgSize * 1.3, 8); // Cap max size
            p1.hue = avgHue;
            p1.absorptionTime = Date.now(); // Start growth on wave
            p1.baseSize = p1.size;
            
            // Mark p2 for removal
            absorptionBurstsRef.current.push({
              id: `merge-${Date.now()}-${Math.random()}`,
              x: p2.x,
              y: p2.y,
              hue: p2.hue,
              emitterHue: p1.hue,
              startTime: Date.now(),
              duration: 300,
              maxRadius: 15,
              type: 'absorption',
            });
            
            // Push other nearby particles away from merger point
            const mergeX = (p1.x + p2.x) / 2;
            const mergeY = (p1.y + p2.y) / 2;
            
            for (const nearbyParticle of particles) {
              if (nearbyParticle.id === p1.id || nearbyParticle.id === p2.id) continue;
              
              const ndx = nearbyParticle.x - mergeX;
              const ndy = nearbyParticle.y - mergeY;
              const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
              
              if (ndist < 40 && ndist > 0.1) {
                const pushForce = (1 - ndist / 40) * 0.3;
                nearbyParticle.vx += (ndx / ndist) * pushForce;
                nearbyParticle.vy += (ndy / ndist) * pushForce;
              }
            }
            
            // Remove p2 from particle array
            emittedParticlesRef.current = particles.filter(p => p.id !== p2.id);
            continue; // Skip further collision checks
          }
          
          // Different color particles repel
          const hueDiff = Math.abs(p1.hue - p2.hue);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const isDifferentColor = normalizedHueDiff >= HUE_TOLERANCE;
          
          if (isDifferentColor) {
            // Calculate repulsion force (stronger when closer)
            const overlap = COLLISION_RADIUS - distance;
            const repulsionForce = (overlap / COLLISION_RADIUS) * REPULSION_STRENGTH;
            
            // Apply force inversely proportional to mass - heavier particles less affected
            const force1 = repulsionForce / (p1.mass || 1);
            const force2 = repulsionForce / (p2.mass || 1);
            
            // Normalize direction
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Push particles apart
            p1.vx -= nx * force1;
            p1.vy -= ny * force1;
            p2.vx += nx * force2;
            p2.vy += ny * force2;
            
            // Create shockwave on high-energy collisions
            const relativeVelocity = Math.abs((p1.vx - p2.vx) * nx + (p1.vy - p2.vy) * ny);
            if (relativeVelocity > 1.5 && Math.random() < 0.15) {
              const collisionX = (p1.x + p2.x) / 2;
              const collisionY = (p1.y + p2.y) / 2;
              
              absorptionBurstsRef.current.push({
                id: `shockwave-${Date.now()}-${Math.random()}`,
                x: collisionX,
                y: collisionY,
                hue: (p1.hue + p2.hue) / 2,
                emitterHue: (p1.hue + p2.hue) / 2,
                startTime: Date.now(),
                duration: 500,
                maxRadius: 40,
                type: 'shockwave',
              });
            }
          }
        }
      }
    }
  }, []);

  const applyEmitterGravity = useCallback(() => {
    const particles = emittedParticlesRef.current;
    const activeEmitters = emittersRef.current.filter(e => e.active);
    
    if (particles.length === 0 || activeEmitters.length === 0) return;

    for (const emitter of activeEmitters) {
      // Convert emitter position from percentage to pixels
      const emitterX = (emitter.x / 100) * window.innerWidth;
      const emitterY = (emitter.y / 100) * window.innerHeight;

      for (const particle of particles) {
        const dx = emitterX - particle.x;
        const dy = emitterY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only affect particles within gravity radius
        if (distance < emitter.gravityRadius && distance > 0.1) {
          // Check if particle is a different color (emitters absorb OTHER colored particles)
          const hueDiff = Math.abs(particle.hue - emitter.hue);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const isDifferentColor = normalizedHueDiff > 30; // Different color threshold

          if (isDifferentColor) {
            // Calculate gravity force (stronger when closer, inverse square law)
            const normalizedDistance = distance / emitter.gravityRadius;
            const gravityForce = emitter.gravityStrength * (1 - normalizedDistance) / (particle.mass || 1);
            
            // Normalize direction
            const nx = dx / distance;
            const ny = dy / distance;
            
            // Apply gravity force
            particle.vx += nx * gravityForce;
            particle.vy += ny * gravityForce;

            // If particle is very close, absorb it
            if (distance < 5) {
              // Create absorption burst effect
              absorptionBurstsRef.current.push({
                id: `absorption-${Date.now()}-${Math.random()}`,
                x: particle.x,
                y: particle.y,
                hue: particle.hue,
                emitterHue: emitter.hue,
                startTime: Date.now(),
                duration: 400,
                maxRadius: 30,
                type: 'absorption',
              });

              // Remove absorbed particle
              emittedParticlesRef.current = particles.filter(p => p.id !== particle.id);
            }
          }
        }
      }
    }
  }, [emittedParticlesRef, absorptionBurstsRef]);

  return (
    <ParticleSystemContext.Provider value={{
      emittedParticlesRef,
      absorptionBurstsRef,
      registerEmitter,
      unregisterEmitter,
      emitParticles,
      emitters,
      applyEmitterGravity,
      applyParticleCollisions,
      applyWaveGravity,
    }}>
      {children}
    </ParticleSystemContext.Provider>
  );
};

export const useParticleSystem = () => {
  const context = useContext(ParticleSystemContext);
  if (!context) {
    throw new Error('useParticleSystem must be used within a ParticleSystemProvider');
  }
  return context;
};
