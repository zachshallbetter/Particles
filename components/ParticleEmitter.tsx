'use client';

import React, { useEffect, useRef, useId } from 'react';
import { useParticleSystem } from '@/context/ParticleSystemContext';

interface ParticleEmitterProps {
  /** Position as percentage of viewport (0-100) */
  position: { x: number; y: number };
  /** Number of particles to emit per burst */
  particlesPerBurst?: number;
  /** Interval between bursts in ms */
  burstInterval?: number;
  /** Base hue for particles (0-360) */
  hue?: number;
  /** Size of the emitter visual element */
  emitterSize?: number;
  /** Whether the emitter is actively emitting */
  active?: boolean;
  /** Dark mode */
  isDark?: boolean;
  /** Z-index for the emitter visual */
  zIndex?: number;
  /** Gravity radius - absorbs OTHER colored particles within this radius */
  gravityRadius?: number;
  /** Gravity strength - how strongly it pulls other particles */
  gravityStrength?: number;
  /** Show gravity field visualization */
  showGravityField?: boolean;
}

/**
 * Gravity Field Object - visualizes the gravitational influence area
 * All positioning is relative to the shared origin point (0,0)
 */
interface GravityFieldProps {
  radius: number;
  hue: number;
  zIndex: number;
  visible: boolean;
}

const GravityField: React.FC<GravityFieldProps> = ({ radius, hue, zIndex, visible }) => {
  if (!visible) return null;

  return (
    <div
      data-object="gravity-field"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, transparent 0%, transparent 60%, hsla(${hue}, 60%, 50%, 0.08) 80%, hsla(${hue}, 60%, 50%, 0.15) 100%)`,
        border: `1px dashed hsla(${hue}, 60%, 60%, 0.3)`,
        pointerEvents: 'none',
        zIndex: zIndex - 1,
        boxSizing: 'border-box',
      }}
    />
  );
};

/**
 * Emission Point Object - the visual representation of where particles are emitted from
 * All positioning is relative to the shared origin point (0,0)
 */
interface EmissionPointProps {
  size: number;
  hue: number;
  isDark: boolean;
  zIndex: number;
}

const EmissionPoint: React.FC<EmissionPointProps> = ({ size, hue, isDark, zIndex }) => {
  const glowColor = `hsl(${hue}, 80%, ${isDark ? 60 : 50}%)`;
  const coreColor = `hsl(${hue}, 70%, ${isDark ? 80 : 70}%)`;
  const glowColorWithOpacity = `hsla(${hue}, 80%, ${isDark ? 60 : 50}%, 0.25)`;
  const glowColorBoxShadow = `hsla(${hue}, 80%, ${isDark ? 60 : 50}%, 0.3)`;

  return (
    <>
      {/* Outer glow - centered at origin */}
      <div
        data-object="emission-glow"
        className="absolute rounded-full animate-pulse"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 4,
          height: size * 4,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColorWithOpacity} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex,
          boxSizing: 'border-box',
        }}
      />
      {/* Inner core - centered at origin */}
      <div
        data-object="emission-core"
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${coreColor} 0%, ${glowColor} 50%, transparent 100%)`,
          boxShadow: `0 0 ${size}px ${glowColorBoxShadow}, 0 0 ${size * 2}px ${glowColorBoxShadow}`,
          pointerEvents: 'none',
          zIndex,
          boxSizing: 'border-box',
        }}
      />
      {/* Bright center - centered at origin */}
      <div
        data-object="emission-center"
        className="absolute rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: '50%',
          background: `radial-gradient(circle, white 0%, ${coreColor} 100%)`,
          pointerEvents: 'none',
          zIndex,
          boxSizing: 'border-box',
        }}
      />
    </>
  );
};

/**
 * Absorption Point Object - visualizes where particles are absorbed
 * (Currently shares the same visual as emission point, but could be styled differently)
 * All positioning is relative to the shared origin point (0,0)
 */
interface AbsorptionPointProps {
  hue: number;
  zIndex: number;
}

const AbsorptionPoint: React.FC<AbsorptionPointProps> = ({ hue, zIndex }) => {
  // Absorption point could have its own visual style (e.g., a pulsing ring)
  // For now, it's conceptually part of the emission point
  return null; // Absorptions are handled by the gravity field and emission point
};

/**
 * A particle emitter that injects particles into the main WaveParticles system.
 * Composed of separate objects: GravityField, EmissionPoint, and AbsorptionPoint
 * All objects share the same center point but are distinct entities.
 */
export const ParticleEmitter: React.FC<ParticleEmitterProps> = ({
  position,
  particlesPerBurst = 2,
  burstInterval = 200,
  hue = 348,
  emitterSize = 24,
  active = true,
  isDark = true,
  zIndex = 10,
  gravityRadius = 120,
  gravityStrength = 0.15,
  showGravityField = true,
}) => {
  const id = useId();
  const { registerEmitter, unregisterEmitter, emitParticles } = useParticleSystem();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Shared center point for all objects
  const center = { x: position.x, y: position.y };

  // Register this emitter with the particle system (including gravity settings)
  useEffect(() => {
    console.log('[EMITTER] Registering emitter', { id, position, hue, active, particlesPerBurst, burstInterval });
    registerEmitter({
      id,
      x: position.x,
      y: position.y,
      hue,
      active,
      gravityRadius,
      gravityStrength,
    });

    return () => {
      console.log('[EMITTER] Unregistering emitter', { id });
      unregisterEmitter(id);
    };
  }, [id, position.x, position.y, hue, active, gravityRadius, gravityStrength, registerEmitter, unregisterEmitter, particlesPerBurst, burstInterval]);

  // Emit particles at regular intervals
  useEffect(() => {
    if (!active) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log('[EMITTER] Setting up emission interval', { id, particlesPerBurst, burstInterval, position, active });
    
    intervalRef.current = setInterval(() => {
      console.log('[EMITTER] Triggering particle emission', { id, particlesPerBurst, burstInterval, position });
      emitParticles(id, particlesPerBurst);
    }, burstInterval);
    
    // Emit immediately on mount
    console.log('[EMITTER] Emitting initial particles', { id, particlesPerBurst });
    emitParticles(id, particlesPerBurst);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [active, id, particlesPerBurst, burstInterval, emitParticles]);

  // Single container with shared origin point (0,0) at the center
  // All child objects position themselves relative to this origin
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${center.x}%`,
    top: `${center.y}%`,
    transform: 'translate(-50%, -50%)',
    width: 0,
    height: 0,
    pointerEvents: 'none',
    // Ensure no box-sizing or margin issues
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle} data-emitter-container>
      {/* Gravity Field Object - positioned relative to container origin */}
      <GravityField
        radius={gravityRadius}
        hue={hue}
        zIndex={zIndex}
        visible={showGravityField}
      />
      
      {/* Emission Point Object - positioned relative to container origin */}
      <EmissionPoint
        size={emitterSize}
        hue={hue}
        isDark={isDark}
        zIndex={zIndex}
      />
      
      {/* Absorption Point Object - positioned relative to container origin */}
      <AbsorptionPoint
        hue={hue}
        zIndex={zIndex}
      />
    </div>
  );
};

ParticleEmitter.displayName = 'ParticleEmitter';
