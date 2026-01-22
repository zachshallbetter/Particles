'use client';

import React, { useState, useRef, useCallback } from 'react';
import { WaveParticles } from '@/components/WaveParticles';
import { ParticleEmitter } from '@/components/ParticleEmitter';
import { useParticleSystem } from '@/context/ParticleSystemContext';
import { ParticleSystemProvider } from '@/context/ParticleSystemContext';

/**
 * Effects Showcase - Interactive demonstration of particle physics
 * DOM elements emit particles that interact with the wave system
 */
function EffectsShowcaseContent() {
  const [activeTab, setActiveTab] = useState<'demo' | 'interactive'>('demo');
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [buttonGravityWells, setButtonGravityWells] = useState<
    Array<{ x: number; y: number; width: number; height: number; mass: number; strength: number }>
  >([]);
  const { emittedParticlesRef } = useParticleSystem();

  // Update button positions on scroll and resize
  React.useEffect(() => {
    const updateButtonPositions = () => {
      const newWells = buttonRefs.current
        .filter((btn) => btn !== null)
        .map((btn) => {
          const rect = btn!.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
            mass: 2 + Math.random() * 0.5, // Button mass
            strength: 0.12, // Gravity attraction strength
          };
        });
      setButtonGravityWells(newWells);
    };

    window.addEventListener('scroll', updateButtonPositions, { passive: true });
    window.addEventListener('resize', updateButtonPositions, { passive: true });
    updateButtonPositions(); // Initial call

    return () => {
      window.removeEventListener('scroll', updateButtonPositions);
      window.removeEventListener('resize', updateButtonPositions);
    };
  }, []);

  // Function to emit particles from a button
  const emitParticlesFromButton = useCallback(
    (buttonElement: HTMLButtonElement | null, hue: number, count: number = 12) => {
      if (!buttonElement) return;

      const rect = buttonElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      console.log('[v0] Emitting particles from button at', centerX, centerY);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        emittedParticlesRef.current.push({
          id: `button-${Date.now()}-${i}`,
          x: centerX,
          y: centerY,
          vx,
          vy,
          size: 1.5 + Math.random() * 0.5,
          hue: hue + (Math.random() - 0.5) * 40,
          opacity: 1,
          lifetime: 0,
          maxLifetime: 3000,
          glow: true,
          glowIntensity: 0.8,
          drag: 0.97,
          gravity: 0.05,
          mass: 1 + Math.random() * 0.5, // Particles have mass too
          age: 0,
          saturation: 85,
          baseSize: 1.5,
        });
      }
    },
    [emittedParticlesRef]
  );

  const buttonConfigs = [
    { label: 'Violet Burst', hue: 270 },
    { label: 'Cyan Pulse', hue: 180 },
    { label: 'Pink Wave', hue: 320 },
    { label: 'Green Shimmer', hue: 120 },
    { label: 'Blue Spark', hue: 210 },
    { label: 'Orange Flame', hue: 30 },
  ];

  const InteractiveButton = ({ index, label, hue }: { index: number; label: string; hue: number }) => (
    <button
      ref={(el) => {
        if (el) buttonRefs.current[index] = el;
      }}
      onMouseEnter={(e) => {
        emitParticlesFromButton(e.currentTarget, hue, 6);
      }}
      onClick={(e) => {
        emitParticlesFromButton(e.currentTarget, hue, 12);
      }}
      className="px-6 py-3 rounded-lg font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: `hsl(${hue}, 70%, 50%)`,
        color: 'white',
        boxShadow: `0 0 20px hsla(${hue}, 70%, 50%, 0.5)`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* Wave Particle System Background - Pass button gravity wells */}
      <WaveParticles 
        showRogueParticles={true}
        domGravityWells={buttonGravityWells}
      />

      {/* Particle Emitters - Fixed color gravity wells */}
      <ParticleEmitter
        position={{ x: 5, y: 20 }}
        particlesPerBurst={1}
        burstInterval={1500}
        hue={348}
        emitterSize={16}
        active={true}
        gravityRadius={100}
        gravityStrength={0.08}
        showGravityField={false}
      />
      <ParticleEmitter
        position={{ x: 95, y: 25 }}
        particlesPerBurst={1}
        burstInterval={1500}
        hue={204}
        emitterSize={16}
        active={true}
        gravityRadius={100}
        gravityStrength={0.08}
        showGravityField={false}
      />
      <ParticleEmitter
        position={{ x: 50, y: 90 }}
        particlesPerBurst={1}
        burstInterval={1500}
        hue={180}
        emitterSize={16}
        active={true}
        gravityRadius={100}
        gravityStrength={0.08}
        showGravityField={false}
      />

      {/* Tab Navigation */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        <button
          onClick={() => setActiveTab('demo')}
          className={`px-4 py-2 rounded font-semibold transition-all ${
            activeTab === 'demo'
              ? 'bg-cyan-500 text-black'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Live Demo
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`px-4 py-2 rounded font-semibold transition-all ${
            activeTab === 'interactive'
              ? 'bg-cyan-500 text-black'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Interactive
        </button>
      </div>

      {/* Demo Mode - Static Information */}
      {activeTab === 'demo' && (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
          <div className="text-center backdrop-blur-md bg-black/40 p-12 rounded-xl max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">Particle Effects System</h1>
            <p className="text-slate-300 mb-6">
              Watch as particles interact with wave lines, emitters, and each other through sophisticated physics simulation.
            </p>
            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Gravity Wells</h3>
                <p className="text-sm text-slate-400">Fixed color emitters attract matching particles</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Wave Gravity</h3>
                <p className="text-sm text-slate-400">Particles orbit along wave lines by color</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Particle Collision</h3>
                <p className="text-sm text-slate-400">Same colors merge, different colors repel</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Mass-Based Physics</h3>
                <p className="text-sm text-slate-400">Heavier particles resist gravity more</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('interactive')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded transition-colors pointer-events-auto"
            >
              Try Interactive Mode →
            </button>
          </div>
        </div>
      )}

      {/* Interactive Mode - Clickable Elements */}
      {activeTab === 'interactive' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-12 pointer-events-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Interactive Particle Effects</h1>
            <p className="text-slate-400">Hover and click elements to emit particles</p>
          </div>

          {/* Button Grid */}
          <div className="flex flex-wrap justify-center gap-8 max-w-3xl">
            {buttonConfigs.map((config, index) => (
              <InteractiveButton key={index} index={index} label={config.label} hue={config.hue} />
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl mt-8">
            <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 p-6 rounded-lg">
              <h3 className="text-cyan-400 font-semibold mb-2">Hover Effect</h3>
              <p className="text-sm text-slate-400">Move over any button to emit particles</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 p-6 rounded-lg">
              <h3 className="text-cyan-400 font-semibold mb-2">Click Effect</h3>
              <p className="text-sm text-slate-400">Click buttons to emit more particles with spread</p>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 p-6 rounded-lg">
              <h3 className="text-cyan-400 font-semibold mb-2">Physics</h3>
              <p className="text-sm text-slate-400">Particles interact with waves and each other</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('demo')}
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            ← Back to Demo
          </button>
        </div>
      )}

      {/* Navigation Link to Sandbox */}
      <div className="absolute bottom-8 right-8 z-10">
        <a
          href="/sandbox"
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded transition-colors text-sm"
        >
          Sandbox Controls →
        </a>
      </div>
    </div>
  );
}

export default function EffectsShowcasePage() {
  return (
    <ParticleSystemProvider>
      <EffectsShowcaseContent />
    </ParticleSystemProvider>
  );
}
