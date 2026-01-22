/**
 * Gravity Well Utility
 * 
 * Provides reusable gravity well physics for particle interactions.
 * Allows particles to be attracted to a target (e.g., logo) with smooth
 * physics-based movement, then continue naturally on their original path.
 */

export interface GravityWellConfig {
  /** Strength of the gravitational pull (0-1) */
  strength: number;
  /** Maximum distance at which particles are affected */
  maxDistance: number;
  /** Damping factor for smooth deceleration (0-1) */
  damping: number;
  /** Random variation in force application (0-1) */
  randomVariation: number;
  /** Whether to apply bounce effect at boundaries */
  bounceAtBounds: boolean;
  /** Bounce damping factor (0-1) */
  bounceDamping: number;
}

export interface GravityWellState {
  /** Current X position of the particle */
  x: number;
  /** Current Y position of the particle */
  y: number;
  /** Velocity in X direction */
  velocityX: number;
  /** Velocity in Y direction */
  velocityY: number;
  /** Whether particle is currently in gravity well */
  isInGravityWell: boolean;
  /** Original progress value before entering gravity well */
  originalProgress?: number;
}

export interface GravityWellBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  centerX: number;
  centerY: number;
}

export interface GravityWellTarget {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Default gravity well configuration
 */
export const DEFAULT_GRAVITY_WELL_CONFIG: GravityWellConfig = {
  strength: 0.15,
  maxDistance: 150,
  damping: 0.92,
  randomVariation: 0.1,
  bounceAtBounds: true,
  bounceDamping: 0.8,
};

/**
 * Initialize gravity well state for a particle
 */
export const initGravityWellState = (): GravityWellState => ({
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  isInGravityWell: false,
  originalProgress: undefined,
});

/**
 * Calculate bounds around a target element
 */
export const calculateGravityWellBounds = (
  target: GravityWellTarget
): GravityWellBounds => {
  const centerX = target.x + target.width / 2;
  const centerY = target.y + target.height / 2;
  
  return {
    minX: target.x,
    maxX: target.x + target.width,
    minY: target.y,
    maxY: target.y + target.height,
    centerX,
    centerY,
  };
};

/**
 * Check if a particle is within gravity well proximity
 */
export const isWithinGravityWellProximity = (
  particleX: number,
  particleY: number,
  target: GravityWellTarget,
  maxDistance: number
): boolean => {
  const bounds = calculateGravityWellBounds(target);
  const dx = particleX - bounds.centerX;
  const dy = particleY - bounds.centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance <= maxDistance;
};

/**
 * Update particle position with gravity well physics
 */
export const updateGravityWell = (
  particleX: number,
  particleY: number,
  target: GravityWellTarget,
  config: GravityWellConfig,
  state: GravityWellState,
  deltaTime: number = 1
): { x: number; y: number; isInGravityWell: boolean } => {
  const bounds = calculateGravityWellBounds(target);
  const dx = bounds.centerX - particleX;
  const dy = bounds.centerY - particleY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  const isInProximity = distance <= config.maxDistance;
  
  if (isInProximity) {
    // Entering gravity well - save original progress if not already saved
    if (!state.isInGravityWell) {
      state.isInGravityWell = true;
      state.originalProgress = particleX; // Store original X position
    }
    
    // Calculate gravitational force
    const normalizedDistance = Math.max(0.1, distance / config.maxDistance);
    const force = (1 - normalizedDistance) * config.strength;
    
    // Add random variation for organic movement
    const randomX = (Math.random() - 0.5) * config.randomVariation;
    const randomY = (Math.random() - 0.5) * config.randomVariation;
    
    // Apply force with damping
    state.velocityX += (dx / distance) * force * deltaTime + randomX;
    state.velocityY += (dy / distance) * force * deltaTime + randomY;
    
    // Apply damping
    state.velocityX *= config.damping;
    state.velocityY *= config.damping;
    
    // Update position
    state.x = particleX + state.velocityX;
    state.y = particleY + state.velocityY;
    
    // Constrain to bounds if enabled
    if (config.bounceAtBounds) {
      const constrained = constrainGravityWellBounds(
        state.x,
        state.y,
        bounds,
        config,
        state
      );
      state.x = constrained.x;
      state.y = constrained.y;
      state.velocityX = constrained.velocityX;
      state.velocityY = constrained.velocityY;
    }
    
    return {
      x: state.x,
      y: state.y,
      isInGravityWell: true,
    };
  } else {
    // Exiting gravity well - restore natural movement
    if (state.isInGravityWell) {
      state.isInGravityWell = false;
      // Don't reset position - let particle continue naturally
      // Clear velocities gradually for smooth transition
      state.velocityX *= 0.9;
      state.velocityY *= 0.9;
    }
    
    return {
      x: particleX,
      y: particleY,
      isInGravityWell: false,
    };
  }
};

/**
 * Constrain particle position within gravity well bounds
 */
export const constrainGravityWellBounds = (
  x: number,
  y: number,
  bounds: GravityWellBounds,
  config: GravityWellConfig,
  state: GravityWellState
): { x: number; y: number; velocityX: number; velocityY: number } => {
  let constrainedX = x;
  let constrainedY = y;
  let velocityX = state.velocityX;
  let velocityY = state.velocityY;
  
  // Check X boundaries
  if (x < bounds.minX) {
    constrainedX = bounds.minX;
    velocityX *= -config.bounceDamping;
  } else if (x > bounds.maxX) {
    constrainedX = bounds.maxX;
    velocityX *= -config.bounceDamping;
  }
  
  // Check Y boundaries
  if (y < bounds.minY) {
    constrainedY = bounds.minY;
    velocityY *= -config.bounceDamping;
  } else if (y > bounds.maxY) {
    constrainedY = bounds.maxY;
    velocityY *= -config.bounceDamping;
  }
  
  return {
    x: constrainedX,
    y: constrainedY,
    velocityX,
    velocityY,
  };
};
