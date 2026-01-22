'use client';

import React, { useState } from 'react';
import { WaveParticles } from '@/components/WaveParticles';
import { DEFAULT_VISUAL_EFFECTS, PERFORMANCE_VISUAL_EFFECTS, MINIMAL_VISUAL_EFFECTS, ULTRA_VISUAL_EFFECTS } from '@/config/visual-effects.config';
import type { VisualEffectsConfig } from '@/config/visual-effects.config';
import type { WaveParticleConfig, WaveLine } from '@/types/wave.types';

const PRESET_EFFECTS = {
  default: DEFAULT_VISUAL_EFFECTS,
  performance: PERFORMANCE_VISUAL_EFFECTS,
  minimal: MINIMAL_VISUAL_EFFECTS,
  ultra: ULTRA_VISUAL_EFFECTS,
};

const DEFAULT_CONFIG: WaveParticleConfig = {
  canvasWidthFactor: 1,
  canvasHeightFactor: 1,
  lineWidth: 2,
  lines: [
    {
      color: '#FF1744',
      amplitude: 30,
      frequency: 0.02,
      speed: 0.1,
      hue: 0,
      parallaxIndex: 0,
      verticalPosition: { min: 30, max: 50, current: 40, default: 40 },
    },
    {
      color: '#00E5FF',
      amplitude: 25,
      frequency: 0.018,
      speed: 0.08,
      hue: 180,
      parallaxIndex: 1,
      verticalPosition: { min: 45, max: 65, current: 55, default: 55 },
    },
    {
      color: '#76FF03',
      amplitude: 20,
      frequency: 0.016,
      speed: 0.12,
      hue: 120,
      parallaxIndex: 2,
      verticalPosition: { min: 55, max: 75, current: 65, default: 65 },
    },
  ],
  particlesPerLine: 80000,
  particleSize: { min: 0.5, max: 2.5, default: 1.5 },
  particleSpeed: { min: 0.1, max: 0.4, default: 0.25 },
  particleRange: { min: 10000, max: 30000, default: 20000 },
  glowProbability: 0.3,
  rogueParticles: {
    count: 50000,
    speed: { min: 0.1, max: 0.5, default: 0.3 },
    size: { min: 0.5, max: 2 },
    opacity: { min: 0.3, max: 1 },
    color: '#00E5FF',
    verticalBounds: { min: 0, max: 100, default: 50 },
  },
  explosion: {
    duration: 500,
    distance: { min: 50, max: 200, default: 100 },
    popProbability: 0.1,
    popDistance: 500,
  },
  scrollY: 0,
  parallaxFactor: 1,
  parallaxSmoothing: 0.15,
  backgroundColor: '#0a0e27',
  gravityWell: {
    enabled: false,
    x: 50,
    y: 50,
    strength: 1,
    radius: 150,
  },
  roaming: {
    enabled: false,
    speed: 0.5,
    range: 100,
  },
};

