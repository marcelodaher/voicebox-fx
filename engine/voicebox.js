// Pure knob->param mapping (no DOM, no Web Audio).
const MAX_SECONDS = 20;
const DELAY_TIME = 0.3;

// pitch 0.25..2, reverb/delay 0..1 -> node gains/rates
function params(pitch, reverb, delay) {
  const c = v => Math.min(1, Math.max(0, v));
  reverb = c(reverb);
  delay = c(delay);
  return {
    rate: Math.min(2, Math.max(0.25, pitch)),
    delayTime: DELAY_TIME,
    delayFeedback: delay * 0.85, // ponytail: fixed cap, no per-knob curve; add curve if hardware A/B says so
    delayMix: delay,
    reverbMix: reverb * 0.8,
    dry: 1 - 0.3 * Math.max(reverb, delay),
  };
}

// demo signal so UI works with no mic: quiet 150ms pulses every 500ms,
// gaps expose the delay echo + reverb tail; envelopes avoid clicks
function tone(freq, seconds, sampleRate) {
  const n = Math.floor(sampleRate * seconds), out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / sampleRate, ph = t % 0.5;
    const g = ph < 0.15 ? Math.min(1, ph / 0.01, (0.15 - ph) / 0.01) : 0;
    const e = Math.min(1, i / 200, (n - i) / 2000);
    out[i] = 0.3 * e * g * Math.sin(2 * Math.PI * freq * t);
  }
  return out;
}

if (typeof module !== "undefined") module.exports = { MAX_SECONDS, DELAY_TIME, params, tone };
