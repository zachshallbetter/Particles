import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParticles } from './useParticles';

describe('useParticles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize particles', () => {
    const { result } = renderHook(() => useParticles());
    expect(result.current).toBeDefined();
  });

  it('should provide particle controls', () => {
    const { result } = renderHook(() => useParticles());
    expect(result.current.particles).toBeDefined();
    expect(result.current.addParticle).toBeDefined();
    expect(result.current.removeParticle).toBeDefined();
    expect(result.current.updateParticle).toBeDefined();
  });

  it('should add particles', () => {
    const { result } = renderHook(() => useParticles());
    result.current.addParticle({ x: 100, y: 100 });
    expect(result.current.particles.length).toBeGreaterThan(0);
  });

  it('should remove particles', () => {
    const { result } = renderHook(() => useParticles());
    const particleId = result.current.addParticle({ x: 100, y: 100 });
    result.current.removeParticle(particleId);
    expect(result.current.particles.length).toBe(0);
  });

  it('should update particles', () => {
    const { result } = renderHook(() => useParticles());
    const particleId = result.current.addParticle({ x: 100, y: 100 });
    result.current.updateParticle(particleId, { x: 200, y: 200 });
    const particle = result.current.particles.find((p) => p.id === particleId);
    expect(particle?.x).toBe(200);
  });
});
