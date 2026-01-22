import type { EmittedParticle } from '@/context/ParticleSystemContext';
import type { VisualEffectsConfig } from '@/config/visual-effects.config';

/**
 * Draw elegant particle trails using linear gradients
 * Creates a comet-tail effect that varies in length and opacity based on velocity
 */
export function drawParticleTrails(
  ctx: CanvasRenderingContext2D,
  particles: EmittedParticle[],
  trailStore: Map<string, Array<{x: number; y: number; time: number}>>,
  config: VisualEffectsConfig
) {
  if (!config.particleTrails.enabled || config.particleTrails.maxTrailLength === 0) return;

  const now = Date.now();
  const fadeWindow = 600; // Time in ms for trail to completely fade

  for (const particle of particles) {
    if (!trailStore.has(particle.id)) {
      trailStore.set(particle.id, []);
    }

    const trail = trailStore.get(particle.id)!;
    trail.push({ x: particle.x, y: particle.y, time: now });

    // Keep only recent trail points
    while (trail.length > config.particleTrails.maxTrailLength) {
      trail.shift();
    }

    // Draw single elegant linear gradient tail
    if (trail.length > 2) {
      // Calculate velocity for dynamic tail length
      const vx = particle.vx || 0;
      const vy = particle.vy || 0;
      const velocity = Math.sqrt(vx * vx + vy * vy);
      const tailLength = Math.min(40 + velocity * 15, 100); // Longer tail for faster particles

      // Get tail start position (oldest point in trail)
      const tailStart = trail[0];
      const tailEnd = { x: particle.x, y: particle.y };

      // Calculate direction from tail to particle
      const dx = tailEnd.x - tailStart.x;
      const dy = tailEnd.y - tailStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0.1) {
        // Normalize direction and extend tail
        const nx = dx / distance;
        const ny = dy / distance;
        const extendedTailStart = {
          x: tailEnd.x - nx * tailLength,
          y: tailEnd.y - ny * tailLength
        };

        // Create linear gradient from transparent to bright
        const gradient = ctx.createLinearGradient(
          extendedTailStart.x,
          extendedTailStart.y,
          tailEnd.x,
          tailEnd.y
        );

        // Gradient fades from transparent to bright
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 50%, 0)`);
        gradient.addColorStop(0.3, `hsla(${particle.hue}, 85%, 55%, ${config.particleTrails.glowIntensity * 0.3})`);
        gradient.addColorStop(0.7, `hsla(${particle.hue}, 90%, 60%, ${config.particleTrails.glowIntensity * 0.7})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 95%, 65%, ${config.particleTrails.glowIntensity})`);

        // Draw gradient tail as filled shape for smooth appearance
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = gradient;

        // Create tapered tail shape (wider at particle, narrower at tip)
        const tailWidth = particle.size * 1.2;
        const perpX = -ny;
        const perpY = nx;

        ctx.beginPath();
        ctx.moveTo(tailEnd.x + perpX * tailWidth, tailEnd.y + perpY * tailWidth);
        ctx.lineTo(tailEnd.x - perpX * tailWidth, tailEnd.y - perpY * tailWidth);
        ctx.lineTo(extendedTailStart.x - perpX * tailWidth * 0.3, extendedTailStart.y - perpY * tailWidth * 0.3);
        ctx.lineTo(extendedTailStart.x + perpX * tailWidth * 0.3, extendedTailStart.y + perpY * tailWidth * 0.3);
        ctx.closePath();
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  // Cleanup old trails
  for (const [id, trail] of trailStore.entries()) {
    if (trail.length > 0 && now - trail[trail.length - 1].time > fadeWindow * 1.5) {
      trailStore.delete(id);
    }
  }
}

/**
 * Draw atmosphere effects (fog, vignette, bokeh)
 */
export function drawAtmosphericDepth(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: VisualEffectsConfig
) {
  if (!config.atmosphericDepth.enabled) return;

  // Vignette effect
  if (config.atmosphericDepth.vignetteStrength > 0) {
    const gradient = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.3,
      canvasWidth / 2, canvasHeight / 2, canvasWidth * 0.8
    );
    const vignetteOpacity = config.atmosphericDepth.vignetteStrength * config.overallIntensity;
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteOpacity})`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Fog layer
  if (config.atmosphericDepth.fogIntensity > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${config.atmosphericDepth.fogIntensity * 0.1})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

/**
 * Draw constellation patterns between clustered particles
 */
export function drawConstellationPatterns(
  ctx: CanvasRenderingContext2D,
  particles: EmittedParticle[],
  config: VisualEffectsConfig
) {
  if (!config.constellationPatterns.enabled || particles.length < config.constellationPatterns.minClusterSize) return;

  ctx.globalCompositeOperation = 'lighter';

  // Find clusters by color
  const colorMap = new Map<number, EmittedParticle[]>();
  for (const particle of particles) {
    const hue = Math.round(particle.hue / 10) * 10; // Group similar hues
    if (!colorMap.has(hue)) colorMap.set(hue, []);
    colorMap.get(hue)!.push(particle);
  }

  // Draw constellations for clusters
  for (const [hue, cluster] of colorMap.entries()) {
    if (cluster.length < config.constellationPatterns.minClusterSize) continue;

    // Draw connecting lines
    for (let i = 0; i < cluster.length; i++) {
      for (let j = i + 1; j < cluster.length; j++) {
        const p1 = cluster[i];
        const p2 = cluster[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.constellationPatterns.connectionDistance) {
          const lineOpacity = (1 - distance / config.constellationPatterns.connectionDistance) * 
                            config.constellationPatterns.lineOpacity;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${lineOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw node points
    for (const particle of cluster) {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, config.constellationPatterns.nodeSize, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue}, 80%, 70%, 0.6)`;
      ctx.fill();
    }
  }

  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Generate procedural Perlin-like noise for nebula clouds
 * Simple implementation using sine waves for smooth, organic shapes
 */
function generateNebulaValue(x: number, y: number, time: number, seed: number): number {
  const scale = 0.003;
  const speedFactor = time * 0.0002;
  
  // Layered sine waves for organic movement
  const layer1 = Math.sin((x * scale + speedFactor) * seed) * Math.cos(y * scale);
  const layer2 = Math.sin((y * scale - speedFactor) * seed * 0.7) * Math.cos(x * scale * 0.8);
  const layer3 = Math.sin(((x + y) * scale * 0.5 + speedFactor) * seed * 0.3);
  
  return (layer1 + layer2 * 0.7 + layer3 * 0.5) / 2.2;
}

/**
 * Draw nebula background with dynamic purple clouds that warp and move
 * Uses procedural generation for organic, ever-changing shapes
 */
export function drawNebulaBackground(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  time: number,
  config: VisualEffectsConfig
) {
  if (!config.nebulaBackground.enabled) return;

  ctx.globalCompositeOperation = 'darker';
  
  // Draw multiple nebula cloud layers with smooth interpolation
  for (let layer = 0; layer < config.nebulaBackground.gradientLayers; layer++) {
    const layerSeed = layer + 1;
    const layerOpacity = (0.12 * config.overallIntensity) / (layer + 1);
    
    // Use smaller chunks for smoother appearance (no pixelation)
    const chunkSize = 20; // Reduced from 40 for smoother gradients
    for (let x = 0; x < canvasWidth; x += chunkSize) {
      for (let y = 0; y < canvasHeight; y += chunkSize) {
        // Sample 4 corners for smooth bilinear interpolation
        const c00 = generateNebulaValue(x, y, time, layerSeed);
        const c10 = generateNebulaValue(x + chunkSize, y, time, layerSeed);
        const c01 = generateNebulaValue(x, y + chunkSize, time, layerSeed);
        const c11 = generateNebulaValue(x + chunkSize, y + chunkSize, time, layerSeed);
        
        // Average the 4 corners for smooth interpolation
        const avgValue = (c00 + c10 + c01 + c11) / 4;
        const smoothValue = Math.max(0, Math.min(1, avgValue * 1.3));
        
        if (smoothValue > 0.25) {
          // Purple nebula with dynamic color variation
          const purpleHue = 265 + Math.sin(layer * 0.5 + avgValue * 8) * 25;
          const saturation = 55 + layer * 12;
          const lightness = 20 + smoothValue * 25;
          
          // Apply smooth gradient across chunk instead of flat color
          const gradient = ctx.createLinearGradient(x, y, x + chunkSize, y + chunkSize);
          gradient.addColorStop(0, `hsla(${purpleHue}, ${saturation}%, ${lightness}%, ${smoothValue * layerOpacity * 0.8})`);
          gradient.addColorStop(0.5, `hsla(${purpleHue + 10}, ${saturation - 5}%, ${lightness + 3}%, ${smoothValue * layerOpacity})`);
          gradient.addColorStop(1, `hsla(${purpleHue - 10}, ${saturation + 5}%, ${lightness - 2}%, ${smoothValue * layerOpacity * 0.8})`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, chunkSize, chunkSize);
        }
      }
    }
  }
  
  ctx.globalCompositeOperation = 'source-over';

  // Draw star field (optional subtle stars)
  if (config.nebulaBackground.starField) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    
    // Generate deterministic pseudo-random stars using simple hash
    for (let i = 0; i < Math.min(config.nebulaBackground.starCount || 50, 200); i++) {
      const hash1 = Math.sin(i * 12.9898) * 43758.5453;
      const hash2 = Math.sin(i * 78.233) * 43758.5453;
      
      const x = ((hash1 - Math.floor(hash1)) * canvasWidth) % canvasWidth;
      const y = ((hash2 - Math.floor(hash2)) * canvasHeight) % canvasHeight;
      const size = 0.5 + (Math.sin(i * 45.164) * 0.5 + 0.5) * 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Draw grid or field visualization overlay
 */
export function drawGridFieldVisualization(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: VisualEffectsConfig
) {
  if (!config.gridFieldVisualization.enabled) return;

  ctx.save();
  ctx.globalAlpha = config.gridFieldVisualization.gridOpacity;
  ctx.strokeStyle = config.gridFieldVisualization.cellColor;
  ctx.lineWidth = 0.5;

  if (config.gridFieldVisualization.gridType === 'hexagonal') {
    const hexSize = 40;
    const sqrt3 = Math.sqrt(3);

    for (let row = 0; row < Math.ceil(canvasHeight / (hexSize * 1.5)); row++) {
      for (let col = 0; col < Math.ceil(canvasWidth / (hexSize * sqrt3)); col++) {
        const x = col * hexSize * sqrt3 + (row % 2 ? (hexSize * sqrt3) / 2 : 0);
        const y = row * hexSize * 1.5;

        drawHexagon(ctx, x, y, hexSize);
      }
    }
  } else if (config.gridFieldVisualization.gridType === 'square') {
    const gridSize = 50;
    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Helper to draw a hexagon
 */
function drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.stroke();
}

/**
 * Draw bloom/glare effect
 */
export function drawBloomGlare(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: VisualEffectsConfig
) {
  if (!config.bloomGlare.enabled) return;

  // HDR Bloom effect - create a subtle glow
  if (config.bloomGlare.hdrBloom) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = config.bloomGlare.bloomIntensity * 0.1;

    const bloomGradient = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,
      canvasWidth / 2, canvasHeight / 2, config.bloomGlare.bloomRadius * 10
    );
    bloomGradient.addColorStop(0, 'rgba(255, 200, 150, 0.3)');
    bloomGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = bloomGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
  }
}

/**
 * Apply overall visual effects intensity
 */
export function applyVisualEffectsIntensity(
  ctx: CanvasRenderingContext2D,
  intensity: number
) {
  if (intensity !== 1.0) {
    ctx.globalAlpha *= intensity;
  }
}
