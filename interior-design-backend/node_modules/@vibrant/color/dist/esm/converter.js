const DELTAE94_DIFF_STATUS = {
  NA: 0,
  PERFECT: 1,
  CLOSE: 2,
  GOOD: 10,
  SIMILAR: 50
};
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) throw new RangeError(`'${hex}' is not a valid hex color`);
  if (!m[1] || !m[2] || !m[3])
    throw new RangeError(`'${hex}' is not a valid hex color`);
  return [m[1], m[2], m[3]].map((s) => parseInt(s, 16));
}
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
}
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}
function rgbToXyz(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r > 0.04045 ? Math.pow((r + 5e-3) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 5e-3) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 5e-3) / 1.055, 2.4) : b / 12.92;
  r *= 100;
  g *= 100;
  b *= 100;
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
  return [x, y, z];
}
function xyzToCIELab(x, y, z) {
  const REF_X = 95.047;
  const REF_Y = 100;
  const REF_Z = 108.883;
  x /= REF_X;
  y /= REF_Y;
  z /= REF_Z;
  x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  const L = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [L, a, b];
}
function rgbToCIELab(r, g, b) {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToCIELab(x, y, z);
}
function deltaE94(lab1, lab2) {
  const WEIGHT_L = 1;
  const WEIGHT_C = 1;
  const WEIGHT_H = 1;
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const dL = L1 - L2;
  const da = a1 - a2;
  const db = b1 - b2;
  const xC1 = Math.sqrt(a1 * a1 + b1 * b1);
  const xC2 = Math.sqrt(a2 * a2 + b2 * b2);
  let xDL = L2 - L1;
  let xDC = xC2 - xC1;
  const xDE = Math.sqrt(dL * dL + da * da + db * db);
  let xDH = Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC)) ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC) : 0;
  const xSC = 1 + 0.045 * xC1;
  const xSH = 1 + 0.015 * xC1;
  xDL /= WEIGHT_L;
  xDC /= WEIGHT_C * xSC;
  xDH /= WEIGHT_H * xSH;
  return Math.sqrt(xDL * xDL + xDC * xDC + xDH * xDH);
}
function rgbDiff(rgb1, rgb2) {
  const lab1 = rgbToCIELab.apply(void 0, rgb1);
  const lab2 = rgbToCIELab.apply(void 0, rgb2);
  return deltaE94(lab1, lab2);
}
function hexDiff(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  return rgbDiff(rgb1, rgb2);
}
function getColorDiffStatus(d) {
  if (d < DELTAE94_DIFF_STATUS.NA) {
    return "N/A";
  }
  if (d <= DELTAE94_DIFF_STATUS.PERFECT) {
    return "Perfect";
  }
  if (d <= DELTAE94_DIFF_STATUS.CLOSE) {
    return "Close";
  }
  if (d <= DELTAE94_DIFF_STATUS.GOOD) {
    return "Good";
  }
  if (d < DELTAE94_DIFF_STATUS.SIMILAR) {
    return "Similar";
  }
  return "Wrong";
}
export {
  DELTAE94_DIFF_STATUS,
  deltaE94,
  getColorDiffStatus,
  hexDiff,
  hexToRgb,
  hslToRgb,
  rgbDiff,
  rgbToCIELab,
  rgbToHex,
  rgbToHsl,
  rgbToXyz,
  xyzToCIELab
};
//# sourceMappingURL=converter.js.map
