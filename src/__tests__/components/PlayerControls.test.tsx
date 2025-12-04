import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PlayerControls from '../../components/PlayerControls';

const mockSong = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  duration: 180,
  coverUrl: 'test.jpg',
  audioUrl: 'test.mp3'
};

describe('PlayerControls', () => {
  const defaultProps = {
    song: mockSong,
    isPlaying: false,
    currentTime: 0,
    volume: 0.5,
    onPlay: jest.fn(),
    onPause: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onSeek: jest.fn(),
    onVolumeChange: jest.fn(),
  };

  it('renders play button when not playing', () => {
    render(<PlayerControls {...defaultProps} />);
    expect(screen.getByTestId('play-pause-button')).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    render(<PlayerControls {...defaultProps} isPlaying={true} />);
    expect(screen.getByTestId('play-pause-button')).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', () => {
    render(<PlayerControls {...defaultProps} />);
    fireEvent.click(screen.getByTestId('play-pause-button'));
    expect(defaultProps.onPlay).toHaveBeenCalled();
  });

  it('calls onPause when pause button is clicked', () => {
    render(<PlayerControls {...defaultProps} isPlaying={true} />);
    fireEvent.click(screen.getByTestId('play-pause-button'));
    expect(defaultProps.onPause).toHaveBeenCalled();
  });

  it('calls onPrevious when previous button is clicked', () => {
    render(<PlayerControls {...defaultProps} />);
    fireEvent.click(screen.getByTestId('prev-button'));
    expect(defaultProps.onPrevious).toHaveBeenCalled();
  });

  it('calls onNext when next button is clicked', () => {
    render(<PlayerControls {...defaultProps} />);
    fireEvent.click(screen.getByTestId('next-button'));
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it('updates volume when slider is changed', () => {
    render(<PlayerControls {...defaultProps} />);
    const volumeSlider = screen.getByTestId('volume-slider');
    fireEvent.change(volumeSlider, { target: { value: '0.8' } });
    expect(defaultProps.onVolumeChange).toHaveBeenCalledWith(0.8);
  });

  it('seeks to correct time when progress bar is changed', () => {
    render(<PlayerControls {...defaultProps} />);
    const progressBar = screen.getByTestId('progress-bar');
    fireEvent.change(progressBar, { target: { value: '60' } });
    expect(defaultProps.onSeek).toHaveBeenCalledWith(60);
  });
});