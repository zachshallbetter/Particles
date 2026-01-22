'use client';

import { useRef, useMemo } from 'react';
import type { WaveParticleConfig, ParticleConfig, RogueParticle } from '@/types/wave.types';
import { BASE_CONFIG } from '@/config';

export interface ParticlesState {
  particles: ParticleInstance[];
  rogueParticles: RogueParticleInstance[];
}

export class RogueParticleInstance implements RogueParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  verticalBounds: { min: number; max: number };

  constructor(canvasWidth: number, canvasHeight: number, config: WaveParticleConfig) {
    this.size = Math.random() * (config.rogueParticles.size.max - config.rogueParticles.size.min) + config.rogueParticles.size.min;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.speedX = config.rogueParticles.speed.default - 0.05;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.opacity = Math.random() * (config.rogueParticles.opacity.max - config.rogueParticles.opacity.min) + config.rogueParticles.opacity.min;
    this.verticalBounds = config.rogueParticles.verticalBounds;
  }

  updatePosition(canvasWidth: number, canvasHeight: number) {
    this.x -= this.speedX;
    this.y += this.speedY;

    // Wrap around horizontally
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;

    // Bounce off vertical boundaries
    const minY = (this.verticalBounds.min / 100) * canvasHeight;
    const maxY = (this.verticalBounds.max / 100) * canvasHeight;
    
    if (this.y < minY) {
      this.y = minY;
      this.speedY = Math.abs(this.speedY); // Reverse direction (bounce down)
    } else if (this.y > maxY) {
      this.y = maxY;
      this.speedY = -Math.abs(this.speedY); // Reverse direction (bounce up)
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string, canvasWidth?: number, canvasHeight?: number) {
    // Calculate distance from center for redshift and scaling
    const cw = canvasWidth || ctx.canvas.width;
    const ch = canvasHeight || ctx.canvas.height;
    const centerX = cw / 2;
    const centerY = ch / 2;
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    // Apply redshift
    const redshiftedColor = this.applyRedshift(color, normalizedDistance);
    
    // Scale particle based on distance
    const scaleFactor = 1 - (normalizedDistance * 0.5);
    const scaledSize = this.size * scaleFactor;
    
    // Calculate final opacity (bake into fillStyle to avoid globalAlpha changes)
    const distanceOpacity = 1 - (normalizedDistance * 0.2);
    const finalOpacity = this.opacity * distanceOpacity;
    
    // Use rgba with opacity baked in instead of globalAlpha
    ctx.beginPath();
    ctx.arc(this.x, this.y, scaledSize, 0, Math.PI * 2);
    ctx.fillStyle = this.applyOpacity(redshiftedColor, finalOpacity);
    ctx.fill();
  }
  
  /**
   * Apply opacity to a color string
   */
  private applyOpacity(color: string, opacity: number): string {
    if (color.startsWith('rgba')) {
      return color.replace(/,\s*[\d.]+\)/, `, ${opacity})`);
    } else if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }
    return color;
  }
  
  /**
   * Apply redshift effect to color based on distance
   * Shifts color toward red spectrum as distance increases
   */
  private applyRedshift(color: string, distance: number): string {
    // Parse color - handle different formats
    if (color.startsWith('#')) {
      // Hex color - convert to RGB then apply redshift
      const rgb = this.hexToRgb(color);
      if (rgb) {
        // Shift toward red: increase red, decrease blue/green
        const redshifted = {
          r: Math.min(255, rgb.r + (distance * 50)),
          g: Math.max(0, rgb.g - (distance * 30)),
          b: Math.max(0, rgb.b - (distance * 40)),
        };
        return `rgb(${Math.round(redshifted.r)}, ${Math.round(redshifted.g)}, ${Math.round(redshifted.b)})`;
      }
    } else if (color.startsWith('rgba') || color.startsWith('rgb')) {
      // RGB/RGBA color - extract and modify
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const redshifted = {
          r: Math.min(255, r + (distance * 50)),
          g: Math.max(0, g - (distance * 30)),
          b: Math.max(0, b - (distance * 40)),
        };
        // Preserve alpha if present
        const alphaMatch = color.match(/,\s*([\d.]+)\)/);
        const alpha = alphaMatch ? alphaMatch[1] : '1';
        return `rgba(${Math.round(redshifted.r)}, ${Math.round(redshifted.g)}, ${Math.round(redshifted.b)}, ${alpha})`;
      }
    }
    
    // Fallback: return original color
    return color;
  }
  
  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
}

export class ParticleInstance implements ParticleConfig {
  progress: number;
  offset: number;
  baseOffset: number; // The base offset from the wave line
  size: number;
  speedX: number;
  hueOffset: number;
  brightness: number;
  parentLine: number;
  glow: boolean;
  glowIntensity: number; // Varies the shadow blur intensity (0-1)
  glowOpacity: number; // Varies the glow color opacity (0-1)
  exploding: boolean;
  explosionTime: number;
  explosionDuration: number;
  explosionDirection: number;
  explosionDistance: number;
  isPop: boolean;
  popDistance: number;
  // Oscillation properties for floating effect
  oscillationPhase: number; // Starting phase of oscillation
  oscillationSpeed: number; // How fast the particle oscillates
  oscillationAmplitude: number; // How far it floats from base position

