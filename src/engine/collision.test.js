import { describe, it, expect } from 'vitest';
import { circlesIntersect } from './collision.js';
import { Vector2 } from './vector.js';

function circle(x, y, radius) {
  return { position: new Vector2(x, y), radius };
}

describe('circlesIntersect', () => {
  it('detects overlapping circles', () => {
    expect(circlesIntersect(circle(0, 0, 5), circle(6, 0, 5))).toBe(true);
  });

  it('detects circles exactly touching as intersecting', () => {
    expect(circlesIntersect(circle(0, 0, 5), circle(10, 0, 5))).toBe(true);
  });

  it('detects circles that do not overlap', () => {
    expect(circlesIntersect(circle(0, 0, 5), circle(20, 0, 5))).toBe(false);
  });
});
