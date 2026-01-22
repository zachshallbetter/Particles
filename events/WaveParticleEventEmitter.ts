/**
 * Event types for wave and particle system
 */
export type WaveParticleEventType =
  | 'particle:spawn'
  | 'particle:destroy'
  | 'particle:explode'
  | 'particle:enter-gravity'
  | 'particle:exit-gravity'
  | 'wave:grow-complete'
  | 'wave:update'
  | 'config:change'
  | 'animation:start'
  | 'animation:stop'
  | 'animation:pause'
  | 'animation:resume';

/**
 * Event data structure
 */
export interface WaveParticleEventData {
  type: WaveParticleEventType;
  timestamp: number;
  payload?: unknown;
}

/**
 * Event listener type
 */
export type WaveParticleEventListener = (data: WaveParticleEventData) => void;

/**
 * Event emitter for wave and particle system
 * Allows components to communicate without tight coupling
 */
export class WaveParticleEventEmitter {
  private listeners: Map<WaveParticleEventType, Set<WaveParticleEventListener>> = new Map();

  /**
   * Subscribe to an event
   */
  on(event: WaveParticleEventType, listener: WaveParticleEventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Unsubscribe from an event
   */
  off(event: WaveParticleEventType, listener: WaveParticleEventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
    }
  }

  /**
   * Emit an event
   */
  emit(event: WaveParticleEventType, payload?: unknown): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const data: WaveParticleEventData = {
        type: event,
        timestamp: Date.now(),
        payload,
      };
      eventListeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Subscribe to an event once
   */
  once(event: WaveParticleEventType, listener: WaveParticleEventListener): () => void {
    const wrappedListener: WaveParticleEventListener = (data) => {
      this.off(event, wrappedListener);
      listener(data);
    };
    return this.on(event, wrappedListener);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: WaveParticleEventType): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: WaveParticleEventType): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}