  constructor(canvasWidth: number, lineIndex: number, config: WaveParticleConfig) {
    this.progress = Math.random() * canvasWidth;
    this.baseOffset = (Math.random() - 0.5) * config.particleRange.default * 2;
    this.offset = this.baseOffset;
    this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
    this.speedX = Math.random() * (config.particleSpeed.max - config.particleSpeed.min) + config.particleSpeed.min;
    this.hueOffset = Math.random() * BASE_CONFIG.particles.hueVariation.default - BASE_CONFIG.particles.hueVariation.default / 2;
    this.brightness = Math.random() * (BASE_CONFIG.glow.brightness.max - BASE_CONFIG.glow.brightness.min) + BASE_CONFIG.glow.brightness.min;
    this.parentLine = lineIndex;
    this.glow = Math.random() < config.glowProbability;
    // Vary glow intensity (affects shadow blur) - more variation
    this.glowIntensity = Math.random(); // 0 to 1
    // Vary glow opacity independently from brightness for more variation
    this.glowOpacity = 0.6 + Math.random() * 0.4; // 0.6 to 1.0
    this.exploding = false;
    this.explosionTime = 0;
    this.explosionDuration = config.explosion.duration;
    this.explosionDirection = Math.random() < 0.5 ? 1 : -1;
    this.explosionDistance = config.explosion.distance.default;
    this.isPop = Math.random() < config.explosion.popProbability;
    this.popDistance = config.explosion.popDistance;
    // Initialize oscillation with random values for variety
    this.oscillationPhase = Math.random() * Math.PI * 2;
    this.oscillationSpeed = 0.02 + Math.random() * 0.03; // Slow, gentle oscillation
    this.oscillationAmplitude = 5 + Math.random() * 15; // Oscillates ±5 to ±20 pixels around base
  }

  /**
   * Update the particle's offset based on oscillation
   * Call this each frame to create floating effect
   */
  updateOscillation(time: number) {
    this.offset = this.baseOffset + Math.sin(time * this.oscillationSpeed + this.oscillationPhase) * this.oscillationAmplitude;
  }
}

/**
 * Hook that provides particle state and generation functions
 */
export const useParticles = (config: WaveParticleConfig | undefined) => {
  const initializedConfig = useMemo(() => {
    if (!config) return null;
    return {
      ...config,
      lines: config.lines.map((line, index) => ({
        ...line,
        verticalPosition: {
          min: line.verticalPosition?.min ?? BASE_CONFIG.lines[index]?.verticalPosition.min ?? 20,
          max: line.verticalPosition?.max ?? BASE_CONFIG.lines[index]?.verticalPosition.max ?? 80,
          current: line.verticalPosition?.current ?? BASE_CONFIG.lines[index]?.verticalPosition.current ?? 50,
          default: BASE_CONFIG.lines[index]?.verticalPosition.default ?? 50,
        },
      })),
      rogueParticles: {
        ...config.rogueParticles,
        verticalBounds: {
          min: config.rogueParticles.verticalBounds?.min ?? BASE_CONFIG.rogueParticles.verticalBounds.min,
          max: config.rogueParticles.verticalBounds?.max ?? BASE_CONFIG.rogueParticles.verticalBounds.max,
          current: BASE_CONFIG.rogueParticles.verticalBounds.default,
          default: BASE_CONFIG.rogueParticles.verticalBounds.default,
        },
      },
    };
  }, [config]);

  const state = useRef<ParticlesState>({
    particles: [],
    rogueParticles: [],
  });

  // Memoize particle generation to prevent recreation on theme changes
  const generateParticles = useMemo(() => {
    if (!initializedConfig) return null;
    return (canvas: HTMLCanvasElement) => {
      const particles: ParticleInstance[] = [];
      initializedConfig.lines.forEach((_, lineIndex) => {
        for (let i = 0; i < initializedConfig.particlesPerLine; i++) {
          particles.push(new ParticleInstance(canvas.width, lineIndex, initializedConfig));
        }
      });
      return particles;
    };
  }, [initializedConfig]);

  const generateRogueParticles = useMemo(() => {
    if (!initializedConfig) return null;
    return (canvas: HTMLCanvasElement) => {
      const rogueParticles: RogueParticleInstance[] = [];
      const count = initializedConfig.rogueParticles.count;
      const sizeMin = initializedConfig.rogueParticles.size.min;
      const sizeMax = initializedConfig.rogueParticles.size.max;
      const sizeRange = sizeMax - sizeMin;
      
      // Distribute sizes evenly across the range to ensure variety
      for (let i = 0; i < count; i++) {
        // Use linear distribution with slight randomization for natural variation
        const normalizedIndex = i / (count - 1 || 1); // 0 to 1
        const baseSize = sizeMin + (normalizedIndex * sizeRange);
        // Add small random variation (±10% of step size) to ensure uniqueness
        const stepSize = sizeRange / count;
        const variation = (Math.random() - 0.5) * stepSize * 0.2;
        const finalSize = Math.max(sizeMin, Math.min(sizeMax, baseSize + variation));
        
        // Create particle with custom size
        const particle = new RogueParticleInstance(canvas.width, canvas.height, initializedConfig);
        // Override size with distributed value
        particle.size = finalSize;
        rogueParticles.push(particle);
      }
      return rogueParticles;
    };
  }, [initializedConfig]);

  return {
    stateRef: state,
    generateParticles,
    generateRogueParticles,
    config: initializedConfig,
  };
};
