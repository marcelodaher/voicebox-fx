# voicebox_fx_software

Software version of Adafruit's [VoiceBox FX](https://learn.adafruit.com/voicebox-fx)
(hardware build covered by [Hackaday](https://hackaday.com/2026/09/05/voicebox-fx-is-a-blueprint-for-circuitpython-i2s-audio/)):
a Feather RP2350 + I2S mic/amp gadget that records, loops, and effects audio.

Goal: try the interaction model and the effect sounds **before buying/building
the hardware**. Same stack as `chord_generator`: pure engine + browser skin,
no dependencies.

## Layout

```
engine/voicebox.js  pure backend: knob → effect param mapping (no DOM, no Web Audio)
index.html          browser interface (record, loop, pitch/reverb/delay knobs)
test_voicebox.js    self-checks
```

## Run

- **Browser UI** — open `index.html` (Chrome/Safari; mic permission on first record)
- **Tests** — `node test_voicebox.js`, or without node: `deno run --unstable-detect-cjs --allow-read test_voicebox.js`

## Controls (mapped to the hardware)

| VoiceBox FX hardware | Here |
|---|---|
| I2S mic, 20 s sample | Record button / `R` key, auto-stops at 20 s |
| Loop playback | Play/Stop / `Space` |
| Pitch slider pot | Pitch slider 0.25×–2×, live while looping → `playbackRate` |
| Reverb pot | Reverb slider → wet level of a noise-IR `ConvolverNode` |
| Delay/echo pot | Delay slider → feedback on a 300 ms `DelayNode` loop |
| MAX98357A + speaker | Your speakers/headphones |

No mic? **Demo tone** button loads a 2 s tone so you can play with the knobs.

## Engine

`engine/voicebox.js` exports `params(pitch, reverb, delay)` — the only logic:
clamped knob values mapped to Web Audio node parameters (rate, dry/wet sends,
feedback capped at 0.85 so the echo can't run away). The browser skin is a
thin wrapper: MediaRecorder for capture, native AudioNodes for everything
audible; no per-sample JS loops.

## Changelog

- v0.1 — initial release: engine + browser UI + node/deno test. Python
  desktop prototype replaced by this browser version.
