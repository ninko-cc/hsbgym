function rgbToLab([r, g, b]) {
  // sRGB(0-255) → リニアRGB
  [r, g, b] = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92));

  // リニアRGB → XYZ (D65) を白色点で正規化
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // XYZ → Lab
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  [x, y, z] = [f(x), f(y), f(z)];
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function deltaE76(rgb1, rgb2) {
  const [L1, a1, b1] = rgbToLab(rgb1);
  const [L2, a2, b2] = rgbToLab(rgb2);
  return Math.hypot(L1 - L2, a1 - a2, b1 - b2);
}

function describe(deltaE) {
  const levels = [
    { max: 2, level: 5, label: "Indistinguishable to the human eye" },
    { max: 5, level: 4, label: "Noticeable only on close inspection" },
    { max: 10, level: 3, label: "Noticeable at a glance" },
    { max: 20, level: 2, label: "Similar, but clearly different" },
    { max: 40, level: 1, label: "Different, but in the same family" },
    { max: Infinity, level: 0, label: "Completely different colors" },
  ];
  return levels.find((l) => deltaE < l.max);
}
