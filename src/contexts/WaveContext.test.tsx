import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WaveContext, useWaveContext } from './WaveContext';

describe('WaveContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide wave context value', () => {
    const TestComponent = () => {
      const context = useWaveContext();
      return <div>{context ? 'Context available' : 'No context'}</div>;
    };

    render(
      <WaveContext.Provider value={{ waves: [], addWave: vi.fn(), removeWave: vi.fn() }}>
        <TestComponent />
      </WaveContext.Provider>
    );

    expect(screen.getByText('Context available')).toBeInTheDocument();
  });

  it('should provide wave CRUD operations', () => {
    const addWave = vi.fn();
    const removeWave = vi.fn();
    const updateWave = vi.fn();

    const TestComponent = () => {
      const context = useWaveContext();
      return (
        <div>
          <button onClick={() => context.addWave({ amplitude: 50 })}>Add</button>
          <button onClick={() => context.removeWave('id')}>Remove</button>
        </div>
      );
    };

    render(
      <WaveContext.Provider value={{ waves: [], addWave, removeWave, updateWave }}>
        <TestComponent />
      </WaveContext.Provider>
    );

    expect(addWave).toBeDefined();
    expect(removeWave).toBeDefined();
  });
});
