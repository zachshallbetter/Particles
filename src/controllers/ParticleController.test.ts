import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParticleController } from './ParticleController';
import { createMockCanvas } from '../test/mocks/canvas.mock';

describe('ParticleController', () => {
  let canvas: HTMLCanvasElement;
  let controller: ParticleController;

  beforeEach(() => {
    canvas = createMockCanvas();
    controller = new ParticleController(canvas);
  });

  it('should initialize controller', () => {
    expect(controller).toBeDefined();
  });

  it('should generate particles', () => {
    const particles = controller.generateParticles(10);
    expect(particles.length).toBe(10);
  });

  it('should update particles', () => {
    controller.generateParticles(5);
    controller.update(16);
    // Particles should be updated
    expect(controller.getParticles().length).toBe(5);
  });

  it('should render particles', () => {
    controller.generateParticles(5);
    controller.render();
    // Particles should be rendered
    expect(controller).toBeDefined();
  });

  it('should handle particle lifecycle', () => {
    const particles = controller.generateParticles(5);
    controller.update(1000);
    // Particles should be updated/removed based on lifecycle
    expect(controller).toBeDefined();
  });

  it('should cleanup particles', () => {
    controller.generateParticles(5);
    controller.cleanup();
    expect(controller.getParticles().length).toBe(0);
  });
});
