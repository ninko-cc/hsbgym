const random = document.getElementById("random");
const preview = document.getElementById("preview");
const gradation = document.getElementById("gradation");
const slider = document.getElementById("hue-slider");
const chad = document.getElementById("chad");
const state = { h: 180, s: 0.5, v: 0.5 };

const table = {
  h: document.getElementById("h-you"),
  s: document.getElementById("s-you"),
  v: document.getElementById("v-you"),
};

const { h: rh, s: rs, v: rv } = randomHsv();
fillCanvasWithHsv(random, rh, rs, rv);
document.getElementById("h-random").textContent = round(rh, 0);
document.getElementById("s-random").textContent = round(rs);
document.getElementById("v-random").textContent = round(rv);

slider.addEventListener("input", () => {
  state.h = Number(slider.value);
  render();
});

setupDrag(gradation);
render();

document
  .getElementById("next-color-button")
  .addEventListener("click", () => location.reload());

function render() {
  const { x, y } = svToPosition(gradation, state.s, state.v);

  drawGradation(gradation, state.h);
  drawPointer(gradation, x, y);
  fillCanvasWithHsv(preview, state.h, state.s, state.v);

  table.h.textContent = round(state.h);
  table.s.textContent = round(state.s);
  table.v.textContent = round(state.v);

  chad.style.visibility = match() ? "visible" : "hidden";
}

function match() {
  const dh = Math.abs(rh - state.h);
  const hueDiff = Math.min(dh, 360 - dh);

  return (
    hueDiff <= 3 &&
    Math.abs(rs - state.s) <= 0.04 &&
    Math.abs(rv - state.v) <= 0.04
  );
}

function setupDrag(canvas) {
  let dragging = false;

  const update = (e) => {
    const { s, v } = positionToSv(canvas, e.clientX, e.clientY);
    state.s = s;
    state.v = v;
    render();
  };

  const end = (e) => {
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    canvas.setPointerCapture(e.pointerId);
    update(e);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (dragging) update(e);
  });

  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
