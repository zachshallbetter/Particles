import { ReactNode } from 'react';
import { vi } from 'vitest';

export const createMockRouter = () => {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    goBack: vi.fn(),
    goForward: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  };
};

export const MockRouterProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
