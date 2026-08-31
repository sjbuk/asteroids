import { Vector2 } from '../engine/vector.js';
import { strokePolygon, drawWithScreenWrap } from '../engine/renderer.js';
import { wrapPosition } from './wrap.js';

export const ASTEROID_SIZES = {
  LARGE: { radius: 40, score: 20, next: 'MEDIUM' },
  MEDIUM: { radius: 22, score: 50, next: 'SMALL' },
  SMALL: { radius: 12, score: 100, next: null }
};

const VERTEX_COUNT = 10;
const JAGGEDNESS = 0.35; // how far vertices deviate from a perfect circle, as a fraction of radius

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function generateShape(radius) {
  const points = [];
  for (let i = 0; i < VERTEX_COUNT; i++) {
    const angle = (i / VERTEX_COUNT) * Math.PI * 2;
    const r = radius * (1 - JAGGEDNESS / 2 + Math.random() * JAGGEDNESS);
    points.push(Vector2.fromAngle(angle, r));
  }
  return points;
}

export class Asteroid {
  constructor(position, velocity, sizeKey) {
    this.position = position;
    this.velocity = velocity;
    this.sizeKey = sizeKey;
    this.radius = ASTEROID_SIZES[sizeKey].radius;
    this.rotation = 0;
    this.rotationSpeed = randomRange(-1, 1);
    this.shape = generateShape(this.radius);
    this.alive = true;
  }

  get scoreValue() {
    return ASTEROID_SIZES[this.sizeKey].score;
  }

  /** Spawns an asteroid at a random point along the world's edge, drifting inward-ish. */
  static spawnAtEdge(worldWidth, worldHeight, sizeKey, speedRange) {
    const edge = Math.floor(randomRange(0, 4));
    let x, y;
    switch (edge) {
      case 0: // top
        x = randomRange(0, worldWidth);
        y = -ASTEROID_SIZES[sizeKey].radius;
        break;
      case 1: // right
        x = worldWidth + ASTEROID_SIZES[sizeKey].radius;
        y = randomRange(0, worldHeight);
        break;
      case 2: // bottom
        x = randomRange(0, worldWidth);
        y = worldHeight + ASTEROID_SIZES[sizeKey].radius;
        break;
      default: // left
        x = -ASTEROID_SIZES[sizeKey].radius;
        y = randomRange(0, worldHeight);
    }

    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(speedRange[0], speedRange[1]);
    const velocity = Vector2.fromAngle(angle, speed);
    return new Asteroid(new Vector2(x, y), velocity, sizeKey);
  }

  /** Splits into two smaller asteroids, or [] if this was already SMALL. */
  split(speedRange) {
    const nextSize = ASTEROID_SIZES[this.sizeKey].next;
    if (!nextSize) return [];

    const children = [];
    for (let i = 0; i < 2; i++) {
      const angle = randomRange(0, Math.PI * 2);
      const speed = randomRange(speedRange[0], speedRange[1]);
      const velocity = Vector2.fromAngle(angle, speed);
      children.push(new Asteroid(this.position.clone(), velocity, nextSize));
    }
    return children;
  }

  update(dt, worldWidth, worldHeight) {
    this.position = this.position.add(this.velocity.scale(dt));
    this.position = wrapPosition(this.position, worldWidth, worldHeight);
    this.rotation += this.rotationSpeed * dt;
  }

  draw(ctx, worldWidth, worldHeight) {
    drawWithScreenWrap(ctx, this.position, this.radius, worldWidth, worldHeight, () => {
      ctx.save();
      ctx.rotate(this.rotation);
      strokePolygon(ctx, this.shape, { color: '#b7c4d1', lineWidth: 1.5 });
      ctx.restore();
    });
  }
}
