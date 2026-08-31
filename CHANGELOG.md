# Changelog

## Unreleased

Initial playable core, per the project spec's Definition of Done:

- Ship: rotation, thrust/drag physics (no instant stop), screen wrap, firing with cooldown
- Asteroids: spawn at edges, wrap, split Large → Medium → Small, size-scaled scoring
- Bullets: fixed lifespan, screen wrap, capped at 4 on-screen
- Circle-based collision detection (bullet↔asteroid, ship↔asteroid)
- Waves that progress on a full clear, scaling asteroid count/speed
- Lives, respawn invulnerability, game over and restart
- HUD: score, wave, lives
- Stretch: hyperspace jump, `localStorage` high score persistence
