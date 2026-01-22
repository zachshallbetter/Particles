'use client';

import React from "react"

import { useEffect, useRef } from 'react';
import { useParticleSystem } from '@/context/ParticleSystemContext';
import { useTheme } from '@/hooks/useTheme';

interface BackgroundLayer {
  yOffset: number;
  opacity: number;
  speed: number;
  height: number;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { emittedParticlesRef } = useParticleSystem();
  const { isDark } = useTheme();
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Background layers (parallax mountain-like shapes)
    const layers: BackgroundLayer[] = [
      { yOffset: 0.7, opacity: 0.15, speed: 0.02, height: 0.3 },
      { yOffset: 0.65, opacity: 0.12, speed: 0.015, height: 0.25 },
      { yOffset: 0.6, opacity: 0.08, speed: 0.01, height: 0.2 },
    ];

    let time = 0;

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Calculate particle density in different zones
      const particles = emittedParticlesRef.current;
      const zoneCount = 5;
      const zoneDensity = new Array(zoneCount).fill(0);
      
      for (const particle of particles) {
        const zoneIndex = Math.floor((particle.y / height) * zoneCount);
        if (zoneIndex >= 0 && zoneIndex < zoneCount) {
          zoneDensity[zoneIndex]++;
        }
      }

      // Normalize density (0-1 range)
      const maxDensity = Math.max(...zoneDensity, 1);
      const normalizedDensity = zoneDensity.map(d => d / maxDensity);

      // Draw background layers with particle density response
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const baseY = height * layer.yOffset;
        const layerHeight = height * layer.height;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Draw wavy layer line with particle density affecting amplitude
        const points = 50;
        for (let j = 0; j <= points; j++) {
          const x = (width / points) * j;
          const progress = j / points;
          
          // Get density for this x position
          const zoneIndex = Math.floor(progress * zoneCount);
          const density = normalizedDensity[zoneIndex] || 0;
          
          // Amplitude increases with particle density
          const baseAmplitude = 20 + i * 10;
          const densityBoost = density * 30;
          const amplitude = baseAmplitude + densityBoost;
          
          const frequency = 0.02 - i * 0.005;
          const offset = time * layer.speed;
          const y = baseY + Math.sin(x * frequency + offset) * amplitude;
          
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Fill with gradient (darker at bottom)
        const gradient = ctx.createLinearGradient(0, baseY - layerHeight, 0, height);
        const color = isDark ? '20, 20, 40' : '200, 200, 220';
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color}, ${layer.opacity})`);
        gradient.addColorStop(1, `rgba(${color}, ${layer.opacity * 1.5})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.restore();
      }

      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [emittedParticlesRef, isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setAttribute('data-component', 'ParticleBackground');
      console.log('[CANVAS] ParticleBackground canvas created', {
        width: canvas.width,
        height: canvas.height,
        styleWidth: canvas.style.width,
        styleHeight: canvas.style.height,
        zIndex: 0
      });
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      data-component="ParticleBackground"
    />
  );
};
