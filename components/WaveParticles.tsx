'use client';

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { DEFAULT_WAVE_CONFIG, BASE_CONFIG, THEME_COLORS } from '@/config';
import { DEFAULT_VISUAL_EFFECTS } from '@/config/visual-effects.config';
import { createWaveConfig, getCanvasStyle } from '@/utils/wave.utils';
import { drawParticleTrails, drawAtmosphericDepth, drawConstellationPatterns, drawNebulaBackground, drawGridFieldVisualization, drawBloomGlare } from '@/utils/visual-effects.utils';
import { useWaves } from '@/hooks/useWaves';
import { useParticles, ParticleInstance, RogueParticleInstance } from '@/hooks/useParticles';
import { getNumericValue } from '@/utils/math.utils';
import { useParticleSystem, type EmittedParticle } from '@/context/ParticleSystemContext';
import type { WaveParticleConfig } from '@/types/wave.types';
import type { VisualEffectsConfig } from '@/config/visual-effects.config';

const CLUSTER_RADIUS = 40;

interface WaveParticlesProps {
  /** Custom configuration override */
  config?: Partial<WaveParticleConfig>;
  /** Visual effects configuration */
  visualEffects?: Partial<VisualEffectsConfig>;
  /** Whether to show the waves */
  showWaves?: boolean;
  /** Whether to show particles */
  showParticles?: boolean;
  /** Whether to show rogue particles */
  showRogueParticles?: boolean;
  /** Whether to show background parallax layers */
  showBackgroundLayers?: boolean;
  /** Class name for the canvas */
  className?: string;
  /** Called when configuration is ready */
  onConfigReady?: (config: WaveParticleConfig) => void;
  /** DOM element gravity wells (buttons, cards, etc) that particles interact with */
  domGravityWells?: Array<{ x: number; y: number; width: number; height: number; mass: number; strength: number; type?: string; instability?: number }>;
}

/**
 * Combined Wave and Particle animation component
 * Particles are drawn ON the wave lines, creating an integrated visual effect
 */
