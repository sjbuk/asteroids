import { Ship } from './entities/ship.js';
import { Bullet, BULLET_MAX_ON_SCREEN } from './entities/bullet.js';
import { Asteroid } from './entities/asteroid.js';
import { circlesIntersect } from './engine/collision.js';
import { clearCanvas } from './engine/renderer.js';
import { Hud } from './ui/hud.js';
import { Overlay } from './ui/overlay.js';

const STARTING_LIVES = 3;
const STARTING_ASTEROID_COUNT = 4;
const MAX_ASTEROID_COUNT = 11;
const HIGH_SCORE_KEY = 'asteroids.highScore';

const GameState = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
};

export class Game {
  constructor(canvas, input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.input = input;
    this.hud = new Hud();
    this.overlay = new Overlay();
    this.highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;

    this.state = GameState.READY;
    this.score = 0;
    this.wave = 1;
    this.lives = STARTING_LIVES;
    this.ship = new Ship(this.width / 2, this.height / 2);
    this.bullets = [];
    this.asteroids = [];

    this.overlay.show('Asteroids', 'Press Enter to start');
    this.hud.update({ score: this.score, wave: this.wave, lives: this.lives });
  }

  _asteroidSpeedRange() {
    return [40 + this.wave * 5, 90 + this.wave * 8];
  }

  _spawnWave() {
    const count = Math.min(STARTING_ASTEROID_COUNT + (this.wave - 1), MAX_ASTEROID_COUNT);
    this.asteroids = [];
    for (let i = 0; i < count; i++) {
      this.asteroids.push(
        Asteroid.spawnAtEdge(this.width, this.height, 'LARGE', this._asteroidSpeedRange())
      );
    }
  }

  _startRun() {
    this.score = 0;
    this.wave = 1;
    this.lives = STARTING_LIVES;
    this.bullets = [];
    this.ship.respawn(this.width / 2, this.height / 2);
    this._spawnWave();
    this.state = GameState.PLAYING;
    this.overlay.hide();
  }

  _loseLife() {
    this.lives -= 1;
    if (this.lives <= 0) {
      this.ship.alive = false;
      this.state = GameState.GAME_OVER;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      }
      this.overlay.show(
        'Game Over',
        `Score: ${this.score}  |  Best: ${this.highScore}  —  Press Enter to restart`
      );
    } else {
      this.ship.respawn(this.width / 2, this.height / 2);
    }
  }

  _handleCollisions() {
    for (const bullet of this.bullets) {
      if (!bullet.alive) continue;
      for (const asteroid of this.asteroids) {
        if (!asteroid.alive) continue;
        if (circlesIntersect(bullet, asteroid)) {
          bullet.alive = false;
          asteroid.alive = false;
          this.score += asteroid.scoreValue;
          this.asteroids.push(...asteroid.split(this._asteroidSpeedRange()));
          break;
        }
      }
    }
    this.bullets = this.bullets.filter((b) => b.alive);
    this.asteroids = this.asteroids.filter((a) => a.alive);

    if (this.ship.alive && !this.ship.isInvulnerable) {
      for (const asteroid of this.asteroids) {
        if (circlesIntersect(this.ship, asteroid)) {
          this._loseLife();
          break;
        }
      }
    }
  }

  update(dt) {
    if (this.state !== GameState.PLAYING) {
      if (this.input.isStartJustPressed()) this._startRun();
      this.input.endFrame();
      return;
    }

    this.ship.update(dt, this.input, this.width, this.height);

    if (this.input.isHyperspaceJustPressed()) {
      this.ship.position.x = Math.random() * this.width;
      this.ship.position.y = Math.random() * this.height;
      this.ship.velocity = this.ship.velocity.scale(0.2);
    }

    if (
      this.input.fire &&
      this.ship.canFire() &&
      this.bullets.length < BULLET_MAX_ON_SCREEN
    ) {
      const { position, angle } = this.ship.fire();
      this.bullets.push(new Bullet(position, angle));
    }

    this.bullets.forEach((b) => b.update(dt, this.width, this.height));
    this.asteroids.forEach((a) => a.update(dt, this.width, this.height));

    this._handleCollisions();

    if (this.asteroids.length === 0) {
      this.wave += 1;
      this._spawnWave();
    }

    this.hud.update({ score: this.score, wave: this.wave, lives: this.lives });
    this.input.endFrame();
  }

  render() {
    clearCanvas(this.ctx, this.width, this.height);
    this.asteroids.forEach((a) => a.draw(this.ctx, this.width, this.height));
    this.bullets.forEach((b) => b.draw(this.ctx));
    this.ship.draw(this.ctx, this.width, this.height);
  }
}
