const KEY_BINDINGS = {
  rotateLeft: ['ArrowLeft', 'KeyA'],
  rotateRight: ['ArrowRight', 'KeyD'],
  thrust: ['ArrowUp', 'KeyW'],
  fire: ['Space'],
  hyperspace: ['ShiftLeft', 'ShiftRight'],
  start: ['Enter']
};

export class InputHandler {
  constructor(target = window) {
    this.keysDown = new Set();
    this.justPressed = new Set();

    this._onKeyDown = (e) => {
      if (!this.keysDown.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keysDown.add(e.code);
      if (this._shouldPreventDefault(e.code)) e.preventDefault();
    };
    this._onKeyUp = (e) => {
      this.keysDown.delete(e.code);
    };

    target.addEventListener('keydown', this._onKeyDown);
    target.addEventListener('keyup', this._onKeyUp);
  }

  _shouldPreventDefault(code) {
    return Object.values(KEY_BINDINGS).some((codes) => codes.includes(code));
  }

  _isActionDown(action) {
    return KEY_BINDINGS[action].some((code) => this.keysDown.has(code));
  }

  _isActionJustPressed(action) {
    return KEY_BINDINGS[action].some((code) => this.justPressed.has(code));
  }

  get rotateLeft() {
    return this._isActionDown('rotateLeft');
  }

  get rotateRight() {
    return this._isActionDown('rotateRight');
  }

  get thrust() {
    return this._isActionDown('thrust');
  }

  get fire() {
    return this._isActionDown('fire');
  }

  isFireJustPressed() {
    return this._isActionJustPressed('fire');
  }

  isHyperspaceJustPressed() {
    return this._isActionJustPressed('hyperspace');
  }

  isStartJustPressed() {
    return this._isActionJustPressed('start');
  }

  /** Call once per frame after all logic has read this frame's input. */
  endFrame() {
    this.justPressed.clear();
  }

  destroy(target = window) {
    target.removeEventListener('keydown', this._onKeyDown);
    target.removeEventListener('keyup', this._onKeyUp);
  }
}
