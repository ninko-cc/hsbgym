function svToPosition(canvas, s, v) {
  return {
    x: s * canvas.width,
    y: (1 - v) * canvas.height,
  };
}

function positionToSv(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();

  const x = (clientX - rect.left) * (canvas.width / rect.width);
  const y = (clientY - rect.top) * (canvas.height / rect.height);

  return {
    s: Math.min(1, Math.max(0, x / canvas.width)),
    v: Math.min(1, Math.max(0, 1 - y / canvas.height)),
  };
}

function drawGradation(canvas, hue) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;

  // X: Saturation
  const gradH = ctx.createLinearGradient(0, 0, w, 0);
  gradH.addColorStop(0, "#fff");
  gradH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, w, h);

  // Y: Value
  const gradV = ctx.createLinearGradient(0, 0, 0, h);
  gradV.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradV.addColorStop(1, "#000");
  ctx.fillStyle = gradV;
  ctx.fillRect(0, 0, w, h);
}

function drawPointer(canvas, x, y, radius = 7) {
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y, radius + 1, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function fillCanvasWithHsv(canvas, h, s, v) {
  const ctx = canvas.getContext("2d");
  const hsl = hsvToHsl(h, s, v);

  ctx.fillStyle = `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
