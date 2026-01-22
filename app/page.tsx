'use client';

import { WaveParticles } from '@/components/WaveParticles';
import { ParticleEmitter } from '@/components/ParticleEmitter';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FPSMonitor } from '@/components/FPSMonitor';
import { ParticleSystemProvider } from '@/context/ParticleSystemContext';

export default function Home() {
  return (
    <ParticleSystemProvider>
      <main className="relative min-h-screen overflow-hidden">
        {/* Parallax Background Layers */}
        <ParticleBackground />
        
        {/* Wave and Particle Animation Background */}
        <WaveParticles 
          showWaves={true}
          showParticles={false}
          showRogueParticles={true}
        />
        
        {/* Pink Emitter (hue 348) - absorbs blue and teal particles */}
        <ParticleEmitter
          position={{ x: 20, y: 60 }}
          particlesPerBurst={1}
          burstInterval={2000}
          emitterSize={20}
          active={true}
          isDark={true}
          hue={348}
          zIndex={5}
          gravityRadius={80}
          gravityStrength={0.06}
        />
        
        {/* Blue Emitter (hue 204) - absorbs pink and teal particles */}
        <ParticleEmitter
          position={{ x: 50, y: 80 }}
          particlesPerBurst={1}
          burstInterval={2000}
          emitterSize={20}
          active={true}
          isDark={true}
          hue={204}
          zIndex={5}
          gravityRadius={80}
          gravityStrength={0.06}
        />
        
        {/* Teal Emitter (hue 180) - absorbs pink and blue particles */}
        <ParticleEmitter
          position={{ x: 80, y: 65 }}
          particlesPerBurst={1}
          burstInterval={2000}
          emitterSize={20}
          active={true}
          isDark={true}
          hue={180}
          zIndex={5}
          gravityRadius={80}
          gravityStrength={0.06}
        />

        {/* FPS Monitor */}
        <FPSMonitor isDark={true} />

        {/* Navigation Panel */}
        <div className="fixed bottom-8 right-8 z-20 backdrop-blur-md bg-black/70 border border-cyan-500/40 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Particle System</h3>
          <div className="flex flex-col gap-3">
            <a
              href="/elements"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded transition-colors text-sm text-center"
            >
              Interactive Elements
            </a>
            <a
              href="/sandbox"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded transition-colors text-sm text-center"
            >
              Control Sandbox
            </a>
            <a
              href="/effects-showcase"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded transition-colors text-sm text-center"
            >
              Effects Demo
            </a>
          </div>
        </div>
      </main>
    </ParticleSystemProvider>
  );
}
