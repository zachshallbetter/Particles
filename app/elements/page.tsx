'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WaveParticles } from '@/components/WaveParticles';
import { ParticleBackground } from '@/components/ParticleBackground';
import { FPSMonitor } from '@/components/FPSMonitor';
import { ParticleSystemProvider } from '@/context/ParticleSystemContext';
import { useParticleSystem } from '@/context/ParticleSystemContext'; // Import useParticleSystem

/**
 * Element Types that interact with the particle system
 */
type ElementType = 'attractor' | 'repeller' | 'well' | 'damper';

interface DOMElement {
  id: string;
  type: ElementType;
  ref: React.RefObject<HTMLDivElement>;
  hue: number;
  fixedLeft: number;
  fixedTop: number;
}

function ElementsPageContent() {
  const [elements, setElements] = useState<DOMElement[]>([]);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());
  const [domGravityWells, setDomGravityWells] = useState<
    Array<{ x: number; y: number; width: number; height: number; mass: number; strength: number; type: string }>
  >([]);
  const emissionIntervalsRef = useRef<Set<number>>(new Set()); // Declare emissionIntervalsRef

  // Update element positions for gravity well calculations (matching root page pattern)
  useEffect(() => {
    const updateElementPositions = () => {
      const newWells = elements
        .map((elem) => {
          const ref = elementRefs.current.get(elem.id);
          if (!ref || !ref.current) return null;

          const rect = ref.current.getBoundingClientRect();
          
          // Gravity parameters based on element type
          let mass = 1;
          let strength = 0;
          
          switch (elem.type) {
            case 'attractor':
              mass = 2;
              strength = 0.08;
              break;
            case 'well':
              mass = 2.5;
              strength = 0.12;
              break;
            case 'repeller':
              mass = 1.5;
              strength = -0.1;
              break;
            case 'damper':
              mass = 1.2;
              strength = 0.06;
              break;
            default:
              mass = 1;
              strength = 0;
          }

          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
            mass,
            strength,
            type: elem.type,
          };
        })
        .filter(Boolean) as typeof domGravityWells;

      setDomGravityWells(newWells);
    };

    window.addEventListener('scroll', updateElementPositions, { passive: true });
    window.addEventListener('resize', updateElementPositions, { passive: true });
    const interval = setInterval(updateElementPositions, 50);

    return () => {
      window.removeEventListener('scroll', updateElementPositions);
      window.removeEventListener('resize', updateElementPositions);
      clearInterval(interval);
    };
  }, [elements]);

  const createElement = useCallback((type: ElementType) => {
    const id = `elem-${Date.now()}-${Math.random()}`;
    const ref = React.createRef<HTMLDivElement>();
    elementRefs.current.set(id, ref);

    const elementConfig: DOMElement = {
      id,
      type,
      ref,
      hue: Math.random() * 360,
      fixedLeft: Math.random() * 75 + 10,
      fixedTop: Math.random() * 70 + 10,
    };

    setElements((prev) => [...prev, elementConfig]);
  }, []);

  const ElementButton = ({ type, label, hue }: { type: ElementType; label: string; hue: number }) => (
    <button
      onClick={() => createElement(type)}
      className="w-full px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 text-white border border-transparent hover:border-cyan-400/40 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
      style={{
        background: `hsl(${hue}, 70%, 48%)`,
        boxShadow: `0 0 25px hsla(${hue}, 70%, 48%, 0.3)`,
        color: 'white',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 35px hsla(${hue}, 70%, 48%, 0.6), 0 0 15px hsla(${hue}, 70%, 48%, 0.3)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 25px hsla(${hue}, 70%, 48%, 0.3)`;
      }}
    >
      {label}
    </button>
  );

  const DOMElementVisual = ({ elem }: { elem: DOMElement }) => {
    const getColor = () => {
      switch (elem.type) {
        case 'attractor':
          return `hsl(${elem.hue}, 70%, 50%)`;
        case 'well':
          return `hsl(${elem.hue}, 60%, 45%)`;
        case 'repeller':
          return `hsl(${elem.hue}, 70%, 55%)`;
        case 'damper':
          return `hsl(${elem.hue}, 50%, 40%)`;
        default:
          return `hsl(${elem.hue}, 65%, 45%)`;
      }
    };

    const getIcon = () => {
      switch (elem.type) {
        case 'attractor':
          return '●';
        case 'well':
          return '◉';
        case 'repeller':
          return '⊖';
        case 'damper':
          return '≈';
        default:
          return '○';
      }
    };

    return (
      <div
        ref={elem.ref}
        className="fixed w-16 h-16 rounded-lg flex items-center justify-center text-xl font-bold cursor-move"
        style={{
          background: getColor(),
          boxShadow: `0 0 25px hsla(${elem.hue}, 70%, 50%, 0.7), inset 0 0 15px hsla(${elem.hue}, 70%, 30%, 0.4)`,
          color: 'white',
          left: `${elem.fixedLeft}%`,
          top: `${elem.fixedTop}%`,
          zIndex: draggedElementId === elem.id ? 50 : 15,
          transform: draggedElementId === elem.id ? 'scale(1.15)' : 'scale(1)',
          transition: draggedElementId === elem.id ? 'none' : 'transform 0.2s ease-out',
        }}
        onMouseDown={(e) => {
          const rect = elem.ref.current?.getBoundingClientRect();
          if (rect) {
            setDragOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
            setDraggedElementId(elem.id);
          }
        }}
      >
        {getIcon()}
      </div>
    );
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedElementId === null) return;

      const elem = elements.find((el) => el.id === draggedElementId);
      if (!elem) return;

      // Convert mouse position to percentage relative to viewport
      const newLeft = (e.clientX / window.innerWidth) * 100;
      const newTop = (e.clientY / window.innerHeight) * 100;

      // Clamp to viewport (element size is approximately 4% of width and 6% of height)
      const clampedLeft = Math.max(0, Math.min(96, newLeft - 2));
      const clampedTop = Math.max(0, Math.min(94, newTop - 3));

      setElements((prev) =>
        prev.map((e) =>
          e.id === draggedElementId ? { ...e, fixedLeft: clampedLeft, fixedTop: clampedTop } : e
        )
      );
    };

    const handleMouseUp = () => {
      setDraggedElementId(null);
    };

    if (draggedElementId !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedElementId, elements]);

  return (
    <div className="w-full min-h-screen bg-black relative overflow-hidden">
      {/* Parallax Background Layers - matching root page */}
      <ParticleBackground />
      
      {/* Wave and Particle Animation Background - exact same as root, but with domGravityWells */}
      <WaveParticles 
        showWaves={true}
        showParticles={false}
        showRogueParticles={true}
        domGravityWells={domGravityWells}
      />

      {/* FPS Monitor */}
      <FPSMonitor isDark={true} />

      {/* Fixed Control Panel */}
      <div className="fixed top-8 left-8 z-20 backdrop-blur-md bg-black/70 border border-cyan-500/30 rounded-xl p-8 max-w-sm shadow-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Interactive Elements</h1>
            <p className="text-cyan-400/70 text-sm font-light">Drag elements to interact with particles</p>
          </div>

          <div className="space-y-2.5">
            <ElementButton type="attractor" label="+ Attractor" hue={240} />
            <ElementButton type="well" label="+ Gravity Well" hue={180} />
            <ElementButton type="repeller" label="+ Repeller" hue={30} />
            <ElementButton type="damper" label="+ Damper" hue={60} />
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-sm font-medium">Active Elements</span>
              <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-300 text-xs font-semibold">
                {elements.length}
              </span>
            </div>
            <button
              onClick={() => {
                setElements([]);
                elementRefs.current.clear();
              }}
              className="w-full px-4 py-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-slate-600/30"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      <div className="fixed bottom-8 left-8 z-20 backdrop-blur-md bg-black/70 border border-cyan-500/30 rounded-xl p-6 max-w-xs shadow-2xl">
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest text-cyan-400">Element Types</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3 items-start">
            <span className="text-cyan-400 font-bold text-lg min-w-fit">●</span>
            <div>
              <p className="text-slate-300 font-medium">Attractor</p>
              <p className="text-slate-500 text-xs">Mild gravitational pull</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-teal-400 font-bold text-lg min-w-fit">◉</span>
            <div>
              <p className="text-slate-300 font-medium">Gravity Well</p>
              <p className="text-slate-500 text-xs">Strong gravitational force</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-orange-400 font-bold text-lg min-w-fit">⊖</span>
            <div>
              <p className="text-slate-300 font-medium">Repeller</p>
              <p className="text-slate-500 text-xs">Repels nearby particles</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-lime-400 font-bold text-lg min-w-fit">≈</span>
            <div>
              <p className="text-slate-300 font-medium">Damper</p>
              <p className="text-slate-500 text-xs">Reduces particle energy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rendered Interactive Elements */}
      {elements.map((elem) => (
        <DOMElementVisual key={elem.id} elem={elem} />
      ))}

      {/* Navigation Link */}
      <div className="fixed bottom-8 right-8 z-10">
        <a
          href="/"
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-xl inline-flex items-center gap-2 border border-cyan-500/40"
        >
          ← Back
        </a>
      </div>
    </div>
  );
}

export default function ElementsPage() {
  return (
    <ParticleSystemProvider>
      <ElementsPageContent />
    </ParticleSystemProvider>
  );
}
