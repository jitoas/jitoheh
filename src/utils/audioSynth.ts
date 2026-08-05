// Web Audio Synthesizer for Detective Game Sound Effects

class SoundEffects {
  private ctx: AudioContext | null = null;
  private isPlayingStamp = false;

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

  // Single Heavy Paper / Case File Impact Sound
  // Plays ONCE with a heavy, clean, cinematic thud matching Noir investigation style.
  playStampSound() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      // Concurrency / repeat guard: never overlap or restart while playing
      if (this.isPlayingStamp) {
        return;
      }

      this.isPlayingStamp = true;
      setTimeout(() => {
        this.isPlayingStamp = false;
      }, 600);

      const now = this.ctx.currentTime;

      // 1. Initial Crisp Paper/Rubber Contact Noise (Lowpassed noise transient)
      const noiseLen = 0.06;
      const bufferSize = Math.floor(this.ctx.sampleRate * noiseLen);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(900, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(150, now + noiseLen);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseLen);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseSource.start(now);

      // 2. Heavy Sub Bass Impact Body (Deep pitch sweep)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(150, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.22);

      subGain.gain.setValueAtTime(1.0, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.25);

      // 3. Resonant Desk / Case File Punch
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'triangle';
      bodyOsc.frequency.setValueAtTime(100, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(25, now + 0.14);

      bodyGain.gain.setValueAtTime(0.7, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.16);

    } catch (e) {
      this.isPlayingStamp = false;
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

