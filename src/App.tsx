import { WaveParticles } from '@/components/WaveParticles'
import { ParticleEmitter } from '@/components/ParticleEmitter'
import { FPSMonitor } from '@/components/FPSMonitor'
import { ParticleSystemProvider } from '@/context/ParticleSystemContext'

export default function App() {
  return (
    <ParticleSystemProvider>
      <main className="relative min-h-screen overflow-hidden">
        {/* Wave and Particle Animation - includes background layers */}
        <WaveParticles 
          showWaves={true}
          showParticles={false}
          showRogueParticles={true}
          showBackgroundLayers={true}
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
          zIndex={10}
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
          zIndex={10}
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
          zIndex={10}
          gravityRadius={80}
          gravityStrength={0.06}
        />

        {/* FPS Monitor */}
        <FPSMonitor isDark={true} />
      </main>
    </ParticleSystemProvider>
  )
}