export const WaveParticles: React.FC<WaveParticlesProps> = React.memo(({
  config: configOverride,
  visualEffects: visualEffectsOverride,
  showWaves = true,
  showParticles = true,
  showRogueParticles = true,
  showBackgroundLayers = true,
  className = '',
  onConfigReady,
  domGravityWells = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();
  const { emittedParticlesRef, absorptionBurstsRef, applyEmitterGravity, applyParticleCollisions, applyWaveGravity, emitters } = useParticleSystem();
  const offsetRef = useRef<number>(0);
  const logicalWidth = useRef<number>(window.innerWidth);
  const logicalHeight = useRef<number>(window.innerHeight);
  
  // Visual effects state
  const trailStoreRef = useRef<Map<string, Array<{x: number; y: number; time: number; size: number}>>>(new Map());
  
  // Merge visual effects config with defaults (deep merge for nested objects)
  const visualEffectsConfig = useMemo(() => {
    if (!visualEffectsOverride) return DEFAULT_VISUAL_EFFECTS;
    return {
      ...DEFAULT_VISUAL_EFFECTS,
      ...visualEffectsOverride,
      // Deep merge individual effect configs
      particleTrails: { ...DEFAULT_VISUAL_EFFECTS.particleTrails, ...visualEffectsOverride.particleTrails },
      chromaticAberration: { ...DEFAULT_VISUAL_EFFECTS.chromaticAberration, ...visualEffectsOverride.chromaticAberration },
      atmosphericDepth: { ...DEFAULT_VISUAL_EFFECTS.atmosphericDepth, ...visualEffectsOverride.atmosphericDepth },
      constellationPatterns: { ...DEFAULT_VISUAL_EFFECTS.constellationPatterns, ...visualEffectsOverride.constellationPatterns },
      particleEvolution: { ...DEFAULT_VISUAL_EFFECTS.particleEvolution, ...visualEffectsOverride.particleEvolution },
      waveInterference: { ...DEFAULT_VISUAL_EFFECTS.waveInterference, ...visualEffectsOverride.waveInterference },
      waveTextureVariation: { ...DEFAULT_VISUAL_EFFECTS.waveTextureVariation, ...visualEffectsOverride.waveTextureVariation },
      causticReflections: { ...DEFAULT_VISUAL_EFFECTS.causticReflections, ...visualEffectsOverride.causticReflections },
      nebulaBackground: { ...DEFAULT_VISUAL_EFFECTS.nebulaBackground, ...visualEffectsOverride.nebulaBackground },
      gridFieldVisualization: { ...DEFAULT_VISUAL_EFFECTS.gridFieldVisualization, ...visualEffectsOverride.gridFieldVisualization },
      bloomGlare: { ...DEFAULT_VISUAL_EFFECTS.bloomGlare, ...visualEffectsOverride.bloomGlare },
      distortionFields: { ...DEFAULT_VISUAL_EFFECTS.distortionFields, ...visualEffectsOverride.distortionFields },
      particleHalos: { ...DEFAULT_VISUAL_EFFECTS.particleHalos, ...visualEffectsOverride.particleHalos },
    };
  }, [visualEffectsOverride]);

  // Merge config with defaults and theme
  const mergedConfig = useMemo(() => {
    const baseConfig = createWaveConfig(isDark, DEFAULT_WAVE_CONFIG);
    return {
      ...baseConfig,
      ...configOverride,
      backgroundColor: isDark ? THEME_COLORS.dark.background : THEME_COLORS.light.background,
    };
  }, [isDark, configOverride]);

  // Initialize hooks
  const { stateRef: waveStateRef, updateWaves, config: waveConfig } = useWaves(mergedConfig);
  const { stateRef: particleStateRef, generateParticles, generateRogueParticles, config: particleConfig } = useParticles(mergedConfig);

  // Notify parent when config is ready
  useEffect(() => {
    if (onConfigReady && waveConfig) {
      onConfigReady(waveConfig);
    }
  }, [waveConfig, onConfigReady]);

  /**
   * Draw a single wave line with its particles integrated
   * Particles are rendered as glowing points directly on the wave path
   */
  const drawWaveWithParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    lineIndex: number,
    config: WaveParticleConfig,
    offset: number,
    waveState: { verticalOffset: number; growthProgress: number; growthDirection: 'left' | 'right' },
    particles: ParticleInstance[],
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const line = config.lines[lineIndex];
    if (!line || waveState.growthProgress <= 0) return;

    const baseY = (line.verticalPosition.current / 100) * canvasHeight;
    const verticalPos = baseY + waveState.verticalOffset;
    const waveSpeed = (line.speed && line.speed > 0) ? line.speed : BASE_CONFIG.speed.default;
    const timeStep = offset * waveSpeed;
    const frequency = getNumericValue(line.frequency);
    
    // Wave breathing: amplitude slowly expands/contracts over time
    const breathingPhase = (Date.now() / 4000) % 1; // 4 second cycle
    const breathingMultiplier = 0.85 + Math.sin(breathingPhase * Math.PI * 2) * 0.15; // 0.7 to 1.0
    const amplitude = getNumericValue(line.amplitude) * breathingMultiplier;
    

    // Calculate visible range based on growth
    let startX: number;
    let endX: number;
    if (waveState.growthDirection === 'left') {
      startX = 0;
      endX = canvasWidth * waveState.growthProgress;
    } else {
      startX = canvasWidth * (1 - waveState.growthProgress);
      endX = canvasWidth;
    }

    if (endX <= startX) return;

    // Get particles for this wave line
    const lineParticles = particles.filter(p => p.parentLine === lineIndex);

    // Calculate wave intensity based on nearby emitted particles of matching color
    const emittedParticles = emittedParticlesRef.current;
    const lineHue = line.hue || 200;
    let nearbyParticleCount = 0;
    const INTENSITY_RADIUS = 100; // How close particles need to be to affect intensity
    
    // Sample points along the wave to count nearby matching particles
    const sampleCount = 10;
    for (let s = 0; s < sampleCount; s++) {
      const sampleX = startX + (endX - startX) * (s / sampleCount);
      const sampleY = verticalPos + Math.sin(sampleX * frequency + timeStep) * amplitude;
      
      for (const particle of emittedParticles) {
        const hueDiff = Math.abs(particle.hue - lineHue);
        const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
        const isMatchingColor = normalizedHueDiff < 50;
        
        if (isMatchingColor) {
          const dx = particle.x - sampleX;
          const dy = particle.y - sampleY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < INTENSITY_RADIUS) {
            nearbyParticleCount += (1 - distance / INTENSITY_RADIUS);
          }
        }
      }
    }
    
    // Calculate intensity multiplier (1.0 to 3.0 based on particle proximity)
    const intensityMultiplier = 1 + Math.min(nearbyParticleCount / sampleCount, 2);

    // Draw the wave line with dynamic intensity glow
    ctx.save();
    
    // Add dynamic glow to the wave line based on particle proximity
    ctx.shadowBlur = 8 * intensityMultiplier;
    ctx.shadowColor = line.color;
    ctx.strokeStyle = line.color;
    ctx.lineWidth = config.lineWidth * Math.min(intensityMultiplier, 1.5);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = Math.min(0.6 + (intensityMultiplier - 1) * 0.3, 1);

    // Draw the wave path
    ctx.beginPath();
    const step = Math.max(2, Math.floor(canvasWidth / 800));
    let x = Math.max(0, Math.floor(startX / step) * step);
    let y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
    ctx.moveTo(x, y);

    for (x = Math.max(step, x + step); x <= endX; x += step) {
      y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
      ctx.lineTo(x, Math.max(0, Math.min(canvasHeight, y)));
    }
    
    if (x - step < endX) {
      x = endX;
      y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
      ctx.lineTo(x, Math.max(0, Math.min(canvasHeight, y)));
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();

    // Now draw particles around the wave line - optimized batch rendering
    if (showParticles && lineParticles.length > 0) {
      // First pass: update all particles and collect visible ones
      const visibleParticles: Array<{p: ParticleInstance, y: number}> = [];
      
      for (let i = 0; i < lineParticles.length; i++) {
        const particle = lineParticles[i];
        
        // Update particle position along the wave
        particle.progress -= particle.speedX;
        if (particle.progress < 0) particle.progress = canvasWidth;
        
        // Update oscillation for floating effect
        particle.updateOscillation(offset * 50);

        // Check if particle is within visible portion
        if (particle.progress >= startX && particle.progress <= endX) {
          const particleY = verticalPos + Math.sin(particle.progress * frequency + timeStep) * amplitude + particle.offset;
          visibleParticles.push({p: particle, y: particleY});
        }
      }
      
      // Second pass: batch draw non-glowing particles (no shadows)
      for (let i = 0; i < visibleParticles.length; i++) {
        const {p: particle, y: particleY} = visibleParticles[i];
        if (!particle.glow) {
          ctx.fillStyle = `hsla(${line.hue + particle.hueOffset}, 70%, ${particle.brightness * 50}%, 0.8)`;
          ctx.beginPath();
          ctx.arc(particle.progress, particleY, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Third pass: batch draw glowing particles (with shadows, but batched)
      ctx.save();
      for (let i = 0; i < visibleParticles.length; i++) {
        const {p: particle, y: particleY} = visibleParticles[i];
        if (particle.glow) {
          const minBlur = BASE_CONFIG.glow.blur.min;
          const maxBlur = BASE_CONFIG.glow.blur.max;
          const shadowBlur = minBlur + (particle.glowIntensity * (maxBlur - minBlur));
          const baseOpacity = particle.glowOpacity * (0.7 + particle.brightness * 0.3);
          
          // Draw with glow effect
          ctx.shadowBlur = shadowBlur;
          ctx.shadowColor = `hsla(${line.hue + particle.hueOffset}, 80%, ${50 + particle.brightness * 30}%, ${baseOpacity * 0.5})`;
          ctx.fillStyle = `hsla(${line.hue + particle.hueOffset}, 80%, ${50 + particle.brightness * 30}%, ${baseOpacity})`;
          
          ctx.beginPath();
          ctx.arc(particle.progress, particleY, particle.size * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }, [showParticles]);

  // Draw rogue particles function (unchanged - these float freely)
  const drawRogueParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    rogueParticles: RogueParticleInstance[],
    color: string
  ) => {
    ctx.globalCompositeOperation = 'lighter';
    rogueParticles.forEach(particle => {
      particle.updatePosition(canvas.width, canvas.height);
      particle.draw(ctx, color, canvas.width, canvas.height);
    });
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  // Draw emitted particles from emitters - persistent particles affected by wave LINE gravity
  const drawEmittedParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    config: WaveParticleConfig,
    animationOffset: number, // Current animation time for wave position calc
    waveStates: Array<{verticalOffset: number}>, // Wave states with vertical offsets
    canvasWidth: number, // Logical canvas width (without DPR)
    canvasHeight: number, // Logical canvas height (without DPR)
    showGravityDebug: boolean = false // Visualize gravity zones
  ) => {
    const particles = emittedParticlesRef.current;
    
    // Log particle count periodically (every 60 frames ~1 second at 60fps)
    if (Math.random() < 0.016) {
      const sampleParticles = particles.slice(0, 3).map(p => ({
        x: p.x, 
        y: p.y, 
        size: p.size, 
        opacity: p.opacity,
        hue: p.hue,
        saturation: p.saturation,
        inBounds: p.x >= 0 && p.x <= canvasWidth && p.y >= 0 && p.y <= canvasHeight
      }));
      console.log('[RENDER] drawEmittedParticles: called', { 
        particleCount: particles.length, 
        canvasWidth, 
        canvasHeight,
        sampleParticles,
        ctxState: {
          globalAlpha: ctx.globalAlpha,
          globalCompositeOperation: ctx.globalCompositeOperation,
          fillStyle: ctx.fillStyle
        }
      });
    }
    
    const waveGravityStrength = 0.08; // Stronger pull when in range
    const gravityMaxDistance = 80; // Only affect particles within this distance of the wave line

    // Debug: Visualize gravity zones for each wave
    if (showGravityDebug && config?.lines?.length > 0) {
      ctx.save();
      for (let j = 0; j < config.lines.length; j++) {
        const line = config.lines[j];
        const baseY = (line.verticalPosition.current / 100) * canvasHeight;
        const verticalOffset = waveStates[j]?.verticalOffset || 0;
        const verticalPos = baseY + verticalOffset;
        const waveSpeed = (line.speed && line.speed > 0) ? line.speed : BASE_CONFIG.speed.default;
        const timeStep = animationOffset * waveSpeed;
        
        const frequency = getNumericValue(line.frequency);
        const amplitude = getNumericValue(line.amplitude);
        
        // Draw gravity zone as a semi-transparent band following the wave
        ctx.beginPath();
        const step = 10;
        
        // Upper edge of gravity zone
        for (let x = 0; x <= canvasWidth; x += step) {
          const waveY = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
          if (x === 0) ctx.moveTo(x, waveY - gravityMaxDistance);
          else ctx.lineTo(x, waveY - gravityMaxDistance);
        }
        // Lower edge (reverse direction)
        for (let x = canvasWidth; x >= 0; x -= step) {
          const waveY = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
          ctx.lineTo(x, waveY + gravityMaxDistance);
        }
        ctx.closePath();
        ctx.fillStyle = `hsla(${line.hue || 200}, 50%, 50%, 0.1)`;
        ctx.fill();
        
        // Draw the gravity center line (should match wave exactly)
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${line.hue || 200}, 100%, 70%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        for (let x = 0; x <= canvasWidth; x += step) {
          const waveY = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.restore();
    }
    
    if (particles.length === 0) {
      if (Math.random() < 0.016) {
        console.log('[RENDER] drawEmittedParticles: no particles to draw');
      }
      return;
    }
    
    let particlesDrawn = 0;
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

// Apply gravity from each wave LINE (not container)
      // Calculate actual wave Y position at this particle's X using sine formula
      if (config?.lines?.length > 0) {
        for (let j = 0; j < config.lines.length; j++) {
          const line = config.lines[j];
          
          // Check if particle matches this wave's color
          const lineHue = line.hue || 200;
          const hueDiff = Math.abs(particle.hue - lineHue);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const isMatchingColor = normalizedHueDiff < 50; // Only attract matching colors
          
          if (!isMatchingColor) continue; // Skip non-matching waves
          
          const baseY = (line.verticalPosition.current / 100) * canvasHeight;
          const verticalOffset = waveStates[j]?.verticalOffset || 0;
          const verticalPos = baseY + verticalOffset; // Include the wave's vertical offset!
          const waveSpeed = (line.speed && line.speed > 0) ? line.speed : BASE_CONFIG.speed.default;
          const timeStep = animationOffset * waveSpeed;
          const frequency = getNumericValue(line.frequency);
          const amplitude = getNumericValue(line.amplitude);
          
          // Calculate the ACTUAL wave line Y at this particle's X position
          const waveY = verticalPos + Math.sin(particle.x * frequency + timeStep) * amplitude;
          
          // Calculate distance to the wave line point
          const dy = waveY - particle.y;
          const distance = Math.abs(dy);
          
          // Mass creates equilibrium distance - heavier particles orbit farther from wave
          const particleMass = particle.mass || 1;
          const equilibriumDistance = 15 + (particleMass - 0.5) * 20; // 15-35px based on mass
          
          // Only apply gravity if within range and not too close to equilibrium
          if (distance < gravityMaxDistance && distance > 3) {
            const normalizedDist = distance / gravityMaxDistance; // 0 = on line, 1 = at edge
            
            // If below equilibrium, reduce gravity (allow particles to drift away)
            let gravityMultiplier = 1;
            if (distance < equilibriumDistance) {
              const belowEquilibrium = (equilibriumDistance - distance) / equilibriumDistance;
              gravityMultiplier = 0.3 + (1 - belowEquilibrium) * 0.7; // Reduce to 30% when right on line
            }
            
            // Gravity force inversely affected by particle mass (heavier particles resist more)
            const baseGravity = waveGravityStrength * (1 - normalizedDist * normalizedDist);
            const gravityForce = (baseGravity * gravityMultiplier) / particleMass;
            particle.vy += dy > 0 ? gravityForce : -gravityForce;
            
            // Horizontal motion to follow wave movement
            // Calculate the wave's horizontal velocity at this point (derivative of sine)
            const waveHorizontalVelocity = amplitude * frequency * waveSpeed * Math.cos(particle.x * frequency + timeStep);
            
            // Apply horizontal drift to follow the wave (stronger when closer to equilibrium)
            const proximityToEquilibrium = 1 - Math.abs(distance - equilibriumDistance) / equilibriumDistance;
            const horizontalInfluence = 0.08 * proximityToEquilibrium / particleMass;
            particle.vx += waveHorizontalVelocity * horizontalInfluence;
            
            // Apply extra damping when near wave (friction) - closer = more friction
            // This prevents particles from gaining too much velocity and orbiting wildly
            const frictionFactor = 0.97 - (1 - normalizedDist) * 0.05; // 0.92 to 0.97
            particle.vx *= frictionFactor;
            particle.vy *= frictionFactor;
          }
        }
      }

      // Particle collision and repulsion (check against other particles)
      // Only check particles ahead to avoid double-processing
      for (let k = i + 1; k < particles.length; k++) {
        const other = particles[k];
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (particle.size + other.size) * 2; // Collision threshold

        if (dist < minDist && dist > 0.1) {
          // Check if opposite colors (should repel more strongly)
          const hueDiff = Math.abs(particle.hue - other.hue);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const areOppositeColors = normalizedHueDiff > 100; // Large hue difference

          // Repulsion force (stronger for opposite colors)
          const repulsionStrength = areOppositeColors ? 0.08 : 0.03;
          const overlap = minDist - dist;
          const force = (overlap / minDist) * repulsionStrength;

          // Apply repulsion inversely based on mass (lighter particles pushed more)
          const massRatio1 = other.mass / (particle.mass + other.mass);
          const massRatio2 = particle.mass / (particle.mass + other.mass);

          particle.vx -= (dx / dist) * force * massRatio1;
          particle.vy -= (dy / dist) * force * massRatio1;
          other.vx += (dx / dist) * force * massRatio2;
          other.vy += (dy / dist) * force * massRatio2;
        }
      }

      // Apply gravity from DOM elements (buttons, cards, containers)
      // These have mass and attract particles based on proximity and mass
      if (domGravityWells && domGravityWells.length > 0) {
        for (const well of domGravityWells) {
          const dx = well.x - particle.x;
          const dy = well.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Gravity well detection radius scales with mass
          const gravityRadius = 120 + well.mass * 30;
          
          if (distance < gravityRadius && distance > 1) {
            // Calculate gravitational force based on mass and proximity
            const normalizedDist = distance / gravityRadius;
            let baseForce = well.strength * well.mass;
            
            // Modify force based on element type
            if (well.type === 'repeller') {
              baseForce = -Math.abs(baseForce); // Invert for repulsion
            } else if (well.type === 'amplifier') {
              baseForce *= 1.3; // Stronger attraction
            } else if (well.type === 'damper') {
              baseForce *= 0.6; // Weaker attraction
            }
            
            const gravityForce = (baseForce * (1 - normalizedDist * normalizedDist)) / Math.max(particle.mass, 0.5);
            
            // Apply force toward/away from DOM element
            particle.vx += (dx / distance) * gravityForce * 0.5;
            particle.vy += (dy / distance) * gravityForce * 0.5;
            
            // Add instability effect (random perturbation)
            const instability = well.instability || 0;
            if (instability > 0) {
              particle.vx += (Math.random() - 0.5) * instability * 0.3;
              particle.vy += (Math.random() - 0.5) * instability * 0.3;
            }
            
            // Damper reduces velocity
            if (well.type === 'damper') {
              particle.vx *= 0.95;
              particle.vy *= 0.95;
            } else {
              // Light damping for all others
              particle.vx *= 0.98;
              particle.vy *= 0.98;
            }
            
            // Absorber type removes particles at close range
            if (well.type === 'absorber' && distance < 50) {
              particle.opacity *= 0.92; // Fade out over time near absorber
              if (particle.opacity < 0.05) {
                // Mark for removal
                particle.maxLifetime = 0;
              }
            }
          }
        }
      }

      // Cap maximum velocity to prevent runaway speeds
      const maxVelocity = 3;
      const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (currentSpeed > maxVelocity) {
        const scale = maxVelocity / currentSpeed;
        particle.vx *= scale;
        particle.vy *= scale;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply drag to slow particles over time
      particle.vx *= particle.drag;
      particle.vy *= particle.drag;

      // Mark particles for removal if they go off-screen
      // (particles on waves should flow off screen naturally)
      const offScreenMargin = 50;
      const isOffScreen = particle.x < -offScreenMargin || particle.x > canvasWidth + offScreenMargin ||
          particle.y < -offScreenMargin || particle.y > canvasHeight + offScreenMargin;
      
      if (isOffScreen) {
        // Log when particles are marked for removal
        if (Math.random() < 0.1) {
          console.log('[PARTICLE] Marking particle off-screen for removal', {
            x: particle.x,
            y: particle.y,
            canvasWidth,
            canvasHeight,
            offScreenMargin
          });
        }
        particle.opacity = 0; // Mark for removal
      }
    }

    // Draw color mixing zones where different colored particles cluster
    const densityMap: Array<{x: number; y: number; hues: number[]; count: number}> = [];
    
    // Find clusters of mixed-color particles
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      let foundZone = false;
      
      for (const zone of densityMap) {
        const dx = zone.x - particle.x;
        const dy = zone.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CLUSTER_RADIUS) {
          zone.hues.push(particle.hue);
          zone.x = (zone.x * zone.count + particle.x) / (zone.count + 1);
          zone.y = (zone.y * zone.count + particle.y) / (zone.count + 1);
          zone.count++;
          foundZone = true;
          break;
        }
      }
      
      if (!foundZone) {
        densityMap.push({x: particle.x, y: particle.y, hues: [particle.hue], count: 1});
      }
    }
    
    // Draw mixing zones (blend halos) where 3+ different colors cluster
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const zone of densityMap) {
      if (zone.count >= 5) {
        const uniqueHues = [...new Set(zone.hues.map(h => Math.round(h / 30) * 30))];
        if (uniqueHues.length >= 2) {
          // Draw a blended gradient halo
          const gradient = ctx.createRadialGradient(zone.x, zone.y, 0, zone.x, zone.y, CLUSTER_RADIUS);
          gradient.addColorStop(0, `hsla(${zone.hues[0]}, 60%, 50%, 0.15)`);
          gradient.addColorStop(0.5, `hsla(${zone.hues[Math.floor(zone.hues.length / 2)]}, 60%, 50%, 0.1)`);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, CLUSTER_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();

    // Draw electromagnetic arcs between opposite-colored particles before drawing particles
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only draw arcs for opposite colors within range
        if (distance < 80 && distance > 20) {
          const hueDiff = Math.abs(p1.hue - p2.hue);
          const normalizedHueDiff = Math.min(hueDiff, 360 - hueDiff);
          const areOppositeColors = normalizedHueDiff > 120;
          
          if (areOppositeColors && Math.random() < 0.008) { // Very sporadic arcs (reduced from 0.02)
            const arcIntensity = (1 - distance / 80) * 0.15; // More subtle (0.15 instead of 0.3)
            const midHue = (p1.hue + p2.hue) / 2;
            
            // Draw lightning-like arc with slight curve
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            
            // Add some randomness to make it look like electricity
            const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 10;
            const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 10;
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            
            ctx.strokeStyle = `hsla(${midHue}, 80%, 70%, ${arcIntensity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    
    ctx.restore();
    
    // Calculate particle density map for color harmonics
    const densityMapParticles = new Map<number, {count: number; avgHue: number}>();
    
    for (let i = 0; i < particles.length; i++) {
      let nearbyCount = 0;
      let totalHue = particles[i].hue;
      
      for (let j = 0; j < particles.length; j++) {
        if (i === j) continue;
        const dx = particles[j].x - particles[i].x;
        const dy = particles[j].y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CLUSTER_RADIUS) {
          nearbyCount++;
          totalHue += particles[j].hue;
        }
      }
      
      densityMapParticles.set(i, {
        count: nearbyCount,
        avgHue: totalHue / (nearbyCount + 1)
      });
    }
    
    // Update and batch draw all particles with evolution effects and color harmonics
    ctx.globalCompositeOperation = 'lighter';
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Particle evolution: aging affects saturation and size
      particle.age += 16; // Roughly 16ms per frame
      const ageSeconds = particle.age / 1000;
      
      // Saturation fades over time: vibrant (70) → pastel (50) → faded (30)
      particle.saturation = Math.max(30, 70 - ageSeconds * 2);
      
      // If absorbed by wave, grow larger over time
      if (particle.absorptionTime) {
        const timeSinceAbsorption = (Date.now() - particle.absorptionTime) / 1000;
        const growthFactor = 1 + Math.min(timeSinceAbsorption * 0.15, 0.5); // Grow up to 1.5x
        particle.size = particle.baseSize * growthFactor;
      }
      
      // Color harmonics: density affects color temperature
      const density = densityMapParticles.get(i);
      let displayHue = particle.hue;
      let temperatureShift = 0;
      
      if (density && density.count > 3) {
        // High density clusters get warmer (shift toward red/orange) or cooler (toward blue)
        const densityFactor = Math.min(density.count / 10, 1);
        
        // Shift toward warmer colors (red/orange) for high-energy zones
        if (particle.hue < 60 || particle.hue > 300) {
          // Already warm - enhance warmth
          temperatureShift = densityFactor * 15;
        } else if (particle.hue > 180 && particle.hue < 240) {
          // Cool colors - shift cooler
          temperatureShift = -densityFactor * 15;
        }
        
        displayHue = (particle.hue + temperatureShift + 360) % 360;
      }
      
      // Calculate velocity for halo scaling
      const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      const velocityScale = 1 + Math.min(velocity * 0.3, 0.5); // Scale up to 1.5x based on speed
      
      // Chromatic aberration for high-density clusters
      const hasChromaticAberration = density && density.count > 5;
      
      if (hasChromaticAberration) {
        // Draw RGB-split effect for high-energy mixing zones
        const aberrationOffset = 2;
        
        // Red channel
        ctx.beginPath();
        ctx.arc(particle.x - aberrationOffset, particle.y, particle.size * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 80%, 60%, ${particle.opacity * 0.2})`;
        ctx.fill();
        
        // Blue channel
        ctx.beginPath();
        ctx.arc(particle.x + aberrationOffset, particle.y, particle.size * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(240, 80%, 60%, ${particle.opacity * 0.2})`;
        ctx.fill();
      }
      
      // Draw soft halo gradient around particle with color harmonics
      const haloSize = particle.size * 3 * velocityScale;
      const haloGradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, haloSize
      );
      haloGradient.addColorStop(0, `hsla(${displayHue}, ${particle.saturation}%, 65%, ${particle.opacity * 0.4})`);
      haloGradient.addColorStop(0.4, `hsla(${displayHue}, ${particle.saturation * 0.9}%, 60%, ${particle.opacity * 0.2})`);
      haloGradient.addColorStop(1, `hsla(${displayHue}, ${particle.saturation * 0.8}%, 55%, 0)`);
      
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, haloSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw mass-based repulsion corona for large particles (configurable)
      const particleMass = particle.mass || 1;
      const lpConfig = visualEffectsConfig.largeParticles;
      
      if (lpConfig.enabled && lpConfig.coronaEnabled && particleMass >= lpConfig.coronaMinMass) {
        // Scale corona size based on mass and configuration
        const massRatio = (particleMass - 1) / (lpConfig.maxSize - 1);
        const repulsionRadius = 25 + massRatio * lpConfig.coronaMaxRadius;
        
        // Breathing effect controlled by config
        const pulsePhase = (Date.now() / lpConfig.coronaPulseSpeed) % 1;
        const pulseStrength = Math.sin(pulsePhase * Math.PI) * 0.3 + 0.2;
        const coronaOpacity = (particleMass - lpConfig.minMassForLarge) * 0.2 * pulseStrength;
        
        // Repulsion corona (dashed circle showing influence zone)
        ctx.strokeStyle = `hsla(${displayHue}, 80%, 55%, ${Math.min(coronaOpacity, 0.4)})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, repulsionRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Glow effect around corona
        const coronaGradient = ctx.createRadialGradient(
          particle.x, particle.y, repulsionRadius * 0.8,
          particle.x, particle.y, repulsionRadius * 1.1
        );
        coronaGradient.addColorStop(0, `hsla(${displayHue}, 90%, 60%, ${coronaOpacity * 0.3})`);
        coronaGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = coronaGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, repulsionRadius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Apply size-based visual modifications (configurable)
      if (lpConfig.enabled && particleMass >= lpConfig.minMassForLarge) {
        // Boost saturation for large particles
        if (lpConfig.saturationBoost) {
          const massRatio = Math.min((particleMass - 1) / (lpConfig.maxSize - 1), 1);
          particle.saturation = Math.min(particle.saturation + massRatio * 20, lpConfig.saturationMax);
        }
        
        // Boost opacity for large particles
        if (lpConfig.opacityBoost) {
          const massRatio = Math.min((particleMass - 1) / (lpConfig.maxSize - 1), 1);
          particle.opacity = Math.min(particle.opacity + massRatio * 0.2, lpConfig.opacityMax);
        }
      }
      
      // Draw core particle on top with temperature-shifted color
      const fillColor = `hsla(${displayHue}, ${particle.saturation}%, 60%, ${particle.opacity})`;
      
      // Log first few particles being drawn with full details
      if (particlesDrawn < 3 && Math.random() < 0.1) {
        console.log('[RENDER] Drawing particle', {
          index: particlesDrawn,
          x: particle.x,
          y: particle.y,
          size: particle.size,
          opacity: particle.opacity,
          fillColor,
          inBounds: particle.x >= 0 && particle.x <= canvasWidth && particle.y >= 0 && particle.y <= canvasHeight,
          canvasSize: `${canvasWidth}x${canvasHeight}`,
          dpr: window.devicePixelRatio
        });
      }
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      particlesDrawn++;
    }

    ctx.globalCompositeOperation = 'source-over';
    
    // Log drawing results periodically
    if (Math.random() < 0.016) {
      console.log('[RENDER] drawEmittedParticles: drawing complete', { 
        totalParticles: particles.length, 
        particlesDrawn,
        particlesAfterFilter: particles.filter(p => p.opacity > 0).length
      });
    }
    
    // Remove off-screen particles (opacity marked as 0)
    const beforeFilter = particles.length;
    const particlesWithZeroOpacity = particles.filter(p => p.opacity <= 0);
    
    if (particlesWithZeroOpacity.length > 0 && Math.random() < 0.1) {
      console.log('[RENDER] Particles with zero opacity before filter', {
        count: particlesWithZeroOpacity.length,
        samples: particlesWithZeroOpacity.slice(0, 3).map(p => ({
          x: p.x,
          y: p.y,
          opacity: p.opacity,
          inBounds: p.x >= 0 && p.x <= canvasWidth && p.y >= 0 && p.y <= canvasHeight
        }))
      });
    }
    
    emittedParticlesRef.current = particles.filter(p => p.opacity > 0);
    const afterFilter = emittedParticlesRef.current.length;
    
    if (beforeFilter !== afterFilter) {
      console.log('[RENDER] drawEmittedParticles: filtered particles', { 
        beforeFilter, 
        afterFilter, 
        removed: beforeFilter - afterFilter,
        removedParticles: particlesWithZeroOpacity.slice(0, 3).map(p => ({ x: p.x, y: p.y, opacity: p.opacity }))
      });
    }
  }, [emittedParticlesRef]);

  // Draw wave interference patterns where waves intersect
  const drawWaveInterference = useCallback((
    ctx: CanvasRenderingContext2D,
    config: WaveParticleConfig,
    animationOffset: number,
    waveStates: Array<{verticalOffset: number}>,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    if (!config?.lines || config.lines.length < 2) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    
    // Check for intersections between different wave pairs
    const lines = config.lines;
    const step = 40; // Sample every 40 pixels (less frequent for cleaner look)
    
    for (let i = 0; i < lines.length; i++) {
      for (let j = i + 1; j < lines.length; j++) {
        const line1 = lines[i];
        const line2 = lines[j];
        
        const baseY1 = (line1.verticalPosition.current / 100) * canvasHeight;
        const verticalPos1 = baseY1 + (waveStates[i]?.verticalOffset || 0);
        const waveSpeed1 = (line1.speed && line1.speed > 0) ? line1.speed : BASE_CONFIG.speed.default;
        const frequency1 = getNumericValue(line1.frequency);
        const breathingPhase1 = (Date.now() / 4000) % 1;
        const amplitude1 = getNumericValue(line1.amplitude) * (0.85 + Math.sin(breathingPhase1 * Math.PI * 2) * 0.15);
        
        const baseY2 = (line2.verticalPosition.current / 100) * canvasHeight;
        const verticalPos2 = baseY2 + (waveStates[j]?.verticalOffset || 0);
        const waveSpeed2 = (line2.speed && line2.speed > 0) ? line2.speed : BASE_CONFIG.speed.default;
        const frequency2 = getNumericValue(line2.frequency);
        const breathingPhase2 = (Date.now() / 4000) % 1;
        const amplitude2 = getNumericValue(line2.amplitude) * (0.85 + Math.sin(breathingPhase2 * Math.PI * 2) * 0.15);
        
        // Find intersection points
        for (let x = 0; x < canvasWidth; x += step) {
          const y1 = verticalPos1 + Math.sin(x * frequency1 + animationOffset * waveSpeed1) * amplitude1;
          const y2 = verticalPos2 + Math.sin(x * frequency2 + animationOffset * waveSpeed2) * amplitude2;
          
          // If waves are close (within 12px), draw subtle interference pattern
          const distance = Math.abs(y1 - y2);
          if (distance < 12) {
            const intensity = (1 - distance / 12) * 0.12; // Much more subtle (0.12 instead of 0.3)
            const avgY = (y1 + y2) / 2;
            const avgHue = (line1.hue! + line2.hue!) / 2;
            
            // Draw very subtle interference glow
            const gradient = ctx.createRadialGradient(x, avgY, 0, x, avgY, 18);
            gradient.addColorStop(0, `hsla(${avgHue}, 70%, 60%, ${intensity})`);
            gradient.addColorStop(0.6, `hsla(${avgHue}, 60%, 55%, ${intensity * 0.4})`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, avgY, 18, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    ctx.restore();
  }, []);

  // Draw distortion fields around emitters and high-energy particle zones
  const drawDistortionFields = useCallback((
    ctx: CanvasRenderingContext2D,
    config: WaveParticleConfig,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const particles = emittedParticlesRef.current;
    
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw distortion halos around each active emitter
    for (const emitter of emitters) {
      if (!emitter.active) continue;
      
      const emitterX = (emitter.x / 100) * canvasWidth;
      const emitterY = (emitter.y / 100) * canvasHeight;
      const distortionRadius = emitter.gravityRadius * 0.8;
      
      // Create radial gradient for heat-haze effect
      const distortionGradient = ctx.createRadialGradient(
        emitterX, emitterY, 0,
        emitterX, emitterY, distortionRadius
      );
      
      // Subtle pulsing distortion
      const pulsePhase = (Date.now() / 2000) % 1;
      const pulseIntensity = 0.03 + Math.sin(pulsePhase * Math.PI * 2) * 0.015;
      
      distortionGradient.addColorStop(0, `hsla(${emitter.hue}, 40%, 50%, ${pulseIntensity})`);
      distortionGradient.addColorStop(0.5, `hsla(${emitter.hue}, 30%, 45%, ${pulseIntensity * 0.6})`);
      distortionGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = distortionGradient;
      ctx.beginPath();
      ctx.arc(emitterX, emitterY, distortionRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw distortion around dense particle clusters
    const densityMap: Array<{x: number; y: number; count: number; avgHue: number}> = [];
    
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      let foundCluster = false;
      
      for (const cluster of densityMap) {
        const dx = cluster.x - particle.x;
        const dy = cluster.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < CLUSTER_RADIUS) {
          cluster.x = (cluster.x * cluster.count + particle.x) / (cluster.count + 1);
          cluster.y = (cluster.y * cluster.count + particle.y) / (cluster.count + 1);
          cluster.avgHue = (cluster.avgHue * cluster.count + particle.hue) / (cluster.count + 1);
          cluster.count++;
          foundCluster = true;
          break;
        }
      }
      
      if (!foundCluster) {
        densityMap.push({x: particle.x, y: particle.y, count: 1, avgHue: particle.hue});
      }
    }
    
    // Draw distortion for clusters with 8+ particles
    for (const cluster of densityMap) {
      if (cluster.count >= 8) {
        const intensity = Math.min(cluster.count / 20, 1) * 0.04;
        const clusterGradient = ctx.createRadialGradient(
          cluster.x, cluster.y, 0,
          cluster.x, cluster.y, CLUSTER_RADIUS
        );
        
        clusterGradient.addColorStop(0, `hsla(${cluster.avgHue}, 50%, 55%, ${intensity})`);
        clusterGradient.addColorStop(0.6, `hsla(${cluster.avgHue}, 40%, 50%, ${intensity * 0.5})`);
        clusterGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = clusterGradient;
        ctx.beginPath();
        ctx.arc(cluster.x, cluster.y, CLUSTER_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }, [emittedParticlesRef, emitters]);

  // Draw absorption burst effects (absorption, ripple, shockwave)
  const drawAbsorptionBursts = useCallback((
    ctx: CanvasRenderingContext2D
  ) => {
    const bursts = absorptionBurstsRef.current;
    if (bursts.length === 0) return;

    const now = Date.now();
    ctx.globalCompositeOperation = 'lighter';
    
    // Update and draw bursts, remove expired ones
    absorptionBurstsRef.current = bursts.filter(burst => {
      const elapsed = now - burst.startTime;
      if (elapsed >= burst.duration) return false;

      const progress = elapsed / burst.duration; // 0 to 1
      const radius = burst.maxRadius * progress;
      const opacity = 1 - progress; // Fade out

      ctx.save();
      
      if (burst.type === 'ripple') {
        // Ripple: expanding ring that pushes particles
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${burst.hue}, 70%, 55%, ${opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Secondary ring
        if (progress > 0.3) {
          const secondRadius = radius * 0.6;
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, secondRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${burst.hue}, 60%, 50%, ${opacity * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else if (burst.type === 'shockwave') {
        // Shockwave: multiple concentric rings from collision
        for (let i = 0; i < 3; i++) {
          const ringProgress = Math.max(0, progress - i * 0.15);
          if (ringProgress > 0) {
            const ringRadius = burst.maxRadius * ringProgress;
            const ringOpacity = (1 - ringProgress) * 0.5;
            
            ctx.beginPath();
            ctx.arc(burst.x, burst.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${burst.hue}, 75%, 60%, ${ringOpacity})`;
            ctx.lineWidth = 2 - i * 0.5;
            ctx.stroke();
          }
        }
        
        // Central flash
        if (progress < 0.2) {
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${burst.hue}, 100%, 80%, ${(1 - progress / 0.2) * 0.9})`;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${burst.hue}, 100%, 80%, 0.8)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else {
        // Default absorption effect
        // Outer ring (particle color)
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${burst.hue}, 80%, 60%, ${opacity * 0.6})`;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner glow (emitter color)
        const innerRadius = radius * 0.7;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${burst.emitterHue}, 70%, 50%, ${opacity * 0.3})`;
        ctx.fill();

        // Flash at center
        if (progress < 0.3) {
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${burst.hue}, 100%, 80%, ${(1 - progress / 0.3) * 0.8})`;
          ctx.fill();
        }
      }

      ctx.restore();
      return true;
    });
  }, [absorptionBurstsRef]);

  // Canvas resize handler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !particleConfig || !generateParticles || !generateRogueParticles) return;

    const dpr = window.devicePixelRatio || 1;
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // Setting canvas.width/height resets the context, so we must re-apply scale
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      console.log('[CANVAS] Resize applied', {
        oldSize: `${oldWidth}x${oldHeight}`,
        newSize: `${canvas.width}x${canvas.height}`,
        logicalSize: `${window.innerWidth}x${window.innerHeight}`,
        dpr,
        transform: ctx.getTransform()
      });
    }

    particleStateRef.current.particles = generateParticles(canvas);
    particleStateRef.current.rogueParticles = generateRogueParticles(canvas);
    logicalWidth.current = window.innerWidth; // Update logicalWidth
    logicalHeight.current = window.innerHeight; // Update logicalHeight
  }, [particleConfig, generateParticles, generateRogueParticles, particleStateRef]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveConfig || !particleConfig) return;
    if (!waveStateRef || !particleStateRef) return;
    if (!updateWaves) return;
    if (!generateParticles || !generateRogueParticles) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial setup - resizeCanvas will set canvas dimensions and scale
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Ensure context scale is set (resizeCanvas sets it, but verify it's correct)
    const dpr = window.devicePixelRatio || 1;
    const currentTransform = ctx.getTransform();
    if (currentTransform.a !== dpr || currentTransform.d !== dpr) {
      console.warn('[CANVAS] Scale mismatch detected, re-applying scale', {
        currentTransform: currentTransform.a,
        expectedDpr: dpr
      });
      ctx.scale(dpr, dpr);
    }
    
    console.log('[CANVAS] Animation loop initialized', {
      canvasSize: `${canvas.width}x${canvas.height}`,
      logicalSize: `${window.innerWidth}x${window.innerHeight}`,
      dpr,
      transform: ctx.getTransform()
    });

    let animationFrame: number;
    let frameCount = 0;

    const animate = () => {
      const canvasWidth = waveConfig.canvasWidthFactor * window.innerWidth;
      const canvasHeight = waveConfig.canvasHeightFactor * window.innerHeight;

      // Update offset for wave animation
      offsetRef.current += 0.01;
      frameCount++;

      // Log canvas state periodically to debug
      if (frameCount % 60 === 0) {
        console.log('[CANVAS] Animation frame', {
          canvasWidth,
          canvasHeight,
          physicalWidth: canvas.width,
          physicalHeight: canvas.height,
          dpr,
          contextTransform: ctx.getTransform(),
          particleCount: emittedParticlesRef.current.length
        });
      }

      // Clear canvas with theme background color
      // Use logical dimensions since context is scaled by DPR
      ctx.fillStyle = waveConfig.backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw background parallax layers first (if enabled)
      if (showBackgroundLayers) {
        const backgroundLayers = [
          { yOffset: 0.7, opacity: 0.15, speed: 0.02, height: 0.3 },
          { yOffset: 0.65, opacity: 0.12, speed: 0.015, height: 0.25 },
          { yOffset: 0.6, opacity: 0.08, speed: 0.01, height: 0.2 },
        ];

        // Calculate particle density in different zones for background response
        const particles = emittedParticlesRef.current;
        const zoneCount = 5;
        const zoneDensity = new Array(zoneCount).fill(0);
        
        for (const particle of particles) {
          const zoneIndex = Math.floor((particle.y / canvasHeight) * zoneCount);
          if (zoneIndex >= 0 && zoneIndex < zoneCount) {
            zoneDensity[zoneIndex]++;
          }
        }

        // Normalize density (0-1 range)
        const maxDensity = Math.max(...zoneDensity, 1);
        const normalizedDensity = zoneDensity.map(d => d / maxDensity);

        // Draw background layers with particle density response
        for (let i = 0; i < backgroundLayers.length; i++) {
          const layer = backgroundLayers[i];
          const baseY = canvasHeight * layer.yOffset;
          const layerHeight = canvasHeight * layer.height;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, canvasHeight);

          // Draw wavy layer line with particle density affecting amplitude
          const points = 50;
          for (let j = 0; j <= points; j++) {
            const x = (canvasWidth / points) * j;
            const progress = j / points;
            
            // Get density for this x position
            const zoneIndex = Math.floor(progress * zoneCount);
            const density = normalizedDensity[zoneIndex] || 0;
            
            // Amplitude increases with particle density
            const baseAmplitude = 20 + i * 10;
            const densityBoost = density * 30;
            const amplitude = baseAmplitude + densityBoost;
            
            const frequency = 0.02 - i * 0.005;
            const offset = offsetRef.current * layer.speed * 50; // Use animation offset
            const y = baseY + Math.sin(x * frequency + offset) * amplitude;
            
            ctx.lineTo(x, y);
          }

          ctx.lineTo(canvasWidth, canvasHeight);
          ctx.closePath();

          // Fill with gradient (darker at bottom)
          const gradient = ctx.createLinearGradient(0, baseY - layerHeight, 0, canvasHeight);
          const color = isDark ? '20, 20, 40' : '200, 200, 220';
          gradient.addColorStop(0, `rgba(${color}, 0)`);
          gradient.addColorStop(0.5, `rgba(${color}, ${layer.opacity})`);
          gradient.addColorStop(1, `rgba(${color}, ${layer.opacity * 1.5})`);
          
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.restore();
        }
      }

      // Update wave state
      updateWaves(waveConfig, waveStateRef);

      ctx.save();

      // Draw background nebula effects first
      if (visualEffectsConfig.nebulaBackground.enabled) {
        drawNebulaBackground(ctx, canvasWidth, canvasHeight, Date.now(), visualEffectsConfig);
      }

      // Draw grid field visualization (optional overlay)
      if (visualEffectsConfig.gridFieldVisualization.enabled) {
        drawGridFieldVisualization(ctx, canvasWidth, canvasHeight, visualEffectsConfig);
      }

      // Draw rogue particles first (background layer)
      if (showRogueParticles && particleStateRef.current.rogueParticles.length > 0) {
        drawRogueParticles(
          ctx, 
          canvas, 
          particleStateRef.current.rogueParticles, 
          waveConfig.rogueParticles.color
        );
      }

      // Apply emitter gravity (each emitter absorbs OTHER colored particles)
      applyEmitterGravity();

      // Apply wave gravity (particles follow wave paths)
      const waveLines = waveConfig.lines?.map((line, idx) => ({
        verticalPosition: line.verticalPosition?.current || 50,
        visible: waveStateRef.current?.waveStates?.[idx]?.growthProgress > 0,
        speed: line.speed || 0.1,
        frequency: line.frequency || 0.02,
        amplitude: line.amplitude || 30,
      })) || [];
      
      if (waveLines.length > 0) {
        applyWaveGravity(waveLines);
      }

      // Apply particle-to-particle collisions and repulsion
      applyParticleCollisions();

      // Apply large particle lifecycle effects (configurable)
      const lpConfig = visualEffectsConfig.largeParticles;
      if (lpConfig.enabled) {
        const particles = emittedParticlesRef.current;
        const MAX_SIZE = lpConfig.maxSize;
        const MIN_SIZE = lpConfig.minSize;
        const DEGRADATION_RATE = lpConfig.degradationRate;
        
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          
          // Large particles degrade over time (mass loss)
          if (particle.mass && particle.mass > lpConfig.minMassForLarge) {
            const degradation = lpConfig.degradationAcceleration
              ? DEGRADATION_RATE * (1 + (particle.mass - 1) * 0.5) // Accelerate for very large particles
              : DEGRADATION_RATE;
            
            particle.mass = Math.max(particle.mass - degradation, 1);
            particle.size = Math.max(particle.size - 0.00008, particle.baseSize);
            
            // Apply size-based drag if configured
            if (lpConfig.dragIncreaseWithSize) {
              const massFactor = (particle.mass - 1) / (lpConfig.maxSize - 1);
              particle.drag = 0.95 + massFactor * 0.04; // 0.95 to 0.99
            }
            
            // Reduce gravity effect for massive particles if configured
            if (lpConfig.gravityReduction) {
              const massFactor = (particle.mass - 1) / (lpConfig.maxSize - 1);
              particle.gravity = (particle.gravity || 0.15) * (1 - massFactor * 0.7);
            }
          }

          // Clamp size within bounds
          if (particle.size >= MAX_SIZE) {
            particle.mass = Math.max(particle.mass * 0.95, 1);
            particle.size = Math.min(particle.size, MAX_SIZE);
          }

          // Remove particle when it reaches minimum size
          if (particle.size <= MIN_SIZE) {
            emittedParticlesRef.current.splice(i, 1);
          }
          
          // Enforce max lifetime if configured
          if (lpConfig.maxLifetime > 0 && particle.lifetime >= lpConfig.maxLifetime) {
            emittedParticlesRef.current.splice(i, 1);
          }
        }
      }

      // Draw wave interference patterns
      drawWaveInterference(
        ctx, 
        waveConfig, 
        offsetRef.current, 
        waveStateRef.current.waveStates, 
        logicalWidth.current, 
        logicalHeight.current
      );

      // Draw distortion fields around high-energy zones (emitters and particle clusters)
      drawDistortionFields(ctx, waveConfig, logicalWidth.current, logicalHeight.current);

      // Draw absorption burst effects
      drawAbsorptionBursts(ctx);

      // Draw emitted particles (persistent, affected by wave LINE gravity)
      // Pass wave states and logical dimensions so gravity calculation matches wave drawing
      const particleCountBeforeDraw = emittedParticlesRef.current.length;
      drawEmittedParticles(
        ctx, 
        waveConfig, 
        offsetRef.current, // Use the same offset as wave drawing
        waveStateRef.current.waveStates,
        canvasWidth,
        canvasHeight,
        false // Disable gravity debug visualization
      );
      
      // Log animation frame info periodically
      if (Math.random() < 0.008) {
        console.log('[ANIMATION] Frame rendered', {
          particleCount: particleCountBeforeDraw,
          canvasSize: `${canvasWidth}x${canvasHeight}`,
          showWaves,
          showParticles,
          showRogueParticles,
          emittersCount: emitters.length
        });
      }

      // Draw each wave with its particles integrated
      // This ensures particles appear ON the waves, not separate from them
      if (showWaves || showParticles) {
        waveConfig.lines.forEach((_, lineIndex) => {
          const waveState = waveStateRef.current.waveStates[lineIndex];
          if (waveState) {
            drawWaveWithParticles(
              ctx,
              canvas,
              lineIndex,
              waveConfig,
              offsetRef.current,
              waveState,
              particleStateRef.current.particles,
              canvasWidth,
              canvasHeight
            );
          }
        });
      }

      // Draw constellation patterns between particles
      if (visualEffectsConfig.constellationPatterns.enabled && emittedParticlesRef.current.length > 0) {
        drawConstellationPatterns(ctx, emittedParticlesRef.current, visualEffectsConfig);
      }

      // Draw particle trails (motion blur)
      if (visualEffectsConfig.particleTrails.enabled && emittedParticlesRef.current.length > 0) {
        drawParticleTrails(ctx, emittedParticlesRef.current, trailStoreRef.current, visualEffectsConfig);
      }

      // Draw atmospheric effects (fog, vignette, bokeh)
      if (visualEffectsConfig.atmosphericDepth.enabled) {
        drawAtmosphericDepth(ctx, canvasWidth, canvasHeight, visualEffectsConfig);
      }

      // Draw bloom/glare effects
      if (visualEffectsConfig.bloomGlare.enabled) {
        drawBloomGlare(ctx, canvasWidth, canvasHeight, visualEffectsConfig);
      }

      ctx.restore();

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, [
    waveConfig,
    particleConfig,
    waveStateRef,
    particleStateRef,
    updateWaves,
    generateParticles,
    generateRogueParticles,
    showWaves,
    showParticles,
    showRogueParticles,
    resizeCanvas,
    drawWaveWithParticles,
    drawRogueParticles,
    drawEmittedParticles,
    drawWaveInterference,
    drawDistortionFields,
    drawAbsorptionBursts,
    applyEmitterGravity,
    applyParticleCollisions,
    visualEffectsConfig,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setAttribute('data-component', 'WaveParticles');
      const style = getCanvasStyle(isDark);
      console.log('[CANVAS] WaveParticles canvas created', {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
        zIndex: style.zIndex,
        opacity: style.opacity
      });
    }
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={getCanvasStyle(isDark)}
      data-component="WaveParticles"
    />
  );
});

WaveParticles.displayName = 'WaveParticles';
