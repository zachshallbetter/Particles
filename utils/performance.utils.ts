/**
 * Object Pool for efficient object reuse
 * Reduces garbage collection overhead by reusing objects
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(
    createFn: () => T,
    resetFn: (obj: T) => void,
    initialSize: number = 10
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;

    // Pre-populate the pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  /**
   * Get an object from the pool (or create a new one if empty)
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  /**
   * Return an object to the pool
   */
  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  /**
   * Get the current pool size
   */
  get size(): number {
    return this.pool.length;
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool = [];
  }
}

/**
 * Throttle function execution to a maximum rate
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean = false;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
};

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
};

/**
 * Request animation frame with fallback
 */
export const requestFrame = (callback: FrameRequestCallback): number => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16) as unknown as number;
};

/**
 * Cancel animation frame with fallback
 */
export const cancelFrame = (id: number): void => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};
