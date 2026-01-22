import { describe, it, expect, vi } from 'vitest';
import { createMockCanvas, createMockContext2D } from '../test/mocks/canvas.mock';
import {
  getCanvasContext,
  clearCanvas,
  resizeCanvas,
  drawCircle,
  drawLine,
  drawRect,
} from './canvas.utils';

describe('canvas.utils', () => {
  describe('getCanvasContext', () => {
    it('should get 2d context from canvas', () => {
      const canvas = createMockCanvas();
      const ctx = getCanvasContext(canvas);
      expect(ctx).toBeDefined();
    });

    it('should return null for invalid context type', () => {
      const canvas = createMockCanvas();
      const ctx = getCanvasContext(canvas, 'webgl');
      expect(ctx).toBeNull();
    });
  });

  describe('clearCanvas', () => {
    it('should clear canvas', () => {
      const canvas = createMockCanvas();
      const ctx = getCanvasContext(canvas)!;
      const clearRectSpy = vi.spyOn(ctx, 'clearRect');

      clearCanvas(ctx, canvas.width, canvas.height);
      expect(clearRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });
  });

  describe('resizeCanvas', () => {
    it('should resize canvas to match container', () => {
      const canvas = createMockCanvas();
      resizeCanvas(canvas, 1920, 1080);
      expect(canvas.width).toBe(1920);
      expect(canvas.height).toBe(1080);
    });

    it('should handle device pixel ratio', () => {
      const canvas = createMockCanvas();
      const dpr = window.devicePixelRatio || 1;
      resizeCanvas(canvas, 1920, 1080, true);
      expect(canvas.width).toBe(1920 * dpr);
      expect(canvas.height).toBe(1080 * dpr);
    });
  });

  describe('drawCircle', () => {
    it('should draw a circle', () => {
      const ctx = createMockContext2D();
      const beginPathSpy = vi.spyOn(ctx, 'beginPath');
      const arcSpy = vi.spyOn(ctx, 'arc');
      const fillSpy = vi.spyOn(ctx, 'fill');

      drawCircle(ctx, 100, 100, 50);
      expect(beginPathSpy).toHaveBeenCalled();
      expect(arcSpy).toHaveBeenCalledWith(100, 100, 50, 0, Math.PI * 2);
      expect(fillSpy).toHaveBeenCalled();
    });
  });

  describe('drawLine', () => {
    it('should draw a line', () => {
      const ctx = createMockContext2D();
      const beginPathSpy = vi.spyOn(ctx, 'beginPath');
      const moveToSpy = vi.spyOn(ctx, 'moveTo');
      const lineToSpy = vi.spyOn(ctx, 'lineTo');
      const strokeSpy = vi.spyOn(ctx, 'stroke');

      drawLine(ctx, 0, 0, 100, 100);
      expect(beginPathSpy).toHaveBeenCalled();
      expect(moveToSpy).toHaveBeenCalledWith(0, 0);
      expect(lineToSpy).toHaveBeenCalledWith(100, 100);
      expect(strokeSpy).toHaveBeenCalled();
    });
  });

  describe('drawRect', () => {
    it('should draw a rectangle', () => {
      const ctx = createMockContext2D();
      const fillRectSpy = vi.spyOn(ctx, 'fillRect');

      drawRect(ctx, 10, 10, 100, 100);
      expect(fillRectSpy).toHaveBeenCalledWith(10, 10, 100, 100);
    });
  });
});
