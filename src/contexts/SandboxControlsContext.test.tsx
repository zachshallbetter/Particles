import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { SandboxControlsContext, useSandboxControlsContext } from './SandboxControlsContext';

describe('SandboxControlsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide sandbox controls context', () => {
    const TestComponent = () => {
      const context = useSandboxControlsContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    const { container } = render(
      <SandboxControlsContext.Provider value={{ controls: {}, updateControl: vi.fn() }}>
        <TestComponent />
      </SandboxControlsContext.Provider>
    );

    expect(container.textContent).toContain('Context available');
  });
});
