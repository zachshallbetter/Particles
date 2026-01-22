'use client';

import { useRef, useMemo } from 'react';
import type { WaveParticleConfig } from '@/types/wave.types';
import type { WaveUpdateFunction, WaveDrawFunction } from '@/types/wave-control.types';
import { BASE_CONFIG } from '@/config';
import { getNumericValue } from '@/utils/math.utils';

interface WaveState {
  verticalOffset: number;
  targetOffset: number;
  speed: number;
  growthProgress: number;
  growthDirection: 'left' | 'right';
  growthSpeed: number;
}

export interface WaveAnimationState {
  offset: number;
  waveStates: WaveState[];
  lastScrollY: number;
}

/**
 * Hook that provides wave state and draw/update functions
 * Animation loop is now managed by parent component
 */
export const useWaves = (
  config: WaveParticleConfig | undefined
) => {
  const initializedConfig = useMemo(() => {
    if (!config) return null;
    return {
      ...config,
      lines: config.lines.map((line, index) => ({
        ...line,
        verticalPosition: {
          min:
            line.verticalPosition?.min ??
            BASE_CONFIG.lines[index]?.verticalPosition.min ?? 20,
          max:
            line.verticalPosition?.max ??
            BASE_CONFIG.lines[index]?.verticalPosition.max ?? 80,
          current:
            line.verticalPosition?.current ??
            BASE_CONFIG.lines[index]?.verticalPosition.current ?? 50,
          default: BASE_CONFIG.lines[index]?.verticalPosition.default ?? 50,
        },
      })),
    };
  }, [config]);

  const state = useRef<WaveAnimationState>({
    offset: 0,
    waveStates: initializedConfig?.lines?.map((line, index) => {
      // Calculate growth speed based on frequency/wavelength
      // Higher frequency = shorter wavelength = faster growth
      // Lower frequency = longer wavelength = slower growth
      const frequency = getNumericValue(line.frequency);
      
      // Normalize frequency to a growth speed range
      // Using actual frequency range from BASE_CONFIG: 0.01 to 0.06
      // We'll map this to growth speeds between 0.005 and 0.015
      const minFrequency = BASE_CONFIG.frequency.min; // 0.01
      const maxFrequency = BASE_CONFIG.frequency.max; // 0.06
      const minGrowthSpeed = 0.005;
      const maxGrowthSpeed = 0.015;
      
      // Clamp frequency to expected range and map to growth speed
      const clampedFrequency = Math.max(minFrequency, Math.min(maxFrequency, frequency));
      const normalizedFrequency = (clampedFrequency - minFrequency) / (maxFrequency - minFrequency);
      const baseGrowthSpeed = minGrowthSpeed + (normalizedFrequency * (maxGrowthSpeed - minGrowthSpeed));
      
      // Add slight variation based on index for staggered effect
      const growthSpeed = baseGrowthSpeed + (index * 0.001);
      
      return {
        verticalOffset: 0,
        targetOffset: 0,
        speed: line.speed || BASE_CONFIG.speed.default, // Use line speed or default
        growthProgress: 0, // Start at 0 so wave grows in
        growthDirection: Math.random() < 0.5 ? 'left' : 'right', // Random direction
        growthSpeed, // Speed based on wavelength (inverse of frequency)
      };
    }) || [],
    lastScrollY: 0,
  });

  // Update function: handles offset increment and scroll-based wave position updates
  const updateWaves: WaveUpdateFunction = (_config, stateRef) => {
    if (!initializedConfig) return;

    // Sync waveStates array length with lines array length
    // This handles dynamically added waves
    while (stateRef.current.waveStates.length < initializedConfig.lines.length) {
      const line = initializedConfig.lines[stateRef.current.waveStates.length];
      const frequency = getNumericValue(line.frequency);
      const minFrequency = BASE_CONFIG.frequency.min;
      const maxFrequency = BASE_CONFIG.frequency.max;
      const minGrowthSpeed = 0.005;
      const maxGrowthSpeed = 0.015;
      const clampedFrequency = Math.max(minFrequency, Math.min(maxFrequency, frequency));
      const normalizedFrequency = (clampedFrequency - minFrequency) / (maxFrequency - minFrequency);
      const baseGrowthSpeed = minGrowthSpeed + (normalizedFrequency * (maxGrowthSpeed - minGrowthSpeed));
      const growthSpeed = baseGrowthSpeed + (Math.random() * 0.002);
      
      stateRef.current.waveStates.push({
        verticalOffset: 0,
        targetOffset: 0,
        speed: line.speed || BASE_CONFIG.speed.default,
        growthProgress: 0, // Start at 0 so wave grows in
        growthDirection: Math.random() < 0.5 ? 'left' : 'right',
        growthSpeed,
      });
    }
    
    // Remove excess waveStates if lines were removed
    if (stateRef.current.waveStates.length > initializedConfig.lines.length) {
      stateRef.current.waveStates = stateRef.current.waveStates.slice(0, initializedConfig.lines.length);
    }

    // Update animation offset at constant rate
    // Note: This offset is used by both waves AND particles, so it must be consistent
    // The offset is a global animation time, not affected by individual wave speeds
    // Individual wave speeds are applied in the drawing phase via timeStep = offset * line.speed
    stateRef.current.offset += BASE_CONFIG.speed.default;

    // Update growth progress for each wave (vine-like growth effect)
    const waveStates = stateRef.current.waveStates;
    for (let index = 0; index < waveStates.length; index++) {
      const waveState = waveStates[index];
      // Only grow if not already fully grown
      if (waveState.growthProgress < 1) {
        waveState.growthProgress = Math.min(1, waveState.growthProgress + waveState.growthSpeed);
      }
    }

    // Handle scroll updates for waves only
    const scrollDelta = initializedConfig.scrollY - stateRef.current.lastScrollY;
    if (Math.abs(scrollDelta) > 1) {
      const velocity = scrollDelta * BASE_CONFIG.parallax.smoothing.default;
      stateRef.current.lastScrollY += velocity;

      // Update wave positions (optimized: mutate in place instead of creating new objects)
      const linesLength = initializedConfig.lines.length;
      const parallaxFactor = initializedConfig.parallaxFactor;
      const smoothing = BASE_CONFIG.parallax.smoothing.default;
      const lastScrollY = stateRef.current.lastScrollY;

      for (let index = 0; index < waveStates.length; index++) {
        const waveState = waveStates[index];
        const layerFactor = 1 - index / linesLength;
        const targetOffset = -lastScrollY * parallaxFactor * layerFactor;
        const waveVelocity = (targetOffset - waveState.verticalOffset) * smoothing;
        waveState.verticalOffset += waveVelocity;
        waveState.targetOffset = targetOffset;
      }
    }
  };

  // Draw function: renders waves to canvas (optimized)
  const drawWaves: WaveDrawFunction = (ctx, canvas, _config, stateRef) => {
    if (!initializedConfig) return;

    // Performance optimization: Cache calculations and batch context changes
    // Use logical dimensions to match particle coordinate system
    // Canvas context is scaled by devicePixelRatio, so coordinates should use logical size
    const currentOffset = stateRef.current.offset;
    const canvasHeight = initializedConfig.canvasHeightFactor * window.innerHeight;
    const canvasWidth = initializedConfig.canvasWidthFactor * window.innerWidth;
    const lineWidth = initializedConfig.lineWidth;

    initializedConfig.lines.forEach((line, index) => {
      const waveState = stateRef.current.waveStates[index];
      if (!waveState) return;

      // Skip drawing if wave hasn't started growing yet
      if (waveState.growthProgress <= 0) return;

      const baseY = (line.verticalPosition.current / 100) * canvasHeight;
      const verticalPos = baseY + waveState.verticalOffset;
      // Ensure speed is valid - use line.speed if available and > 0, otherwise use default
      const waveSpeed = (line.speed && line.speed > 0) ? line.speed : BASE_CONFIG.speed.default;
      const timeStep = currentOffset * waveSpeed;

      // Cache frequency and amplitude calculations
      const frequency = getNumericValue(line.frequency);
      const amplitude = getNumericValue(line.amplitude);
      
      // Optimize step calculation - fewer points for better performance
      const step = Math.max(2, Math.floor(canvasWidth / 800)); // Reduced from 1000 to 800 for fewer points
      
      // Calculate the visible range based on growth progress and direction
      let startX: number;
      let endX: number;
      
      if (waveState.growthDirection === 'left') {
        // Grow from left to right
        startX = 0;
        endX = canvasWidth * waveState.growthProgress;
      } else {
        // Grow from right to left
        startX = canvasWidth * (1 - waveState.growthProgress);
        endX = canvasWidth;
      }
      
      // Don't draw if the visible range is invalid
      if (endX <= startX) return;
      
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = lineWidth;

      // Start from the first visible point
      let x = Math.max(0, Math.floor(startX / step) * step);
      let y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
      ctx.moveTo(x, y);

      // Draw only the visible portion
      for (x = Math.max(step, x + step); x <= endX; x += step) {
        y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
        const clampedY = Math.max(0, Math.min(canvasHeight, y));
        
        // Use lineTo for better performance
        ctx.lineTo(x, clampedY);
      }
      
      // Ensure we draw to the exact end point if needed
      if (x - step < endX) {
        x = endX;
        y = verticalPos + Math.sin(x * frequency + timeStep) * amplitude;
        const clampedY = Math.max(0, Math.min(canvasHeight, y));
        ctx.lineTo(x, clampedY);
      }
      
      ctx.stroke();
    });
  };

  return {
    stateRef: state,
    updateWaves,
    drawWaves,
    config: initializedConfig,
  };
};
