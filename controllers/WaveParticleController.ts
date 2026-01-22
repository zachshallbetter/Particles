import React from "react"
import type { WaveParticleConfig } from '@/types/wave.types';
import type { WaveAnimationState, ParticlesState } from '@/types/wave-control.types';
import type { WaveParticleEventEmitter } from '@/events/WaveParticleEventEmitter';
import type { ParticleInstance, RogueParticleInstance } from '@/hooks/useParticles';

/**
 * Controller for managing wave and particle system
 * Provides methods for runtime updates and animations
 */
export class WaveParticleController {
  private configRef: React.MutableRefObject<WaveParticleConfig | null>;
  private waveStateRef: React.MutableRefObject<WaveAnimationState>;
  private particleStateRef: React.MutableRefObject<ParticlesState>;
  private generateParticles: (canvas: HTMLCanvasElement) => ParticleInstance[];
  private generateRogueParticles: (canvas: HTMLCanvasElement) => RogueParticleInstance[];
  private canvasRef: React.RefObject<HTMLCanvasElement> | null;
  private eventEmitter: WaveParticleEventEmitter;

  constructor(
    configRef: React.MutableRefObject<WaveParticleConfig | null>,
    waveStateRef: React.MutableRefObject<WaveAnimationState>,
    particleStateRef: React.MutableRefObject<ParticlesState>,
    generateParticles: (canvas: HTMLCanvasElement) => ParticleInstance[],
    generateRogueParticles: (canvas: HTMLCanvasElement) => RogueParticleInstance[],
    canvasRef: React.RefObject<HTMLCanvasElement> | null,
    eventEmitter: WaveParticleEventEmitter
  ) {
    this.configRef = configRef;
    this.waveStateRef = waveStateRef;
    this.particleStateRef = particleStateRef;
    this.generateParticles = generateParticles;
    this.generateRogueParticles = generateRogueParticles;
    this.canvasRef = canvasRef;
    this.eventEmitter = eventEmitter;
  }

  /**
   * Get current configuration
   */
  getConfig(): WaveParticleConfig | null {
    return this.configRef.current;
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: Partial<WaveParticleConfig>): void {
    if (this.configRef.current) {
      this.configRef.current = {
        ...this.configRef.current,
        ...updates,
      };
      this.eventEmitter.emit('config:change', updates);
    }
  }

  /**
   * Get current wave animation state
   */
  getWaveState(): WaveAnimationState {
    return this.waveStateRef.current;
  }

  /**
   * Get current particle state
   */
  getParticleState(): ParticlesState {
    return this.particleStateRef.current;
  }

  /**
   * Regenerate all particles
   */
  regenerateParticles(): void {
    if (this.canvasRef?.current && this.configRef.current) {
      this.particleStateRef.current.particles = this.generateParticles(this.canvasRef.current);
      this.eventEmitter.emit('particle:spawn', { count: this.particleStateRef.current.particles.length });
    }
  }

  /**
   * Regenerate rogue particles
   */
  regenerateRogueParticles(): void {
    if (this.canvasRef?.current && this.configRef.current) {
      this.particleStateRef.current.rogueParticles = this.generateRogueParticles(this.canvasRef.current);
    }
  }

  /**
   * Reset wave growth animation
   */
  resetWaveGrowth(): void {
    this.waveStateRef.current.waveStates.forEach((state) => {
      state.growthProgress = 0;
      state.growthDirection = Math.random() < 0.5 ? 'left' : 'right';
    });
  }

  /**
   * Set wave growth progress manually
   */
  setWaveGrowth(progress: number): void {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    this.waveStateRef.current.waveStates.forEach((state) => {
      state.growthProgress = clampedProgress;
    });
  }

  /**
   * Trigger explosion effect for a specific particle
   */
  triggerExplosion(particleIndex: number): void {
    const particle = this.particleStateRef.current.particles[particleIndex];
    if (particle) {
      particle.exploding = true;
      particle.explosionTime = Date.now();
      this.eventEmitter.emit('particle:explode', { index: particleIndex });
    }
  }

  /**
   * Get event emitter for subscribing to events
   */
  getEventEmitter(): WaveParticleEventEmitter {
    return this.eventEmitter;
  }

  /**
   * Update scroll position
   */
  setScrollY(scrollY: number): void {
    if (this.configRef.current) {
      this.configRef.current.scrollY = scrollY;
    }
  }

  /**
   * Enable/disable gravity well
   */
  setGravityWell(enabled: boolean, options?: Partial<WaveParticleConfig['gravityWell']>): void {
    if (this.configRef.current) {
      this.configRef.current.gravityWell = {
        enabled,
        x: options?.x ?? 50,
        y: options?.y ?? 50,
        strength: options?.strength ?? 1,
        radius: options?.radius ?? 100,
      };
      this.eventEmitter.emit('config:change', { gravityWell: this.configRef.current.gravityWell });
    }
  }
}
