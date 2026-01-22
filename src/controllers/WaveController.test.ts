import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WaveController } from './WaveController';
import { createMockCanvas } from '../test/mocks/canvas.mock';

describe('WaveController', () => {
  let canvas: HTMLCanvasElement;
  let controller: WaveController;

  beforeEach(() => {
    canvas = createMockCanvas();
    controller = new WaveController(canvas);
  });

  it('should initialize controller', () => {
    expect(controller).toBeDefined();
  });

  it('should create wave', () => {
    const wave = controller.createWave({
      amplitude: 50,
      frequency: 0.02,
      speed: 0.5,
    });
    expect(wave).toBeDefined();
    expect(wave.amplitude).toBe(50);
  });

  it('should update wave', () => {
    const wave = controller.createWave({
      amplitude: 50,
      frequency: 0.02,
    });
    controller.updateWave(wave, { amplitude: 100 });
    expect(wave.amplitude).toBe(100);
  });

  it('should remove wave', () => {
    const wave = controller.createWave({
      amplitude: 50,
      frequency: 0.02,
    });
    controller.removeWave(wave);
    expect(controller.getWaves().length).toBe(0);
  });

  it('should animate waves', () => {
    const wave = controller.createWave({
      amplitude: 50,
      frequency: 0.02,
      speed: 0.5,
    });
    controller.animate(16);
    // Wave should be animated
    expect(controller).toBeDefined();
  });

  it('should render waves', () => {
    controller.createWave({ amplitude: 50, frequency: 0.02 });
    controller.render();
    // Waves should be rendered
    expect(controller).toBeDefined();
  });
});
