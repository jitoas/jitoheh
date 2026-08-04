// Web Audio Synthesizer for Detective Game Sound Effects

class SoundEffects {
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('click', unlock, { capture: true });
      window.addEventListener('touchstart', unlock, { capture: true });
      window.addEventListener('keydown', unlock, { capture: true });
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Stamp Sound: Real mechanical rubber stamp slam on paper
  playStampSound() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const now = this.ctx.currentTime;

      // 4 Presses sequence timing: t = 0s, 0.08s, 0.16s, 0.28s (final heavy slam)
      const presses = [
        { time: now + 0.0, volume: 0.4, pitch: 350 },
        { time: now + 0.08, volume: 0.5, pitch: 380 },
        { time: now + 0.16, volume: 0.6, pitch: 400 },
        { time: now + 0.28, volume: 1.0, pitch: 120 }, // Final heavy impact slam
      ];

      presses.forEach((p, idx) => {
        if (!this.ctx) return;

        // Mechanical click / paper hit noise
        const noiseLen = idx === 3 ? 0.12 : 0.03;
        const bufferSize = Math.floor(this.ctx.sampleRate * noiseLen);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = idx === 3 ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(idx === 3 ? 600 : 2200, p.time);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(p.volume, p.time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, p.time + noiseLen);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSource.start(p.time);

        // Heavy body thud for stamp impact
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = idx === 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(p.pitch, p.time);
        osc.frequency.exponentialRampToValueAtTime(idx === 3 ? 35 : 100, p.time + (idx === 3 ? 0.2 : 0.04));

        oscGain.gain.setValueAtTime(p.volume * (idx === 3 ? 1.0 : 0.4), p.time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, p.time + (idx === 3 ? 0.22 : 0.05));

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(p.time);
        osc.stop(p.time + (idx === 3 ? 0.22 : 0.05));
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playStampSlam() {
    this.playStampSound();
  }

  // 2. Bell Sound: 176310__slina__bell_sound_140.wav
  // Resonant reception desk bell chime ring.
  // Plays ONLY when the Medical Examiner reveals or changes a clue for everyone.
  playBellSound() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Bell metallic strike frequencies (Fundamental + Overtones)
      const freqs = [1400, 2800, 4200, 5600, 7100];
      const gains = [0.4, 0.25, 0.15, 0.08, 0.04];
      const decays = [1.6, 1.2, 0.8, 0.5, 0.3];

      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[i]);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + decays[i]);
      });

      // Sharp initial metallic hammer strike tap
      const strikeSize = Math.floor(this.ctx.sampleRate * 0.015);
      const strikeBuffer = this.ctx.createBuffer(1, strikeSize, this.ctx.sampleRate);
      const strikeData = strikeBuffer.getChannelData(0);
      for (let i = 0; i < strikeSize; i++) {
        strikeData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (strikeSize * 0.1));
      }

      const strikeSource = this.ctx.createBufferSource();
      strikeSource.buffer = strikeBuffer;

      const strikeFilter = this.ctx.createBiquadFilter();
      strikeFilter.type = 'highpass';
      strikeFilter.frequency.setValueAtTime(3000, now);

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.5, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      strikeSource.connect(strikeFilter);
      strikeFilter.connect(strikeGain);
      strikeGain.connect(this.ctx.destination);
      strikeSource.start(now);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playMedicalExaminerSound() {
    this.playBellSound();
  }
}

export const sfx = new SoundEffects();

