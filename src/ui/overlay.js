export class Overlay {
  constructor() {
    this.root = document.getElementById('overlay');
    this.titleEl = document.getElementById('overlay-title');
    this.messageEl = document.getElementById('overlay-message');
  }

  show(title, message) {
    this.titleEl.textContent = title;
    this.messageEl.textContent = message;
    this.root.classList.remove('hidden');
  }

  hide() {
    this.root.classList.add('hidden');
  }
}
