# Asteroids

A browser-based remake of the classic *Asteroids* arcade game, built with vanilla HTML5 Canvas, CSS, and JavaScript (ES modules, no game framework).

## Setup

```bash
npm install
npm run dev
```

Open the forwarded port (5173) — in a Codespace it opens automatically in the browser preview.

Other scripts:

```bash
npm run build    # production build to /dist
npm run preview  # serve the production build locally
```

## Controls

| Action          | Keys              |
|-----------------|-------------------|
| Rotate          | ←/→ or A/D        |
| Thrust          | ↑ or W            |
| Fire            | Space             |
| Hyperspace jump | Shift             |
| Start / Restart | Enter             |

## Architecture

```
/src
  main.js            # requestAnimationFrame loop, computes delta-time, ticks Game
  game.js             # game state machine (READY/PLAYING/GAME_OVER), wave spawning,
                       # collision resolution, scoring, lives, orchestrates update/render
  entities/
    ship.js           # rotation, thrust + drag physics, firing, wrap, respawn invulnerability
    bullet.js          # straight-line travel, lifespan, wrap
    asteroid.js         # spawn-at-edge, jagged procedural shape, splitting by size
    wrap.js             # shared screen-wrap helper for position
  engine/
    vector.js          # minimal 2D vector math (add/sub/scale/normalize/fromAngle)
    collision.js         # circle (bounding-radius) intersection test
    input.js             # keyboard state, tracks held vs. just-pressed per action
    renderer.js           # canvas draw primitives, incl. drawing "ghost" copies at
                           # screen edges so wrapping entities don't visibly pop
  ui/
    hud.js              # score / wave / lives, driven by plain DOM elements over the canvas
    overlay.js            # start / game-over overlay
```

The game loop each frame: handle input → update ship/bullets/asteroids → resolve
collisions → check wave/life/game-over conditions → render.

### Design decisions

- **Ship physics**: thrust applies acceleration in the facing direction; velocity
  decays each frame by an exponential drag factor rather than being reset, so the
  ship always drifts and coasts — no instant stops.
- **Collision detection**: circle-based (bounding radius) only, per spec — simple
  and fast, appropriate for this genre.
- **Bullets wrap** around the screen edges like every other entity (rather than
  despawning at the edge) and still expire after a fixed lifespan (~1s) or once
  4 are on screen, whichever comes first.
- **Respawn invulnerability**: ~2s, rendered as a flicker, during which the ship
  cannot be hit.
- **Waves**: each wave adds one more large asteroid (capped) and raises the
  speed range slightly.

### Stretch goals implemented

- **Hyperspace jump** (Shift): teleports the ship to a random point on screen.
- **High score persistence**: best score is saved to `localStorage` and shown
  on the game-over screen.
