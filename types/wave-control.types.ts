import React from "react"
import type { WaveParticleConfig, WaveState, ParticleConfig, RogueParticle } from './wave.types';

export interface WaveAnimationState {
  offset: number;
  waveStates: WaveState[];
  lastScrollY: number;
}

export interface ParticlesState {
  particles: ParticleConfig[];
  rogueParticles: RogueParticle[];
}

export type WaveUpdateFunction = (
  config: WaveParticleConfig,
  stateRef: React.MutableRefObject<WaveAnimationState>
) => void;

export type WaveDrawFunction = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: WaveParticleConfig,
  stateRef: React.MutableRefObject<WaveAnimationState>
) => void;

export type ParticleUpdateFunction = (
  config: WaveParticleConfig,
  waveStateRef: React.MutableRefObject<WaveAnimationState>,
  particleStateRef: React.MutableRefObject<ParticlesState>,
  canvas: HTMLCanvasElement
) => void;

export type ParticleDrawFunction = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  config: WaveParticleConfig,
  waveStateRef: React.MutableRefObject<WaveAnimationState>,
  particleStateRef: React.MutableRefObject<ParticlesState>
) => void;
