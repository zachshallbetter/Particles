'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { DEFAULT_WAVE_CONFIG } from '@/config';
import { createWaveConfig, getCanvasStyle } from '@/utils/wave.utils';
import { useWaves } from '@/hooks/useWaves';

interface WavesProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onWaveStatesUpdate?: (waveStates: Array<{
    verticalOffset: number;
    targetOffset: number;
    speed: number;
  }>, offset: number) => void;
  // Expose stateRef so Particles can read offset directly
  onStateRefReady?: (stateRef: React.MutableRefObject<{
    offset: number;
    waveStates: Array<{
      verticalOffset: number;
      targetOffset: number;
      speed: number;
    }>;
    lastScrollY: number;
  }>) => void;
}

/**
 * @deprecated This component is deprecated. Use WaveParticles component instead, which provides
 * better synchronization and control. This component is kept for backward compatibility only.
 */
export const Waves: React.FC<WavesProps> = React.memo(({ 
  canvasRef: externalCanvasRef,
  onWaveStatesUpdate,
  onStateRefReady
}) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const { isDark } = useTheme();

  const config = createWaveConfig(isDark, DEFAULT_WAVE_CONFIG);

  // Updated to use new hook signature (config only, no canvasRef)
  const { stateRef, updateWaves, drawWaves } = useWaves(config);

  // Expose stateRef to parent so Particles can read offset directly
  useEffect(() => {
    if (onStateRefReady && stateRef) {
      onStateRefReady(stateRef as React.MutableRefObject<{
        offset: number;
        waveStates: Array<{
          verticalOffset: number;
          targetOffset: number;
          speed: number;
        }>;
        lastScrollY: number;
      }>);
    }
  }, [onStateRefReady, stateRef]);

  // Use a ref to store the callback to avoid recreating it
  const callbackRef = useRef(onWaveStatesUpdate);
  useEffect(() => {
    callbackRef.current = onWaveStatesUpdate;
  }, [onWaveStatesUpdate]);

  // Use requestAnimationFrame for smooth updates, but throttle to prevent infinite loops
  // Update at a reasonable rate (every 33ms = ~30fps) to sync state without causing lag
  useEffect(() => {
    if (!callbackRef.current || !stateRef) return;

    let lastUpdateTime = 0;
    const throttleMs = 33; // ~30fps updates for state sync (slower to prevent lag)

    const updateState = (currentTime: number) => {
      if (currentTime - lastUpdateTime >= throttleMs) {
        if (callbackRef.current && stateRef.current) {
          callbackRef.current(
            stateRef.current.waveStates,
            stateRef.current.offset
          );
          lastUpdateTime = currentTime;
        }
      }
      requestAnimationFrame(updateState);
    };

    const rafId = requestAnimationFrame(updateState);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [stateRef]);

  // Set up animation loop for standalone waves component
  useEffect(() => {
    if (!canvasRef?.current || !config || !stateRef || !updateWaves || !drawWaves) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const animate = () => {
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateWaves(config, stateRef);
      drawWaves(ctx, canvas, config, stateRef);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [canvasRef, config, stateRef, updateWaves, drawWaves]);

  // Only render canvas if using internal ref
  if (externalCanvasRef) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={getCanvasStyle(isDark)}
    />
  );
});

Waves.displayName = 'Waves';
