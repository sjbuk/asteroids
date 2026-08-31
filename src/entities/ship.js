import { Vector2 } from '../engine/vector.js';
import { strokePolygon, drawWithScreenWrap } from '../engine/renderer.js';
import { wrapPosition } from './wrap.js';

const ROTATION_SPEED = Math.PI * 1.8; // rad/s
const THRUST_ACCEL = 260; // px/s^2
const DRAG = 0.6; // fraction of velocity retained per second (exponential decay)
const MAX_SPEED = 420; // px/s
const RADIUS = 12;
const FIRE_COOLDOWN = 0.28; // seconds between shots
const INVULNERABILITY_DURATION = 2; // seconds
const FLASH_INTERVAL = 0.12; // seconds, for the respawn flicker

export class Ship {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.angle = -Math.PI / 2; // pointing "up" initially
    this.radius = RADIUS;
    this.thrusting = false;
    this.fireCooldownRemaining = 0;
    this.invulnerableRemaining = 0;
    this.alive = true;
  }

  get isInvulnerable() {
    return this.invulnerableRemaining > 0;
  }

  respawn(x, y) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(0, 0);
    this.angle = -Math.PI / 2;
    this.alive = true;
    this.invulnerableRemaining = INVULNERABILITY_DURATION;
  }

  update(dt, input, worldWidth, worldHeight) {
    if (input.rotateLeft) this.angle -= ROTATION_SPEED * dt;
    if (input.rotateRight) this.angle += ROTATION_SPEED * dt;

    this.thrusting = input.thrust;
    if (this.thrusting) {
      const accel = Vector2.fromAngle(this.angle, THRUST_ACCEL * dt);
      this.velocity = this.velocity.add(accel);
      const speed = this.velocity.length();
      if (speed > MAX_SPEED) {
        this.velocity = this.velocity.normalize().scale(MAX_SPEED);
      }
    }

    // Exponential drag so the ship drifts and decelerates gradually,
    // never an instant stop — this is the signature Asteroids feel.
    const dragFactor = Math.pow(DRAG, dt);
    this.velocity = this.velocity.scale(dragFactor);

    this.position = this.position.add(this.velocity.scale(dt));
    this.position = wrapPosition(this.position, worldWidth, worldHeight);

    if (this.fireCooldownRemaining > 0) {
      this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - dt);
    }
    if (this.invulnerableRemaining > 0) {
      this.invulnerableRemaining = Math.max(0, this.invulnerableRemaining - dt);
    }
  }

  canFire() {
    return this.fireCooldownRemaining <= 0;
  }

  /** Returns the nose position and facing angle to spawn a bullet from, and starts the cooldown. */
  fire() {
    this.fireCooldownRemaining = FIRE_COOLDOWN;
    const nose = this.position.add(Vector2.fromAngle(this.angle, this.radius));
    return { position: nose, angle: this.angle };
  }

  _shapePoints() {
    const noseLen = this.radius * 1.3;
    const backLen = this.radius * 0.9;
    const nose = Vector2.fromAngle(this.angle, noseLen);
    const leftWing = Vector2.fromAngle(this.angle + Math.PI - 0.5, backLen);
    const rightWing = Vector2.fromAngle(this.angle + Math.PI + 0.5, backLen);
    const tailNotch = Vector2.fromAngle(this.angle + Math.PI, backLen * 0.5);
    return [nose, leftWing, tailNotch, rightWing];
  }

  draw(ctx, worldWidth, worldHeight) {
    if (!this.alive) return;

    if (this.isInvulnerable) {
      const flickerOn = Math.floor(this.invulnerableRemaining / FLASH_INTERVAL) % 2 === 0;
      if (!flickerOn) return;
    }

    const points = this._shapePoints();
    drawWithScreenWrap(ctx, this.position, this.radius, worldWidth, worldHeight, () => {
      strokePolygon(ctx, points, { color: '#e8f4ff', lineWidth: 2 });

      if (this.thrusting) {
        const flameTip = Vector2.fromAngle(this.angle + Math.PI, this.radius * 1.8);
        const flameLeft = Vector2.fromAngle(this.angle + Math.PI - 0.3, this.radius * 0.6);
        const flameRight = Vector2.fromAngle(this.angle + Math.PI + 0.3, this.radius * 0.6);
        strokePolygon(ctx, [flameLeft, flameTip, flameRight], { color: '#ff9d3f', lineWidth: 1.5 });
      }
    });
  }
}
