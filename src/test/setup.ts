import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock Web Audio API
class AudioContextMock {
  state = 'running';
  currentTime = 0;
  sampleRate = 44100;
  destination = {};

  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createBuffer(_channels: number, length: number) {
    return {
      getChannelData: () => new Float32Array(length),
    };
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  resume() {
    return Promise.resolve();
  }
}

// Attach to window
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: AudioContextMock,
});
Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: AudioContextMock,
});

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
