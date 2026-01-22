'use client';

import React from "react"

import { useEffect, useRef } from 'react';
import type { WaveParticleEventEmitter, WaveParticleEventType, WaveParticleEventListener } from '@/events/WaveParticleEventEmitter';

/**
 * Hook for subscribing to wave and particle events
 */
export const useWaveParticleEvents = (
  emitter: WaveParticleEventEmitter | null,
  event: WaveParticleEventType,
  listener: WaveParticleEventListener,
  deps?: React.DependencyList
) => {
  const listenerRef = useRef(listener);

  // Update listener ref when it changes
  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!emitter) {
      return;
    }

    const wrappedListener: WaveParticleEventListener = (data) => {
      listenerRef.current(data);
    };

    emitter.on(event, wrappedListener);

    return () => {
      emitter.off(event, wrappedListener);
    };
  }, [emitter, event, ...(deps || [])]);
};

/**
 * Hook for subscribing to multiple events
 */
export const useWaveParticleEventsMultiple = (
  emitter: WaveParticleEventEmitter | null,
  events: Array<{ event: WaveParticleEventType; listener: WaveParticleEventListener }>,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    if (!emitter) {
      return;
    }

    const unsubscribes = events.map(({ event, listener }) => {
      return emitter.on(event, listener);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [emitter, ...events.map((e) => e.event), ...(deps || [])]);
};
