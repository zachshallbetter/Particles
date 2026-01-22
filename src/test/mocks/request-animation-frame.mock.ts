import { vi } from 'vitest';

let rafId = 0;
const rafCallbacks = new Map<number, FrameRequestCallback>();

export const mockRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  rafId += 1;
  rafCallbacks.set(rafId, callback);
  return rafId;
};

export const mockCancelAnimationFrame = (id: number): void => {
  rafCallbacks.delete(id);
};

export const flushAnimationFrames = (): void => {
  const callbacks = Array.from(rafCallbacks.values());
  rafCallbacks.clear();
  callbacks.forEach((callback) => {
    callback(performance.now());
  });
};

export const resetAnimationFrameMocks = (): void => {
  rafId = 0;
  rafCallbacks.clear();
};
