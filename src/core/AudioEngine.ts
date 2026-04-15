export class AudioEngine {
  private ctx: AudioContext | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new AudioContext();
  }

  playTripSuccess() {
    this.playTone(880, 0.1, 'sine'); // A5
    setTimeout(() => this.playTone(1320, 0.1, 'sine'), 50); // E6
  }

  playBuildingSpawn() {
    this.playTone(440, 0.2, 'triangle'); // A4
  }

  playDanger() {
    this.playTone(220, 0.3, 'sawtooth'); // A3
  }

  private playTone(freq: number, duration: number, type: OscillatorType) {
    if (!this.ctx) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}
