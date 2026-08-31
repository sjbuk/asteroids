const SHIP_ICON_SVG = `
  <svg class="life-icon" viewBox="0 0 16 22" xmlns="http://www.w3.org/2000/svg">
    <polygon points="8,0 15,20 8,15 1,20" fill="none" stroke="#e8f4ff" stroke-width="1.5" />
  </svg>
`;

export class Hud {
  constructor() {
    this.scoreEl = document.getElementById('hud-score');
    this.waveEl = document.getElementById('hud-wave');
    this.livesEl = document.getElementById('hud-lives');
    this._lastLives = -1;
  }

  update({ score, wave, lives }) {
    this.scoreEl.textContent = `SCORE: ${score}`;
    this.waveEl.textContent = `WAVE: ${wave}`;
    if (lives !== this._lastLives) {
      this.livesEl.innerHTML = SHIP_ICON_SVG.repeat(Math.max(0, lives));
      this._lastLives = lives;
    }
  }
}
