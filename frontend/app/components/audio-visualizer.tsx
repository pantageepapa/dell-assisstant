import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioVisualizer: React.FC = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    // Initialize WaveSurfer instance
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: 'blue',
        progressColor: 'green',
        cursorColor: 'navy',
        height: 150,
        barWidth: 2,
        normalize: true,
      });
    }

    // Clean up wavesurfer instance on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Load a static audio file (make sure the file is in the public directory or accessible)
    const audioFilePath = './Audio-Testfile.MP3';
    if (wavesurferRef.current) {
      wavesurferRef.current.load(audioFilePath);
    }
  }, []);

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  return (
    <div>
      <button onClick={handlePlayPause}>
        {wavesurferRef.current?.isPlaying() ? 'Pause' : 'Play'}
      </button>
      <div ref={waveformRef}></div>
    </div>
  );
};

export default AudioVisualizer;
