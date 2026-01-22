import type { WaveParticleConfig } from '@/types/wave.types';
import { ObjectPool } from './performance.utils';

/**
 * Particle instance interface for pool
 */
export interface PooledParticle {
  progress: number;
  offset: number;
  size: number;
  speedX: number;
  hueOffset: number;
  brightness: number;
  parentLine: number;
  glow: boolean;
  glowIntensity: number;
  glowOpacity: number;
  exploding: boolean;
  explosionTime: number;
  explosionDuration: number;
  explosionDirection: number;
  explosionDistance: number;
  isPop: boolean;
  popDistance: number;
}

/**
 * Rogue particle instance interface for pool
 */
export interface PooledRogueParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  verticalBounds: { min: number; max: number };
}

/**
 * Create a pool for regular particles
 */
export function createParticlePool(
  config: WaveParticleConfig,
  lineIndex: number
): ObjectPool<PooledParticle> {
  return new ObjectPool(
    () => {
      // Create new particle
      const canvasWidth = config.canvasWidthFactor * (typeof window !== 'undefined' ? window.innerWidth : 1920);
      return {
        progress: Math.random() * canvasWidth,
        offset: Math.random() * config.particleRange.default - config.particleRange.default / 2,
        size: Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min,
        speedX: Math.random() * (config.particleSpeed.max - config.particleSpeed.min) + config.particleSpeed.min,
        hueOffset: Math.random() * 15 - 15 / 2,
        brightness: Math.random() * 0.4 + 0.6,
        parentLine: lineIndex,
        glow: Math.random() < config.glowProbability,
        glowIntensity: Math.random(),
        glowOpacity: 0.6 + Math.random() * 0.4,
        exploding: false,
        explosionTime: 0,
        explosionDuration: config.explosion.duration,
        explosionDirection: Math.random() < 0.5 ? 1 : -1,
        explosionDistance: config.explosion.distance.default,
        isPop: Math.random() < config.explosion.popProbability,
        popDistance: config.explosion.popDistance,
      };
    },
    (particle) => {
      // Reset particle to initial state
      const canvasWidth = config.canvasWidthFactor * (typeof window !== 'undefined' ? window.innerWidth : 1920);
      particle.progress = Math.random() * canvasWidth;
      particle.offset =
        Math.random() * config.particleRange.default -
        config.particleRange.default / 2;
      particle.size =
        Math.random() *
          (config.particleSize.max - config.particleSize.min) +
        config.particleSize.min;
      particle.speedX =
        Math.random() *
          (config.particleSpeed.max - config.particleSpeed.min) +
        config.particleSpeed.min;
      particle.hueOffset =
        Math.random() * 15 - 15 / 2;
      particle.brightness =
        Math.random() * (0.4) + 0.6;
      particle.glow = Math.random() < config.glowProbability;
      particle.exploding = false;
      particle.explosionTime = 0;
    },
    50 // Initial pool size
  );
}

/**
 * Create a pool for rogue particles
 */
export function createRogueParticlePool(
  config: WaveParticleConfig
): ObjectPool<PooledRogueParticle> {
  return new ObjectPool(
    () => {
      const canvasWidth = config.canvasWidthFactor * (typeof window !== 'undefined' ? window.innerWidth : 1920);
      const canvasHeight = config.canvasHeightFactor * (typeof window !== 'undefined' ? window.innerHeight : 1080);
      return {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * (config.rogueParticles.size.max - config.rogueParticles.size.min) + config.rogueParticles.size.min,
        speedX: config.rogueParticles.speed.default - 0.05,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * (config.rogueParticles.opacity.max - config.rogueParticles.opacity.min) + config.rogueParticles.opacity.min,
        verticalBounds: config.rogueParticles.verticalBounds,
      };
    },
    (particle) => {
      const canvasWidth = config.canvasWidthFactor * (typeof window !== 'undefined' ? window.innerWidth : 1920);
      const canvasHeight = config.canvasHeightFactor * (typeof window !== 'undefined' ? window.innerHeight : 1080);
      particle.x = Math.random() * canvasWidth;
      particle.y = Math.random() * canvasHeight;
      particle.size =
        Math.random() *
          (config.rogueParticles.size.max - config.rogueParticles.size.min) +
        config.rogueParticles.size.min;
      particle.speedX = config.rogueParticles.speed.default - 0.05;
      particle.speedY = Math.random() * 0.5 - 0.25;
      particle.opacity =
        Math.random() *
          (config.rogueParticles.opacity.max -
            config.rogueParticles.opacity.min) +
        config.rogueParticles.opacity.min;
    },
    20 // Initial pool size
  );
}
