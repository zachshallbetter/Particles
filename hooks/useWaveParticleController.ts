'use client';

import { useRef, useMemo } from 'react';
import { WaveParticleController } from '@/controllers/WaveParticleController';
import type { WaveParticleConfig } from '@/types/wave.types';
import type { WaveAnimationState, ParticlesState } from '@/types/wave-control.types';
import { WaveParticleEventEmitter } from '@/events/WaveParticleEventEmitter';
import { useWaves } from './useWaves';
import { useParticles } from './useParticles';
import type React from 'react';

/**
 * Hook that provides access to the wave and particle controller
 */
export const useWaveParticleController = (
  config: WaveParticleConfig | undefined,
  canvasRef: React.RefObject<HTMLCanvasElement> | null
) => {
  const waves = useWaves(config);
  const particles = useParticles(config);

  // Create config ref for controllers
  const configRef = useRef<WaveParticleConfig | null>(config || null);

  // Update config ref when config changes
  useMemo(() => {
    configRef.current = config || null;
  }, [config]);

  // Create event emitter (shared instance)
  const eventEmitterRef = useRef(new WaveParticleEventEmitter());

  // Create controller instance
  const controller = useMemo(() => {
    if (!waves.config || !particles.config || !waves.stateRef || !particles.stateRef) {
      return null;
    }

    return new WaveParticleController(
      configRef,
      waves.stateRef as React.MutableRefObject<WaveAnimationState>,
      particles.stateRef as React.MutableRefObject<ParticlesState>,
      particles.generateParticles!,
      particles.generateRogueParticles!,
      canvasRef,
      eventEmitterRef.current
    );
  }, [
    waves.config,
    waves.stateRef,
    particles.config,
    particles.stateRef,
    particles.generateParticles,
    particles.generateRogueParticles,
    canvasRef,
  ]);

  return {
    controller,
    waves,
    particles,
  };
};
