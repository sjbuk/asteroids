import { Vector2 } from '../engine/vector.js';
import { drawCircle } from '../engine/renderer.js';
import { wrapPosition } from './wrap.js';

const SPEED = 520; // px/s
const LIFESPAN = 1.0; // seconds
const RADIUS = 2;

export class Bullet {
  constructor(position, angle) {
    this.position = position.clone();
    this.velocity = Vector2.fromAngle(angle, SPEED);
    this.radius = RADIUS;
    this.age = 0;
    this.alive = true;
  }

  update(dt, worldWidth, worldHeight) {
    this.position = this.position.add(this.velocity.scale(dt));
    // Bullets wrap with the rest of the world rather than despawning at the
    // edge — keeps shots at extreme angles from feeling wasted near a wall.
    this.position = wrapPosition(this.position, worldWidth, worldHeight);
    this.age += dt;
    if (this.age >= LIFESPAN) {
      this.alive = false;
    }
  }

  draw(ctx) {
    drawCircle(ctx, this.position.x, this.position.y, this.radius, { color: '#fff', fill: true });
  }
}

export const BULLET_MAX_ON_SCREEN = 4;
