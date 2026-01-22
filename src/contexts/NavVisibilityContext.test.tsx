import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { NavVisibilityContext, useNavVisibilityContext } from './NavVisibilityContext';

describe('NavVisibilityContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide nav visibility context', () => {
    const TestComponent = () => {
      const context = useNavVisibilityContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    const { container } = render(
      <NavVisibilityContext.Provider value={{ isVisible: true, setIsVisible: vi.fn() }}>
        <TestComponent />
      </NavVisibilityContext.Provider>
    );

    expect(container.textContent).toContain('Context available');
  });
});
