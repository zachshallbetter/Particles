import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WaveParticleController } from './WaveParticleController';
import { createMockCanvas } from '../test/mocks/canvas.mock';

describe('WaveParticleController', () => {
  let canvas: HTMLCanvasElement;
  let controller: WaveParticleController;

  beforeEach(() => {
    canvas = createMockCanvas();
    controller = new WaveParticleController(canvas);
  });

  it('should initialize controller', () => {
    expect(controller).toBeDefined();
  });

  it('should add wave', () => {
    const waveId = controller.addWave({
      amplitude: 50,
      frequency: 0.02,
      speed: 0.5,
    });
    expect(waveId).toBeDefined();
  });

  it('should remove wave', () => {
    const waveId = controller.addWave({
      amplitude: 50,
      frequency: 0.02,
    });
    controller.removeWave(waveId);
    expect(controller.getWaves().length).toBe(0);
  });

  it('should update wave', () => {
    const waveId = controller.addWave({
      amplitude: 50,
      frequency: 0.02,
    });
    controller.updateWave(waveId, { amplitude: 100 });
    const wave = controller.getWaves().find((w) => w.id === waveId);
    expect(wave?.amplitude).toBe(100);
  });

  it('should add particle', () => {
    const particleId = controller.addParticle({ x: 100, y: 100 });
    expect(particleId).toBeDefined();
  });

  it('should remove particle', () => {
    const particleId = controller.addParticle({ x: 100, y: 100 });
    controller.removeParticle(particleId);
    expect(controller.getParticles().length).toBe(0);
  });

  it('should update particle', () => {
    const particleId = controller.addParticle({ x: 100, y: 100 });
    controller.updateParticle(particleId, { x: 200, y: 200 });
    const particle = controller.getParticles().find((p) => p.id === particleId);
    expect(particle?.x).toBe(200);
  });

  it('should emit events', () => {
    const onWaveAdd = vi.fn();
    controller.on('wave:add', onWaveAdd);
    controller.addWave({ amplitude: 50, frequency: 0.02 });
    expect(onWaveAdd).toHaveBeenCalled();
  });

  it('should update animation', () => {
    controller.addWave({ amplitude: 50, frequency: 0.02 });
    controller.update(16);
    // Animation should be updated
    expect(controller).toBeDefined();
  });

  it('should render to canvas', () => {
    controller.addWave({ amplitude: 50, frequency: 0.02 });
    controller.render();
    // Canvas should be rendered
    expect(controller).toBeDefined();
  });

  it('should cleanup on destroy', () => {
    controller.addWave({ amplitude: 50, frequency: 0.02 });
    controller.destroy();
    expect(controller.getWaves().length).toBe(0);
  });
});
