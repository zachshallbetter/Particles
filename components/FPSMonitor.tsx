"use client";

import { useEffect, useRef, useState } from 'react';

interface FPSMonitorProps {
  isDark?: boolean;
}

export function FPSMonitor({ isDark = true }: FPSMonitorProps) {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    const updateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;

      // Update FPS every 500ms for smoother display
      if (elapsed >= 500) {
        const currentFps = Math.round((frameCountRef.current / elapsed) * 1000);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationIdRef.current = requestAnimationFrame(updateFPS);
    };

    animationIdRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Color based on FPS performance
  const getFpsColor = () => {
    if (fps >= 55) return isDark ? 'text-green-400' : 'text-green-600';
    if (fps >= 30) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 px-3 py-1.5 rounded-md font-mono text-sm z-50 ${
        isDark ? 'bg-black/50' : 'bg-white/50'
      } backdrop-blur-sm border ${
        isDark ? 'border-white/10' : 'border-black/10'
      }`}
    >
      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>FPS: </span>
      <span className={`font-semibold ${getFpsColor()}`}>{fps}</span>
    </div>
  );
}
