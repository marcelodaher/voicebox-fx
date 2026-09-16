const assert = require("assert");
const { MAX_SECONDS, DELAY_TIME, params, tone } = require("./engine/voicebox.js");

assert.strictEqual(MAX_SECONDS, 20);
assert.strictEqual(DELAY_TIME, 0.3);

const z = params(1, 0, 0);
assert.deepStrictEqual([z.rate, z.delayMix, z.reverbMix, z.delayFeedback], [1, 0, 0, 0]);

const f = params(2, 1, 1);
assert.strictEqual(f.delayFeedback, 0.85);
assert(f.reverbMix > 0 && f.delayMix > 0 && f.dry < 1);
assert.strictEqual(f.delayTime, 0.3);

assert.strictEqual(params(99, 0, 0).rate, 2);
assert.strictEqual(params(0, 0, 0).rate, 0.25);
assert.strictEqual(params(-5, 3, -1).delayFeedback, 0);

const t = tone(220, 0.1, 44100);
assert.strictEqual(t.length, 4410);
assert(Math.abs(t[t.length - 1]) < 0.01);
assert(Math.max(...Array.from(t.slice(2000, 2100), Math.abs)) > 0.01);

const p2 = tone(220, 2, 44100);
assert(Math.abs(p2[Math.floor(44100 * 0.3)]) < 0.005, "pulse gap is silent");
assert(Math.max(...Array.from(p2.slice(2000, 4000), Math.abs)) < 0.35, "demo is quiet");
assert(Math.max(...Array.from(p2.slice(2000, 4000), Math.abs)) > 0.05, "pulse is audible");

console.log("engine ok: mapping, clamps, delay, tone");
