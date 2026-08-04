// Web Audio Synthesizer for Detective Game Sound Effects

class SoundEffects {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Realistic Rubber Stamp Slam Sound Effect (Official Case File Stamp)
  playStampSlam() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Initial sharp rubber cushion impact snap (High-pass noise transient)
      const clickBufferSize = Math.floor(this.ctx.sampleRate * 0.025);
      const clickBuffer = this.ctx.createBuffer(1, clickBufferSize, this.ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickBufferSize; i++) {
        clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickBufferSize * 0.2));
      }

      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = clickBuffer;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = 'highpass';
      clickFilter.frequency.setValueAtTime(1200, now);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickSource.start(now);

      // 2. Solid wooden handle pop / body resonance
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(450, now);
      popOsc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      popGain.gain.setValueAtTime(0.6, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.06);

      // 3. Heavy solid desk thud (Low sine drop)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(160, now);
      thudOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

      thudGain.gain.setValueAtTime(0.9, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thudOsc.start(now);
      thudOsc.stop(now + 0.18);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Correct Chime Sound Effect
  playCorrectChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Wrong Dissonant Buzzer
  playWrongBuzz() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(150, now);
      osc2.frequency.setValueAtTime(158, now); // Dissonant beat

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Mysterious dark whisper / shadow sound effect for Medical Examiner clue reveal / change
  playDarkWhisper() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Shadow Noise Whisper Breath (Bandpass sweep for secretive whisper sound)
      const duration = 0.75;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Dynamic Bandpass filter to create realistic dark whisper/breath resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.0, now);
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + duration * 0.85);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noiseSource.start(now);

      // 2. Secretive Noir Sub Drop (Deep low frequency rumble)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(120, now);
      subOsc.frequency.exponentialRampToValueAtTime(42, now + duration * 0.8);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + duration);

      // 3. Eerie Dark Minor Interval Tone (Classified atmosphere)
      const toneOsc = this.ctx.createOscillator();
      const toneGain = this.ctx.createGain();
      toneOsc.type = 'triangle';
      toneOsc.frequency.setValueAtTime(220, now + 0.05); // A3
      toneOsc.frequency.exponentialRampToValueAtTime(207.65, now + 0.3); // G#3 (Mystery minor accent)

      toneGain.gain.setValueAtTime(0.001, now);
      toneGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      toneGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      toneOsc.connect(toneGain);
      toneGain.connect(this.ctx.destination);
      toneOsc.start(now);
      toneOsc.stop(now + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

export const sfx = new SoundEffects();
