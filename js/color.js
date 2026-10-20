function randomHsv() {
  return {
    h: Math.random() * 360,
    s: Math.random(),
    v: Math.random(),
  };
}

function hsvToHsl(h, s, v) {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return { h, s: sl, l };
}
