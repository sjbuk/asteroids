import { describe, it, expect } from 'vitest';
import { Vector2 } from './vector.js';

describe('Vector2', () => {
  it('adds and subtracts', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    expect(a.add(b)).toEqual(new Vector2(4, 6));
    expect(b.sub(a)).toEqual(new Vector2(2, 2));
  });

  it('scales', () => {
    expect(new Vector2(2, 3).scale(2)).toEqual(new Vector2(4, 6));
  });

  it('computes length', () => {
    expect(new Vector2(3, 4).length()).toBe(5);
  });

  it('normalizes to a unit vector', () => {
    const n = new Vector2(5, 0).normalize();
    expect(n.x).toBeCloseTo(1);
    expect(n.y).toBeCloseTo(0);
  });

  it('normalize of a zero vector stays zero (no divide-by-zero)', () => {
    expect(new Vector2(0, 0).normalize()).toEqual(new Vector2(0, 0));
  });

  it('builds a vector from an angle and length', () => {
    const v = Vector2.fromAngle(0, 5);
    expect(v.x).toBeCloseTo(5);
    expect(v.y).toBeCloseTo(0);
  });
});
