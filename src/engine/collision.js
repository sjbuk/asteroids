/**
 * Circle-based collision detection.
 * Every entity exposes a `position` (Vector2) and `radius` (number),
 * so a hit is just "are the two bounding circles overlapping".
 */
export function circlesIntersect(a, b) {
  const dx = a.position.x - b.position.x;
  const dy = a.position.y - b.position.y;
  const radii = a.radius + b.radius;
  return dx * dx + dy * dy <= radii * radii;
}
