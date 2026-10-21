const canvas = {
  target: document.getElementById("target"),
  preview: document.getElementById("preview"),
  gradation: document.getElementById("sv-gradation"),
};

const display = {
  target: {
    h: document.getElementById("h-target"),
    s: document.getElementById("s-target"),
    v: document.getElementById("v-target"),
  },
  preview: {
    h: document.getElementById("h-preview"),
    s: document.getElementById("s-preview"),
    v: document.getElementById("v-preview"),
  },
};

const result = {
  score: document.getElementById("score"),
  description: document.getElementById("description"),
  lamps: document.querySelectorAll(".lamp"),
};

const slider = document.getElementById("h-slider");
const nextButton = document.getElementById("next-button");

const state = { h: 180, s: 0.5, v: 0.5 };
const target = randomHsv();

fillCanvasWithHsv(canvas.target, target.h, target.s, target.v);

display.target.h.textContent = round(target.h);
display.target.s.textContent = round(target.s);
display.target.v.textContent = round(target.v);

setupDrag(canvas.gradation);
render();

slider.addEventListener("input", () => {
  state.h = Number(slider.value);
  render();
});

nextButton.addEventListener("click", () => {
  location.reload();
});

function render() {
  const { x, y } = svToPosition(canvas.gradation, state.s, state.v);

  drawGradation(canvas.gradation, state.h);
  drawPointer(canvas.gradation, x, y);
  fillCanvasWithHsv(canvas.preview, state.h, state.s, state.v);

  display.preview.h.textContent = round(state.h);
  display.preview.s.textContent = round(state.s);
  display.preview.v.textContent = round(state.v);

  const targetRGB = hsvToRgb(target.h, target.s, target.v);
  const previewRGB = hsvToRgb(state.h, state.s, state.v);

  const delta = deltaE76(targetRGB, previewRGB);
  result.score.textContent = "ΔE76: " + round(delta, 1);

  const description = describe(delta);
  result.description.textContent = description.label;

  turnon(description.level);
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

function turnon(count) {
  result.lamps.forEach((lamp, i) => {
    lamp.classList.toggle("on", i < count);
  });
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
