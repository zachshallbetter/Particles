import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ParticleSystemProvider } from '@/context/ParticleSystemContext';

/**
 * Create a mock router for testing components that use React Router
 */
export function createMockRouter(initialEntries: string[] = ['/']) {
  return {
    initialEntries,
    initialIndex: 0,
  };
}

/**
 * Create a mock canvas element for particle/wave tests
 */
export function createMockCanvas(width = 800, height = 600): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const context = canvas.getContext('2d');
  if (context) {
    // Mock common canvas methods
    context.clearRect = vi.fn();
    context.fillRect = vi.fn();
    context.strokeRect = vi.fn();
    context.beginPath = vi.fn();
    context.moveTo = vi.fn();
    context.lineTo = vi.fn();
    context.arc = vi.fn();
    context.fill = vi.fn();
    context.stroke = vi.fn();
    context.closePath = vi.fn();
    context.save = vi.fn();
    context.restore = vi.fn();
    context.translate = vi.fn();
    context.rotate = vi.fn();
    context.scale = vi.fn();
    context.setTransform = vi.fn();
    context.getImageData = vi.fn(() => ({
      data: new Uint8ClampedArray(width * height * 4),
      width,
      height,
      colorSpace: 'srgb',
    })) as typeof context.getImageData;
    context.putImageData = vi.fn();
  }
  
  return canvas;
}

/**
 * Render a component with all necessary providers
 */
interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  withRouter?: boolean;
  withProviders?: boolean;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    withRouter = true,
    withProviders = true,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let content = children;
    
    if (withProviders) {
      content = (
        <ParticleSystemProvider>
          {content}
        </ParticleSystemProvider>
      );
    }
    
    if (withRouter) {
      content = (
        <BrowserRouter>
          {content}
        </BrowserRouter>
      );
    }
    
    return <>{content}</>;
  };
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wait for async updates to complete
 */
export function waitForAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Render with all providers (backward compatibility)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ParticleSystemProvider>
        {children}
      </ParticleSystemProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
