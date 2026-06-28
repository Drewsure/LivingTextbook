// Rich audio system: polished game SFX via Web Audio API
// Uses layered oscillators, noise, filters, and proper envelopes for professional sound

let audioCtx: AudioContext | null = null;
let _muted = false;

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isMuted() { return _muted; }
export function setMuted(m: boolean) { _muted = m; }
export function toggleMute() { _muted = !_muted; return _muted; }

// ─── Helpers ─────────────────────────────────────────

function createNoise(ctx: AudioContext, duration: number, volume: number): { node: AudioBufferSourceNode; gain: GainNode } {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const node = ctx.createBufferSource();
  node.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  node.connect(gain);
  return { node, gain };
}

function playNote(ctx: AudioContext, freq: number, type: OscillatorType, startTime: number, duration: number, vol: number, attack = 0.01) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + attack);
  gain.gain.setValueAtTime(vol, startTime + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

// ─── CORRECT: Bright celebration chime ──────────────

export function playCorrectSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Bright ascending bell arpeggio (C5-E5-G5-C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const t = now + i * 0.06;
      // Main bell tone
      playNote(ctx, freq, "sine", t, 0.5, 0.18, 0.005);
      // Harmonic overtone for richness
      playNote(ctx, freq * 2, "sine", t, 0.3, 0.04, 0.005);
      // Triangle layer for warmth
      playNote(ctx, freq * 0.5, "triangle", t, 0.4, 0.06, 0.01);
    });

    // Sparkle shimmer on top
    const shimmer = ctx.createOscillator();
    const shimGain = ctx.createGain();
    shimmer.type = "sine";
    shimmer.frequency.setValueAtTime(2000, now + 0.2);
    shimmer.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
    shimGain.gain.setValueAtTime(0, now + 0.2);
    shimGain.gain.linearRampToValueAtTime(0.03, now + 0.25);
    shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    shimmer.connect(shimGain).connect(ctx.destination);
    shimmer.start(now + 0.2);
    shimmer.stop(now + 0.75);

    // Subtle noise burst for "pop" feel
    const { node: noise, gain: nGain } = createNoise(ctx, 0.08, 0.06);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 6000;
    nGain.connect(hpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0.06, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    noise.start(now);
    noise.stop(now + 0.1);
  } catch { /* Audio not available */ }
}

// ─── INCORRECT: Satisfying "nope" buzzer ────────────

export function playIncorrectSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Low pitched double buzz (game-show style)
    [0, 0.12].forEach((delay) => {
      const t = now + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(120, t + 0.12);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      // Low-pass filter to make it less harsh
      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 800;
      osc.connect(gain).connect(lpf).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });

    // Sub bass thump
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(80, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.2);
    subGain.gain.setValueAtTime(0.15, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    sub.connect(subGain).connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.3);

    // Noise crackle
    const { node: noise, gain: nGain } = createNoise(ctx, 0.15, 0.04);
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = 400;
    bpf.Q.value = 2;
    nGain.connect(bpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0.04, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.start(now);
    noise.stop(now + 0.2);
  } catch { /* Audio not available */ }
}

// ─── COMPLETE: Epic victory fanfare ──────────────────

export function playCompleteSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Rising sweep intro
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(200, now);
    sweep.frequency.exponentialRampToValueAtTime(800, now + 0.35);
    sweepGain.gain.setValueAtTime(0.1, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    sweep.connect(sweepGain).connect(ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.45);

    // Triumphant chord arpeggio (C-E-G-C-E-G-C)
    const fanfare = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((freq, i) => {
      const t = now + 0.3 + i * 0.07;
      playNote(ctx, freq, i < 4 ? "sine" : "triangle", t, 1.0, 0.14, 0.01);
      // Octave shimmer
      if (i >= 3) playNote(ctx, freq * 2, "sine", t + 0.02, 0.6, 0.03, 0.01);
    });

    // Final sustained power chord
    [523.25, 659.25, 783.99, 1046.5].forEach((freq) => {
      const t = now + 0.9;
      playNote(ctx, freq, "sine", t, 1.8, 0.08, 0.05);
    });

    // Cinematic noise swell
    const { node: noise, gain: nGain } = createNoise(ctx, 1.5, 0.02);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 3000;
    nGain.connect(hpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0, now + 0.3);
    nGain.gain.linearRampToValueAtTime(0.02, now + 0.8);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
    noise.start(now + 0.3);
    noise.stop(now + 2.1);
  } catch { /* Audio not available */ }
}

// ─── FLIP: Snappy card tap ──────────────────────────

export function playFlipSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Click transient
    const { node: noise, gain: nGain } = createNoise(ctx, 0.03, 0.12);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 4000;
    nGain.connect(hpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0.12, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    noise.start(now);
    noise.stop(now + 0.05);

    // Pitch-down pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch { /* Audio not available */ }
}

