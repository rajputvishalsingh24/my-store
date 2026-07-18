// Self-contained Web Audio API synthesizer for premium UI sounds
// Sourced locally from mathematical oscillator synthesis to ensure 100% offline reliability

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a soft, pleasant click/pop sound for button clicks.
 */
export function playSoftClick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Quick pop / click frequency modulation
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
    
    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn("Audio Context Click blocked or unsupported", e);
  }
}

/**
 * Synthesizes a celebratory string of popping firecrackers.
 */
export function playCrackers() {
  try {
    const ctx = getAudioContext();
    const duration = 2.5; // string of crackers lasts 2.5 seconds
    const crackleCount = 28;
    
    // Generate static white noise buffer once for rapid high-frequency snapping bursts
    const bufferSize = ctx.sampleRate * 0.08; // 80ms noise bursts
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    for (let i = 0; i < crackleCount; i++) {
      // Staggered launch timings
      const timeOffset = Math.random() * duration;
      
      // 1. Occasional low explosion booms (bass thump)
      if (i % 4 === 0) {
        const boomOsc = ctx.createOscillator();
        const boomGain = ctx.createGain();
        
        boomOsc.connect(boomGain);
        boomGain.connect(ctx.destination);
        
        boomOsc.frequency.setValueAtTime(140, ctx.currentTime + timeOffset);
        boomOsc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + timeOffset + 0.18);
        
        boomGain.gain.setValueAtTime(0.25, ctx.currentTime + timeOffset);
        boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.22);
        
        boomOsc.start(ctx.currentTime + timeOffset);
        boomOsc.stop(ctx.currentTime + timeOffset + 0.24);
      }
      
      // 2. High frequency sharp cracking snaps using filtered white noise
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500 + Math.random() * 2500, ctx.currentTime + timeOffset);
      
      const noiseGain = ctx.createGain();
      
      noiseNode.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      
      noiseGain.gain.setValueAtTime(0.12, ctx.currentTime + timeOffset);
      noiseGain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + timeOffset + 0.06);
      
      noiseNode.start(ctx.currentTime + timeOffset);
      noiseNode.stop(ctx.currentTime + timeOffset + 0.07);
    }
  } catch (e) {
    console.warn("Audio Context Crackers blocked or unsupported", e);
  }
}
