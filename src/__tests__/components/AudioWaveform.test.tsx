import React from 'react';
import { render, screen } from '@testing-library/react';
import AudioWaveform from '../../components/AudioWaveform';

describe('AudioWaveform', () => {
  it('renders with correct number of bars', () => {
    render(<AudioWaveform isPlaying={false} />);
    const bars = document.querySelectorAll('.wave-bar');
    expect(bars).toHaveLength(24);
  });

  it('applies animation when playing', () => {
    render(<AudioWaveform isPlaying={true} />);
    const bars = document.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
      expect(bar).not.toHaveStyle('animation: none');
    });
  });

  it('removes animation when not playing', () => {
    render(<AudioWaveform isPlaying={false} />);
    const bars = document.querySelectorAll('.wave-bar');
    bars.forEach(bar => {
      expect(bar).toHaveStyle('animation: none');
    });
  });
});