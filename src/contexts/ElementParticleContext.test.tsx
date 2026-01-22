import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ElementParticleContext, useElementParticleContext } from './ElementParticleContext';

describe('ElementParticleContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide element particle context', () => {
    const TestComponent = () => {
      const context = useElementParticleContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    const { container } = render(
      <ElementParticleContext.Provider value={{ particles: [], addParticle: vi.fn() }}>
        <TestComponent />
      </ElementParticleContext.Provider>
    );

    expect(container.textContent).toContain('Context available');
  });
});