export default function SandboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'visual' | 'waves' | 'particles' | 'advanced'>('visual');
  const [visualEffects, setVisualEffects] = useState<VisualEffectsConfig>(DEFAULT_VISUAL_EFFECTS);
  const [config, setConfig] = useState<WaveParticleConfig>(DEFAULT_CONFIG);
  const [selectedWaveIndex, setSelectedWaveIndex] = useState(0);

  // Helper to update nested config
  const updateConfigPath = (path: string, value: any) => {
    setConfig(prev => {
      const keys = path.split('.');
      let obj: any = { ...prev };
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = Array.isArray(current[keys[i]]) 
          ? [...current[keys[i]]] 
          : { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return obj;
    });
  };

  const updateWaveLine = (index: number, property: string, value: any) => {
    const newLines = [...config.lines];
    newLines[index] = { ...newLines[index], [property]: value };
    setConfig(prev => ({ ...prev, lines: newLines }));
  };

  const addWaveLine = () => {
    const newLine: WaveLine = {
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      amplitude: 25,
      frequency: 0.02,
      speed: 0.1,
      hue: Math.random() * 360,
      parallaxIndex: config.lines.length,
      verticalPosition: { min: 40, max: 60, current: 50, default: 50 },
    };
    setConfig(prev => ({ ...prev, lines: [...prev.lines, newLine] }));
  };

  const removeWaveLine = (index: number) => {
    setConfig(prev => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
    setSelectedWaveIndex(Math.max(0, selectedWaveIndex - 1));
  };

  const applyPreset = (presetKey: keyof typeof PRESET_EFFECTS) => {
    setVisualEffects(PRESET_EFFECTS[presetKey]);
  };

  const toggleEffect = (key: string) => {
    setVisualEffects(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof VisualEffectsConfig], enabled: !(prev[key as keyof VisualEffectsConfig] as any).enabled },
    }));
  };

  const updateEffect = (key: string, property: string, value: any) => {
    setVisualEffects(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof VisualEffectsConfig], [property]: value },
    }));
  };

  const selectedWave = config.lines[selectedWaveIndex];

  return (
    <div className="w-screen h-screen flex bg-slate-950 overflow-hidden">
      {/* Canvas */}
      <div className="flex-1 relative">
        <WaveParticles config={config} visualEffects={visualEffects} />
        
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center text-white"
        >
          {sidebarOpen ? '→' : '←'}
        </button>
      </div>

      {/* Glassmorphism Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-black/40 backdrop-blur-xl border-l border-white/20 transform transition-all duration-300 z-50 overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white">Sandbox Controls</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-sm border border-white/20">
            {(['visual', 'waves', 'particles', 'advanced'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500/50 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Visual Effects Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-cyan-400">Effect Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(PRESET_EFFECTS).map(preset => (
                    <button
                      key={preset}
                      onClick={() => applyPreset(preset as keyof typeof PRESET_EFFECTS)}
                      className="px-3 py-2 text-xs rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.enabled}
                    onChange={e => setVisualEffects(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">All Effects</span>
                </label>
                <div>
                  <label className="text-xs text-slate-400">Intensity</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={visualEffects.overallIntensity}
                    onChange={e => setVisualEffects(prev => ({ ...prev, overallIntensity: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.performanceMode}
                    onChange={e => setVisualEffects(prev => ({ ...prev, performanceMode: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">Performance Mode</span>
                </label>
              </div>

              {/* Chromatic Aberration */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.chromaticAberration.enabled}
                    onChange={() => toggleEffect('chromaticAberration')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Chromatic Aberration</span>
                </label>
                {visualEffects.chromaticAberration.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">Intensity: {(visualEffects.chromaticAberration?.intensity ?? 0).toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={visualEffects.chromaticAberration.intensity}
                        onChange={e => updateEffect('chromaticAberration', 'intensity', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Min Density: {visualEffects.chromaticAberration.minDensity}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={visualEffects.chromaticAberration.minDensity}
                        onChange={e => updateEffect('chromaticAberration', 'minDensity', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Constellation Patterns */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.constellationPatterns.enabled}
                    onChange={() => toggleEffect('constellationPatterns')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Constellations</span>
                </label>
                {visualEffects.constellationPatterns.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">Min Cluster: {visualEffects.constellationPatterns.minClusterSize}</label>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        value={visualEffects.constellationPatterns.minClusterSize}
                        onChange={e => updateEffect('constellationPatterns', 'minClusterSize', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Distance: {visualEffects.constellationPatterns.connectionDistance}</label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={visualEffects.constellationPatterns.connectionDistance}
                        onChange={e => updateEffect('constellationPatterns', 'connectionDistance', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Particle Evolution */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.particleEvolution.enabled}
                    onChange={() => toggleEffect('particleEvolution')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Particle Evolution</span>
                </label>
                {visualEffects.particleEvolution.enabled && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.particleEvolution.fusionEnabled}
                        onChange={e => updateEffect('particleEvolution', 'fusionEnabled', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Fusion</span>
                    </label>
                    <div>
                      <label className="text-xs text-slate-400">Fusion Distance: {visualEffects.particleEvolution.fusionDistance}</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={visualEffects.particleEvolution.fusionDistance}
                        onChange={e => updateEffect('particleEvolution', 'fusionDistance', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Wave Interference */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.waveInterference.enabled}
                    onChange={() => toggleEffect('waveInterference')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Wave Interference</span>
                </label>
                {visualEffects.waveInterference.enabled && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.waveInterference.moirePattern}
                        onChange={e => updateEffect('waveInterference', 'moirePattern', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Moiré Pattern</span>
                    </label>
                    <div>
                      <label className="text-xs text-slate-400">Intensity: {(visualEffects.waveInterference?.intensity ?? 0).toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={visualEffects.waveInterference.intensity}
                        onChange={e => updateEffect('waveInterference', 'intensity', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Wave Texture */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.waveTextureVariation.enabled}
                    onChange={() => toggleEffect('waveTextureVariation')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Wave Texture</span>
                </label>
                {visualEffects.waveTextureVariation.enabled && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.waveTextureVariation.energyPulse}
                        onChange={e => updateEffect('waveTextureVariation', 'energyPulse', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Energy Pulse</span>
                    </label>
                    <div>
                      <label className="text-xs text-slate-400">Pulse Speed: {visualEffects.waveTextureVariation.pulseSpeed}</label>
                      <input
                        type="range"
                        min="1000"
                        max="5000"
                        step="100"
                        value={visualEffects.waveTextureVariation.pulseSpeed}
                        onChange={e => updateEffect('waveTextureVariation', 'pulseSpeed', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Bloom & Glare */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.bloomGlare.enabled}
                    onChange={() => toggleEffect('bloomGlare')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Bloom & Glare</span>
                </label>
                {visualEffects.bloomGlare.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">Bloom Radius: {visualEffects.bloomGlare.bloomRadius}</label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={visualEffects.bloomGlare.bloomRadius}
                        onChange={e => updateEffect('bloomGlare', 'bloomRadius', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Intensity: {(visualEffects.bloomGlare?.glareIntensity ?? 0).toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={visualEffects.bloomGlare.glareIntensity}
                        onChange={e => updateEffect('bloomGlare', 'glareIntensity', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Distortion Fields */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.distortionFields.enabled}
                    onChange={() => toggleEffect('distortionFields')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Distortion</span>
                </label>
                {visualEffects.distortionFields.enabled && (
                  <div>
                    <label className="text-xs text-slate-400">Magnitude: {(visualEffects.distortionFields?.magnitude ?? 0).toFixed(2)}</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={visualEffects.distortionFields.magnitude}
                      onChange={e => updateEffect('distortionFields', 'magnitude', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Particle Halos */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.particleHalos.enabled}
                    onChange={() => toggleEffect('particleHalos')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Particle Halos</span>
                </label>
                {visualEffects.particleHalos.enabled && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.particleHalos.solarWind}
                        onChange={e => updateEffect('particleHalos', 'solarWind', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Solar Wind</span>
                    </label>
                    <div>
                      <label className="text-xs text-slate-400">Base Size: {visualEffects.particleHalos.baseSize}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={visualEffects.particleHalos.baseSize}
                        onChange={e => updateEffect('particleHalos', 'baseSize', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Large Particles */}
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visualEffects.largeParticles.enabled}
                    onChange={() => toggleEffect('largeParticles')}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-semibold text-slate-300">Large Particles</span>
                </label>
                {visualEffects.largeParticles.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">Min Mass: {(visualEffects.largeParticles?.minMassForLarge ?? 1).toFixed(2)}</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={visualEffects.largeParticles.minMassForLarge}
                        onChange={e => updateEffect('largeParticles', 'minMassForLarge', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Degradation: {(visualEffects.largeParticles?.degradationRate ?? 0.0001).toFixed(5)}</label>
                      <input
                        type="range"
                        min="0.00001"
                        max="0.001"
                        step="0.00001"
                        value={visualEffects.largeParticles.degradationRate}
                        onChange={e => updateEffect('largeParticles', 'degradationRate', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.largeParticles.coronaEnabled}
                        onChange={e => updateEffect('largeParticles', 'coronaEnabled', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Corona</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.largeParticles.glowEnabled}
                        onChange={e => updateEffect('largeParticles', 'glowEnabled', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Glow</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visualEffects.largeParticles.repulsionEnabled}
                        onChange={e => updateEffect('largeParticles', 'repulsionEnabled', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-slate-300">Repulsion</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Waves Tab */}
          {activeTab === 'waves' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-cyan-400">Waves ({config.lines.length})</h3>
                <button
                  onClick={addWaveLine}
                  className="px-2 py-1 text-xs rounded bg-cyan-500/50 hover:bg-cyan-500/70 text-white transition-all"
                >
                  + Add
                </button>
              </div>

              {config.lines.map((wave, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedWaveIndex(idx)}
                  className={`bg-white/10 rounded-lg p-4 border transition-all cursor-pointer ${
                    selectedWaveIndex === idx
                      ? 'border-cyan-400/50 bg-white/20'
                      : 'border-white/20 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: wave.color }}
                      />
                      <span className="text-sm font-semibold text-slate-300">Wave {idx + 1}</span>
                    </div>
                    {config.lines.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWaveLine(idx);
                        }}
                        className="text-xs px-2 py-1 rounded bg-red-500/50 hover:bg-red-600/70 text-white"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {selectedWaveIndex === idx && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-400">Amplitude: {Number(wave.amplitude || 30).toFixed(0)}</label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={Number(wave.amplitude || 30)}
                          onChange={e => updateWaveLine(idx, 'amplitude', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Frequency: {Number(wave.frequency || 0.02).toFixed(4)}</label>
                        <input
                          type="range"
                          min="0.001"
                          max="0.1"
                          step="0.001"
                          value={Number(wave.frequency || 0.02)}
                          onChange={e => updateWaveLine(idx, 'frequency', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Speed: {Number(wave.speed || 0.1).toFixed(3)}</label>
                        <input
                          type="range"
                          min="0.01"
                          max="0.5"
                          step="0.01"
                          value={Number(wave.speed || 0.1)}
                          onChange={e => updateWaveLine(idx, 'speed', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Hue: {Math.round(wave.hue || 0)}°</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={wave.hue || 0}
                          onChange={e => updateWaveLine(idx, 'hue', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Color</label>
                        <input
                          type="color"
                          value={wave.color}
                          onChange={e => updateWaveLine(idx, 'color', e.target.value)}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Vertical Position: {Number(wave.verticalPosition?.current || 50).toFixed(0)}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={Number(wave.verticalPosition?.current || 50)}
                          onChange={e => {
                            const newLines = [...config.lines];
                            newLines[idx] = {
                              ...newLines[idx],
                              verticalPosition: {
                                ...wave.verticalPosition,
                                current: Number(e.target.value),
                              },
                            };
                            setConfig(prev => ({ ...prev, lines: newLines }));
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Parallax Index: {wave.parallaxIndex}</label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={wave.parallaxIndex}
                          onChange={e => updateWaveLine(idx, 'parallaxIndex', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Particles Tab */}
          {activeTab === 'particles' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Global Particle Settings</h3>
                <div>
                  <label className="text-xs text-slate-400">Particles Per Line: {config.particlesPerLine}</label>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="10000"
                    value={config.particlesPerLine}
                    onChange={e => updateConfigPath('particlesPerLine', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Particle Size: {(config.particleSize?.default ?? 1.5).toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={config.particleSize.default}
                    onChange={e => updateConfigPath('particleSize.default', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Particle Speed: {(config.particleSpeed?.default ?? 0.25).toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={config.particleSpeed.default}
                    onChange={e => updateConfigPath('particleSpeed.default', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Particle Range: {config.particleRange.default}</label>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={config.particleRange.default}
                    onChange={e => updateConfigPath('particleRange.default', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Glow Probability: {(config.glowProbability * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.glowProbability}
                    onChange={e => updateConfigPath('glowProbability', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Rogue Particles</h3>
                <div>
                  <label className="text-xs text-slate-400">Count: {config.rogueParticles.count}</label>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="10000"
                    value={config.rogueParticles.count}
                    onChange={e => updateConfigPath('rogueParticles.count', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Speed: {(config.rogueParticles?.speed?.default ?? 0.3).toFixed(2)}</label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={config.rogueParticles.speed.default}
                    onChange={e => updateConfigPath('rogueParticles.speed.default', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Color</label>
                  <input
                    type="color"
                    value={config.rogueParticles.color}
                    onChange={e => updateConfigPath('rogueParticles.color', e.target.value)}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Explosion</h3>
                <div>
                  <label className="text-xs text-slate-400">Duration: {config.explosion.duration}ms</label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={config.explosion.duration}
                    onChange={e => updateConfigPath('explosion.duration', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Pop Probability: {(config.explosion.popProbability * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.explosion.popProbability}
                    onChange={e => updateConfigPath('explosion.popProbability', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Gravity Well</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.gravityWell?.enabled || false}
                    onChange={e => updateConfigPath('gravityWell.enabled', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">Enabled</span>
                </label>
                {config.gravityWell?.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">X Position: {config.gravityWell.x}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.gravityWell.x}
                        onChange={e => updateConfigPath('gravityWell.x', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Y Position: {config.gravityWell.y}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={config.gravityWell.y}
                        onChange={e => updateConfigPath('gravityWell.y', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Strength: {(config.gravityWell?.strength ?? 1).toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.gravityWell.strength}
                        onChange={e => updateConfigPath('gravityWell.strength', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Radius: {config.gravityWell.radius}px</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={config.gravityWell.radius}
                        onChange={e => updateConfigPath('gravityWell.radius', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Roaming</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.roaming?.enabled || false}
                    onChange={e => updateConfigPath('roaming.enabled', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-300">Enabled</span>
                </label>
                {config.roaming?.enabled && (
                  <>
                    <div>
                      <label className="text-xs text-slate-400">Speed: {(config.roaming?.speed ?? 0.5).toFixed(2)}</label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.roaming.speed}
                        onChange={e => updateConfigPath('roaming.speed', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Range: {config.roaming.range}px</label>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={config.roaming.range}
                        onChange={e => updateConfigPath('roaming.range', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white/10 rounded-lg p-4 border border-white/20 space-y-3">
                <h3 className="text-sm font-bold text-cyan-400">Parallax</h3>
                <div>
                  <label className="text-xs text-slate-400">Factor: {(config.parallaxFactor ?? 1).toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={config.parallaxFactor}
                    onChange={e => updateConfigPath('parallaxFactor', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Smoothing: {(config.parallaxSmoothing ?? 0.15).toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.parallaxSmoothing}
                    onChange={e => updateConfigPath('parallaxSmoothing', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
