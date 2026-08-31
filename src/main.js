import { Game } from './game.js';
import { InputHandler } from './engine/input.js';

const canvas = document.getElementById('game-canvas');
const input = new InputHandler();
const game = new Game(canvas, input);

const MAX_DT = 1 / 20; // clamp to avoid huge jumps after a tab is backgrounded
let lastTime = performance.now();

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;

  game.update(dt);
  game.render();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
