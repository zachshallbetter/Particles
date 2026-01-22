import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { SandboxObjectsContext, useSandboxObjectsContext } from './SandboxObjectsContext';

describe('SandboxObjectsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide sandbox objects context', () => {
    const TestComponent = () => {
      const context = useSandboxObjectsContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    const { container } = render(
      <SandboxObjectsContext.Provider value={{ objects: [], addObject: vi.fn() }}>
        <TestComponent />
      </SandboxObjectsContext.Provider>
    );

    expect(container.textContent).toContain('Context available');
  });
});
