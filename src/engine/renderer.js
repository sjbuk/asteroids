export function clearCanvas(ctx, width, height) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws a closed polygon (array of {x, y} points, already in world space)
 * stroked with the given color, centered/rotated by the caller.
 */
export function strokePolygon(ctx, points, { color = '#fff', lineWidth = 1.5, closed = true } = {}) {
  if (points.length === 0) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  if (closed) ctx.closePath();
  ctx.stroke();
}

export function drawCircle(ctx, x, y, radius, { color = '#fff', fill = false } = {}) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

/**
 * Invokes `drawFn(offsetX, offsetY)` up to 9 times so entities near an edge
 * render "ghost" copies on the opposite side(s), matching the wrap-around
 * movement in engine/entities. drawFn draws relative to (0,0); the renderer
 * translates the canvas context for each offset.
 */
export function drawWithScreenWrap(ctx, position, radius, width, height, drawFn) {
  const needsLeft = position.x - radius < 0;
  const needsRight = position.x + radius > width;
  const needsTop = position.y - radius < 0;
  const needsBottom = position.y + radius > height;

  const xOffsets = [0];
  if (needsLeft) xOffsets.push(width);
  if (needsRight) xOffsets.push(-width);
  const yOffsets = [0];
  if (needsTop) yOffsets.push(height);
  if (needsBottom) yOffsets.push(-height);

  for (const ox of xOffsets) {
    for (const oy of yOffsets) {
      ctx.save();
      ctx.translate(position.x + ox, position.y + oy);
      drawFn();
      ctx.restore();
    }
  }
}
