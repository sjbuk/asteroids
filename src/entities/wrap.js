import { Vector2 } from '../engine/vector.js';

/** Wraps a position around the world bounds (toroidal screen wrap). */
export function wrapPosition(position, worldWidth, worldHeight) {
  let { x, y } = position;
  if (x < 0) x += worldWidth;
  else if (x > worldWidth) x -= worldWidth;
  if (y < 0) y += worldHeight;
  else if (y > worldHeight) y -= worldHeight;
  return new Vector2(x, y);
}