// ─── TICK: Metronome countdown ──────────────────────

export function playTickSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Crisp click
    const { node: noise, gain: nGain } = createNoise(ctx, 0.015, 0.15);
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 5000;
    nGain.connect(hpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0.15, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
    noise.start(now);
    noise.stop(now + 0.03);

    // Tonal ping
    playNote(ctx, 1200, "sine", now, 0.08, 0.08, 0.002);
  } catch { /* Audio not available */ }
}

// ─── COMBO: Escalating streak chime ──────────────────

export function playComboSound(streak: number) {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Base frequency rises with streak
    const baseFreq = 500 + Math.min(streak, 8) * 80;

    // Three-note ascending sparkle
    [0, 0.05, 0.1].forEach((delay, i) => {
      const t = now + delay;
      const freq = baseFreq + i * 150;
      playNote(ctx, freq, "sine", t, 0.2, 0.12, 0.005);
      playNote(ctx, freq * 1.5, "triangle", t, 0.15, 0.04, 0.005);
    });

    // Extra shimmer for high streaks
    if (streak >= 3) {
      const shim = ctx.createOscillator();
      const shimGain = ctx.createGain();
      shim.type = "sine";
      shim.frequency.setValueAtTime(baseFreq * 3, now + 0.1);
      shim.frequency.exponentialRampToValueAtTime(baseFreq * 4, now + 0.3);
      shimGain.gain.setValueAtTime(0, now + 0.1);
      shimGain.gain.linearRampToValueAtTime(0.02, now + 0.15);
      shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      shim.connect(shimGain).connect(ctx.destination);
      shim.start(now + 0.1);
      shim.stop(now + 0.4);
    }
  } catch { /* Audio not available */ }
}

// ─── LEVEL UP: Heroic ascending fanfare ──────────────

export function playLevelUpSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Dramatic sweep up
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sawtooth";
    sweep.frequency.setValueAtTime(200, now);
    sweep.frequency.exponentialRampToValueAtTime(1600, now + 0.4);
    sweepGain.gain.setValueAtTime(0.06, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    // Gentle filter to remove harshness
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 2000;
    sweep.connect(sweepGain).connect(lpf).connect(ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.55);

    // Major chord burst (C-E-G)
    [523.25, 659.25, 783.99].forEach((freq) => {
      const t = now + 0.35;
      playNote(ctx, freq, "sine", t, 0.8, 0.15, 0.02);
      playNote(ctx, freq * 2, "sine", t + 0.05, 0.5, 0.04, 0.02);
    });

    // Sparkle dust
    [2000, 2500, 3000].forEach((freq, i) => {
      const t = now + 0.5 + i * 0.06;
      playNote(ctx, freq, "sine", t, 0.25, 0.025, 0.005);
    });
  } catch { /* Audio not available */ }
}

// ─── POWER-UP: Whoosh + charge ──────────────────────

export function playPowerUpSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Whoosh sweep
    const { node: noise, gain: nGain } = createNoise(ctx, 0.3, 0.06);
    const bpf = ctx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.setValueAtTime(500, now);
    bpf.frequency.exponentialRampToValueAtTime(4000, now + 0.15);
    bpf.frequency.exponentialRampToValueAtTime(2000, now + 0.3);
    bpf.Q.value = 3;
    nGain.connect(bpf).connect(ctx.destination);
    nGain.gain.setValueAtTime(0, now);
    nGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    noise.start(now);
    noise.stop(now + 0.35);

    // Tonal charge-up
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.2);
    osc.frequency.setValueAtTime(1400, now + 0.22);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.setValueAtTime(0.1, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    // Confirmation ping
    playNote(ctx, 1200, "sine", now + 0.2, 0.2, 0.1, 0.005);
    playNote(ctx, 1800, "sine", now + 0.25, 0.15, 0.06, 0.005);
  } catch { /* Audio not available */ }
}

// ─── SELECT: UI tap sound ────────────────────────────

export function playSelectSound() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    playNote(ctx, 800, "sine", now, 0.08, 0.08, 0.003);
    playNote(ctx, 1200, "sine", now + 0.015, 0.06, 0.04, 0.003);
  } catch { /* Audio not available */ }
}

// ─── COUNTDOWN BEEP: For countdown overlay ──────────

export function playCountdownBeep(count: number) {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    // Higher pitch for "Go!", lower for numbers
    const freq = count === 0 ? 880 : 440;
    const vol = count === 0 ? 0.15 : 0.1;
    playNote(ctx, freq, "sine", now, 0.15, vol, 0.005);
    if (count === 0) {
      playNote(ctx, freq * 1.5, "sine", now + 0.02, 0.12, 0.06, 0.005);
    }
  } catch { /* Audio not available */ }
}
