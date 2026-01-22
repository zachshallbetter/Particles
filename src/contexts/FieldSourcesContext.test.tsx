import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FieldSourcesContext, useFieldSourcesContext } from './FieldSourcesContext';

describe('FieldSourcesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide field sources context', () => {
    const TestComponent = () => {
      const context = useFieldSourcesContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    const { container } = render(
      <FieldSourcesContext.Provider value={{ sources: [], addSource: vi.fn() }}>
        <TestComponent />
      </FieldSourcesContext.Provider>
    );

    expect(container.textContent).toContain('Context available');
  });
});
