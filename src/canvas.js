const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}

function isVisible(obj) {
  return (
    obj.x > -40 &&
    obj.x < canvas.width + 40 &&
    obj.y > -40 &&
    obj.y < canvas.height + 40);
}

export { canvas, ctx, drawTriangle, isVisible };