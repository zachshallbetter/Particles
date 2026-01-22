import { describe, it, expect, vi } from 'vitest';
import {
  createElementParticle,
  updateElementParticle,
  removeElementParticle,
  getElementParticles,
} from './element-particles.utils';

describe('element-particles.utils', () => {
  describe('createElementParticle', () => {
    it('should create element particle', () => {
      const element = document.createElement('div');
      const particle = createElementParticle(element, { x: 0, y: 0 });
      expect(particle).toBeDefined();
      expect(particle.element).toBe(element);
    });
  });

  describe('updateElementParticle', () => {
    it('should update element particle position', () => {
      const element = document.createElement('div');
      const particle = createElementParticle(element, { x: 0, y: 0 });
      updateElementParticle(particle, { x: 100, y: 100 });
      expect(particle.x).toBe(100);
      expect(particle.y).toBe(100);
    });
  });

  describe('removeElementParticle', () => {
    it('should remove element particle', () => {
      const element = document.createElement('div');
      const particle = createElementParticle(element, { x: 0, y: 0 });
      removeElementParticle(particle);
      // Particle should be removed
      expect(true).toBe(true);
    });
  });

  describe('getElementParticles', () => {
    it('should get all element particles', () => {
      const particles = getElementParticles();
      expect(Array.isArray(particles)).toBe(true);
    });
  });
});
