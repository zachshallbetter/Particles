'use client';

import React, { useRef, useEffect, useCallback, createContext, useContext, ReactNode, useState } from 'react';
import { useParticleSystem } from '@/context/ParticleSystemContext';

/**
 * Configuration for applying effects to DOM elements
 */
export interface ElementEffectConfig {
  // Particle emission
  emitOnHover?: boolean;
  emitOnClick?: boolean;
  emitOnFocus?: boolean;
  particlesPerEvent?: number;
  particleHue?: number;
  particleSize?: number;
  particleLifetime?: number;
  particleVelocity?: number;
  particleSpread?: number; // 0-360 degrees
  glowIntensity?: number;

  // Element transforms
  scaleOnInteract?: number;
  rotateOnInteract?: number;
  duration?: number; // ms

  // Custom callbacks
  onHover?: () => void;
  onClick?: () => void;
  onFocus?: () => void;
}

interface ElementEffectInstance {
  element: HTMLElement;
  config: ElementEffectConfig;
  listeners: { [key: string]: EventListener };
}

interface ElementEffectsContextValue {
  registerElement: (ref: React.RefObject<HTMLElement>, config: ElementEffectConfig) => void;
  unregisterElement: (ref: React.RefObject<HTMLElement>) => void;
  applyEffect: (element: HTMLElement, effect: 'click' | 'hover' | 'focus') => void;
  emitParticlesFromElement: (element: HTMLElement, count: number, hue: number, velocity: number, spread: number) => void;
  instances: Map<HTMLElement, ElementEffectInstance>;
}

const ElementEffectsContext = createContext<ElementEffectsContextValue | null>(null);

export function ElementEffectsProvider({ children }: { children: ReactNode }) {
  const { emittedParticlesRef, registerEmitter } = useParticleSystem();
  const instancesRef = useRef<Map<HTMLElement, ElementEffectInstance>>(new Map());

  const emitParticlesFromElement = useCallback((element: HTMLElement, count: number, hue: number, velocity: number, spread: number) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * (spread * Math.PI / 180) - (spread * Math.PI / 360);
      const vx = Math.cos(angle) * velocity + (Math.random() - 0.5) * 0.5;
      const vy = Math.sin(angle) * velocity + (Math.random() - 0.5) * 0.5;

      emittedParticlesRef.current.push({
        id: `element-${element.id}-${Date.now()}-${i}`,
        x: centerX,
        y: centerY,
        vx,
        vy,
        size: 1.5 + Math.random(),
        hue: hue + (Math.random() - 0.5) * 30,
        opacity: 1,
        lifetime: 0,
        maxLifetime: 2000,
        glow: true,
        glowIntensity: 0.8,
        drag: 0.97,
        gravity: 0.1,
        mass: 1,
        age: 0,
        saturation: 80,
        baseSize: 1.5,
      });
    }
  }, [emittedParticlesRef]);

  const applyTransform = useCallback((element: HTMLElement, scale: number, rotate: number, duration: number) => {
    const originalTransform = element.style.transform;
    element.style.transition = `transform ${duration}ms ease-out`;
    element.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

    setTimeout(() => {
      element.style.transform = originalTransform;
    }, duration);
  }, []);

  const applyEffect = useCallback((element: HTMLElement, effectType: 'click' | 'hover' | 'focus') => {
    const instance = instancesRef.current.get(element);
    if (!instance) return;

    const config = instance.config;

    // Emit particles
    if (
      (effectType === 'hover' && config.emitOnHover) ||
      (effectType === 'click' && config.emitOnClick) ||
      (effectType === 'focus' && config.emitOnFocus)
    ) {
      emitParticlesFromElement(
        element,
        config.particlesPerEvent || 5,
        config.particleHue || 280,
        config.particleVelocity || 2,
        config.particleSpread || 360
      );
    }

    // Apply transforms
    if (config.scaleOnInteract || config.rotateOnInteract) {
      applyTransform(element, config.scaleOnInteract || 1, config.rotateOnInteract || 0, config.duration || 200);
    }

    // Call custom callbacks
    if (effectType === 'hover' && config.onHover) config.onHover();
    if (effectType === 'click' && config.onClick) config.onClick();
    if (effectType === 'focus' && config.onFocus) config.onFocus();
  }, [emitParticlesFromElement, applyTransform]);

  const registerElement = useCallback((ref: React.RefObject<HTMLElement>, config: ElementEffectConfig) => {
    if (!ref.current) return;

    const element = ref.current;
    if (instancesRef.current.has(element)) return;

    const listeners: { [key: string]: EventListener } = {};

    if (config.emitOnHover) {
      listeners.mouseenter = () => applyEffect(element, 'hover');
      element.addEventListener('mouseenter', listeners.mouseenter);
    }

    if (config.emitOnClick) {
      listeners.click = () => applyEffect(element, 'click');
      element.addEventListener('click', listeners.click);
    }

    if (config.emitOnFocus) {
      listeners.focus = () => applyEffect(element, 'focus');
      element.addEventListener('focus', listeners.focus);
    }

    instancesRef.current.set(element, { element, config, listeners });
  }, [applyEffect]);

  const unregisterElement = useCallback((ref: React.RefObject<HTMLElement>) => {
    if (!ref.current) return;

    const element = ref.current;
    const instance = instancesRef.current.get(element);
    if (!instance) return;

    Object.entries(instance.listeners).forEach(([eventType, listener]) => {
      element.removeEventListener(eventType.replace('on', '').toLowerCase(), listener);
    });

    instancesRef.current.delete(element);
  }, []);

  return (
    <ElementEffectsContext.Provider
      value={{
        registerElement,
        unregisterElement,
        applyEffect,
        emitParticlesFromElement,
        instances: instancesRef.current,
      }}
    >
      {children}
    </ElementEffectsContext.Provider>
  );
}

export function useElementEffects() {
  const context = useContext(ElementEffectsContext);
  if (!context) {
    throw new Error('useElementEffects must be used within ElementEffectsProvider');
  }

  return {
    registerElement: context.registerElement,
    unregisterElement: context.unregisterElement,
    applyEffect: context.applyEffect,
    emitParticlesFromElement: context.emitParticlesFromElement,
    instances: context.instances,
  };
}
